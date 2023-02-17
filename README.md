# Graphylizer

## Setup:

Pull the image from DockerHub and expose port 80:

```bash
docker run -p 8080:80 -d pkemkes/graphylizer
```

Or build the image yourself with the provided `Dockerfile`:

```bash
docker build -t graphylizer .
docker run -p 8080:80 -d graphylizer
```

## Usage:

"Upload" a file when prompted. All processing is ran in the browser. The content is read and a graph is parsed. 

*Reset*: Resets the graph view to its original state.

*Reload*: Opens the prompt for loading a file again.

*Rotate*: Changes the orientation from "top-to-bottom" to "left-to-right" and vice versa.

**Note**: Currently, only `build.cake` files are supported.



## Idea:

Lately, I stumbled over some `build.cake` files that had so many dependencies that I couldn't wrap my head around how they worked. I have searched quite a while for a good solution to visualize the dependencies of the internal tasks, but I couldn't find any.

That's when I couldn't take it any more and built my own solution. It parses the provided file and renders a simple graph using cytoscape-js. The layout is rendered using cytoscape-dagre.

## Screenshot:

<img src="./assets/screenshot.png" alt="screenshot.png" width="800"/>