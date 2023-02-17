Task("TaskA")
    .Does(() =>
    {
        CustomFunction();
    });

Task("TaskB")
    .IsDependentOn("TaskA")
    .Does(() =>
    {
        CustomFunction();
    });

Task("TaskC")
    .IsDependentOn("TaskA")
    .Does(() =>
    {
        CustomFunction();
    });

Task("TaskD")
    .IsDependentOn("TaskA")
    .Does(() =>
    {
        CustomFunction();
    });

Task("TaskE")
    .IsDependentOn("TaskB")
    .IsDependentOn("TaskC")
    .Does(() =>
    {
        CustomFunction();
    });

Task("TaskF")
    .IsDependentOn("TaskD")
    .Does(() =>
    {
        CustomFunction();
    });

Task("TaskG")
    .IsDependentOn("TaskE")
    .IsDependentOn("TaskF")
    .Does(() =>
    {
        CustomFunction();
    });

Task("Default")
    .IsDependentOn("TaskG");