function init() {
    var $ = go.GraphObject.make;
    
    // canvas diagram 
    diagram = $(go.Diagram, "canvas-diagram", {
        allowDrop: true, // must be true to accept drops from the palette
        allowVerticalScroll: false,
        allowHorizontalScroll: false,
        //layout: $(go.LayeredDigraphLayout),
        "ExternalObjectsDropped": function(e) {
                      if (warehouse.commandHandler.canDeleteSelection() &&
                          !(warehouse.lastInput.control || warehouse.lastInput.meta)) {
                        warehouse.commandHandler.deleteSelection();
                      }
                    }
    });
    
    diagram.model = $(go.GraphLinksModel, {
//        nodeDataArray: [
//            {key: 1, category: 'first'},
//            {key: 2, category: 'second'},
//        ], 
//        linkDataArray: [
//            {from: 1, to: 2},
//            {from: 2, to: 3},
//        ]
    });
    
    // set diagram grid
    //diagram.grid.visible = true;
    diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(25, 25);
    //diagram.toolManager.draggingTool.gridSnapOrigin = new go.Point(0, 0);
    
    
    // canvas warehouse
    warehouse = $(go.Diagram, "canvas-warehouse", {
            allowDrop: true, // must be true to accept drops from the palette
            allowDragOut: true,
            allowVerticalScroll: false,
            allowHorizontalScroll: true,
             "ExternalObjectsDropped": function(e) {
                      if (diagram.commandHandler.canDeleteSelection() &&
                          !(diagram.lastInput.control || diagram.lastInput.meta)) {
                        diagram.commandHandler.deleteSelection();
                      }
             },
            layout: $(go.GridLayout)
    });
    
//    warehouse.model = $(go.GraphLinksModel, {
//        nodeDataArray: [
//            {key: 1, category: "first"},
//        ]    
//    });
//    
    warehouse.nodeTemplate = $(go.Node, 'Auto', $(go.Shape, 'Trapezoid', 
                                                  {"fill": "#999999",
                                                  "stroke": "grey",
                                                   "strokeWidth": 2,
                                                   "angle": 90,
                                                   "width": 120,
                                                   "height": 50
                                                  }));
    
    // diagram and warehouse share the same template and undo manager
    diagram.nodeTemplate = warehouse.nodeTemplate;
    diagram.model.undoManager = warehouse.model.undoManager;
    //diagram.model.undoManager.isEnabled = true;
    
    
    // canvas palette
    function mouseEnter(e, obj) {
        var shape = obj.findObject("SHAPE");
        shape.fill = "#C1D5E3";
        shape.stroke = null;
        var text = obj.findObject("TEXT");
        text.stroke = "#5f6366";
    };

    function mouseLeave(e, obj) {
        var shape = obj.findObject("SHAPE");
        // Return the Shape's fill and stroke to the defaults
        shape.fill = obj.data.color;
        shape.stroke = null;
        // Return the TextBlock's stroke to its default
        var text = obj.findObject("TEXT");
        text.stroke = "white";
    };
    
    var input = 0;
    var output = 0;
    function click() {
        var txt;
        input = prompt("Please enter input dimension: ", "100");
        output = prompt("Please enter output dimension: ", "100");
        if (input == null || input == "" || output == null || output == "") {
            alert("Please enter valid dimensions!");
        } else {
            //createObject(input, output);    
            warehouse.model.addNodeData({key: 2, category: "second"})
        }
        obj.findObject("SHAPE").innerHTML = txt;
    }
    
    function createObject(input, output) {
          
    }
    
    palette = $(go.Diagram, "canvas-palette", {
            initialContentAlignment: go.Spot.Center,
            allowDrop: true, // must be true to accept drops from the palette
            allowVerticalScroll: false,
            allowHorizontalScroll: false,
            "undoManager.isEnabled": true,
            //isReadOnly: true;
    });
    
    palette.model = $(go.GraphLinksModel, {
        nodeDataArray: [
            {key: "add", color: "#86b3d1"},
        ]    
    });
    
    palette.nodeTemplate = 
        $(go.Node, 'Auto', {
            mouseEnter: mouseEnter,
            mouseLeave: mouseLeave,
            click: click
        }, 
        $(go.Shape, 'Trapezoid', 
            {"name": "SHAPE", "stroke": "#4d6d9a", "angle": 90, "width": 120, "height": 50}, 
          new go.Binding("fill", "color")),
        $(go.TextBlock,
            {margin: 10, font: "bold 14px Varela Round", name: "TEXT", stroke: "white"},
        new go.Binding("text", "key"))
         );
    
    palette.isReadOnly = true;
    
    palette.add($(go.Part, 
                { location: new go.Point(-40, 140) },
                $(go.TextBlock, "Fully connected layer",
                  { font: "bold 14px Varela Round", stroke: "white" })
              ));
    
}




