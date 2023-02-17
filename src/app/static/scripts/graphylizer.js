const fileInputArea = document.getElementById("file-input-area");
const fileInput = document.getElementById("file-input");
const resetButton = document.getElementById("reset-button");
const reloadButton = document.getElementById("reload-button");
const rotateButton = document.getElementById("rotate-button");
const cancelButton = document.getElementById("cancel-button");

var rankDir = "TB";

fileInput.addEventListener("change", (event) => {
    event.target.files[0].text().then(parseToGraph);
    fileInputArea.style.display = "none";
});
fileInputArea.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();
    fileInputArea.classList = ["is-dragover"]
    // Style the drag-and-drop as a "copy file" operation.
    event.dataTransfer.dropEffect = "copy";
});
fileInputArea.addEventListener("drop", (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.files[0].text().then(parseToGraph);
    fileInputArea.classList = ["is-not-dragover"];
    fileInputArea.style.display = "none";
});
fileInputArea.addEventListener("dragenter", () => fileInputArea.classList = ["is-dragover"]);
fileInputArea.addEventListener("dragleave", () => fileInputArea.classList = ["is-not-dragover"]);
fileInputArea.addEventListener("dragend", () => fileInputArea.classList = ["is-not-dragover"]);
resetButton.addEventListener("click", renderGraph);
reloadButton.addEventListener("click", () => fileInputArea.style.display = "block");
rotateButton.addEventListener("click", () => {
    rankDir = rankDir == "TB" ? "LR" : "TB";
    renderGraph();
})
cancelButton.addEventListener("click", () => fileInputArea.style.display = "none");

function defineGraph() {
    var cyContainer = document.getElementById("cy");

    var cy = cytoscape({
        container: cyContainer,
        wheelSensitivity: 0.5,
        minZoom: 0.1,
        maxZoom: 10
    });

    cy.style([
        {
            selector: "node",
            style: {
                "background-color": "#666",
                "label": "data(label)",
                "shape": "round-rectangle",
                "text-valign": "center",
                "text-halign": "center",
                "width": "data(width)",
                "font-family": "monospace"
            }
        },
        {
            selector: "edge",
            style: {
                "width": 3,
                "line-color": "#ccc",
                "target-arrow-color": "#ccc",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier"
            }
        }
    ]);

    return cy;
}

var cy = defineGraph();

function parseToGraph(text) {
    let cleanedText = removeFullLineComments(text);
    let elements = parseGraphElements(cleanedText);
    cy.add(elements);
    renderGraph();
}

function removeFullLineComments(text) {
    let lines = text.split("\n");
    let cleanedLines = [];
    lines.forEach(line => {
        if (line.startsWith("//")) return;
        cleanedLines.push(line);
    })
    return cleanedLines.join("\n");
} 

function parseGraphElements(text) {
    let tasks = extractTasks(text);
    let parsedTasks = parseTasks(tasks);
    return generateElements(parsedTasks);
}

const taskRE = /Task\(/

function extractTasks(text) {
    let tasks = []
    let currentIndex = 0;
    while (true) {
        let restText = text.substr(currentIndex);
        let charsUntilTask = restText.search(taskRE);
        if (charsUntilTask == -1) break;
        let task = splitNextTaskIntoBlocks(restText.substr(charsUntilTask));
        tasks.push(task);
        currentIndex += charsUntilTask + calcLengthOfTask(task);
    }
    return tasks;
}

function splitNextTaskIntoBlocks(text) {
    let parantheses = 0;
    let currentBlockStart = 0;
    let blocks = []
    for (let i = 0; i < text.length; i++) {
        if (text[i] == "(") parantheses++;
        else if (text[i] == ")") parantheses--;
        else if (text[i] == "." && parantheses == 0) {
            blocks.push(text.substr(currentBlockStart, i-currentBlockStart));
            currentBlockStart = i+1;
        }
        else if (text[i] == ";" && parantheses == 0) {
            blocks.push(text.substr(currentBlockStart, i-currentBlockStart));
            return blocks;
        }
    }
    return []
}

function calcLengthOfTask(blocks) {
    let length = 0;
    blocks.map(b => length += b.length + 1);
    return length
}

const taskNameRE = /Task\("([^"]+)"\)/
const dependsOnNameRE = /IsDependentOn\("([^"]+)"\)/

function parseTasks(tasks) {
    let parsedTasks = [];
    tasks.forEach(task => {
        let label = "";
        let dependsOn = [];
        task.forEach(block => {
            // ToDo: Need to add more handling for edge cases like comments in tasks
            if (block.startsWith("Task")) label = block.match(taskNameRE)[1];
            else if (block.startsWith("IsDependentOn")) dependsOn.push(block.match(dependsOnNameRE)[1]);
            // ToDo: Potentially parse other blocks and show as "content"
        });
        parsedTasks.push({
            label: label,
            dependsOn: dependsOn,
            id: parsedTasks.length.toString()
        });
    });
    return parsedTasks;
}

function generateElements(parsedTasks) {
    let elements = [];
    parsedTasks.forEach(pT => {
        elements.push({
            group: "nodes",
            data: {
                id: pT.id,
                label: pT.label,
                width: pT.label.length * 10 + 18
            }
        });
        pT.dependsOn.forEach(depLabel => {
            let otherId = parsedTasks.filter(otherPT => otherPT.label == depLabel)[0].id
            elements.push({
                group: "edges",
                data: {
                    id: pT.id + "->" + otherId,
                    source: pT.id,
                    target: otherId
                }
            })
        });
    });
    return elements;
}

function renderGraph() {
    cy.layout({
        name: "dagre",
        rankDir: rankDir
    }).run()
}