/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

 
/* requireJS module definition */
define(["jquery", "straight_line", "circle", "parametric_curve"], 
       (function($, StraightLine, Circle, ParametricCurve) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context,scene,sceneController) {
    
        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };
            
        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };

        /* generate random radius for circles
         * returns an Array with 3 values representing a random circle
         * [0] is X position of the circle
         * [1] is Y position of the circle
         * [2] is radius of the circle
         */
        var randomCircle = function() { 
            var center_pointX = Math.floor(Math.random()*(context.canvas.width-20))+5;
            var center_pointY = Math.floor(Math.random()*(context.canvas.height-20))+5;
            var max_radius = Math.floor(nextToCanvas(center_pointX, center_pointY));
            var radius = Math.floor(Math.random()* max_radius +5);
           
            return [center_pointX, center_pointY, radius]; 
        };

        var nextToCanvas = function(center_pointX, center_pointY) {
            var min = Math.min(center_pointX, center_pointY);
            var max = Math.min((context.canvas.width - center_pointX), 
                (context.canvas.height - center_pointY));

            return Math.min(min,max) - 10;
        };
            
        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if(s.length == 1) s = "0"+s; // pad with leading 0
                return s;
            };
                
            var r = Math.floor(Math.random()*25.9)*10;
            var g = Math.floor(Math.random()*25.9)*10;
            var b = Math.floor(Math.random()*25.9)*10;
                
            // convert to hex notation
            return "#"+toHex2(r)+toHex2(g)+toHex2(b);
        };

        var showPropertiesOfSelection = function(){
            var obj = sceneController.getSelectedObject();

            var maxX = context.canvas.width-10;
            var maxY = context.canvas.height-10;
            $(".maxX").attr("max",maxX);
            $(".maxY").attr("max",maxY);

            $(".props").hide();

            if(obj instanceof StraightLine){
                $("#propsStraightLine").show();
            }

            if(obj instanceof Circle){
                $("#propsCircle").show();
            }

            if(obj instanceof ParametricCurve){
                $("#propsParametricCurve").show();
            }

            $(".input").change(inputChanged);
            updateInputFields();
        };

        var inputChanged = function(){

            var obj = sceneController.getSelectedObject();

            obj.lineStyle.width = parseFloat(($("#inputLineThikness").attr("value")));
            obj.lineStyle.color = ($("#inputLineColor").attr("value"));

            if(obj instanceof StraightLine){

                obj.p0[0] = parseFloat(($("#inputStraightLineP0X").attr("value")));
                obj.p0[1] = parseFloat(($("#inputStraightLineP0Y").attr("value")));
                obj.p1[0] = parseFloat(($("#inputStraightLineP1X").attr("value")));
                obj.p1[1] = parseFloat(($("#inputStraightLineP1Y").attr("value")));

            }

            if(obj instanceof Circle){

                obj.center_point[0] = parseFloat(($("#inputCenterX").attr("value")));
                obj.center_point[1] = parseFloat(($("#inputCenterY").attr("value")));
                obj.radius = parseFloat(($("#inputRadius").attr("value")));

            }

            if(obj instanceof ParametricCurve){
                obj.segments = parseFloat($("#inputSegments").attr("value"));
            }

            // redraw the scene
            sceneController.scene.draw(context);

        };

        var updateInputFields = function(){
            var obj = sceneController.getSelectedObject();

            $("#inputLineThikness").attr("value", parseFloat(obj.lineStyle.width));
            $("#inputLineColor").attr("value",obj.lineStyle.color);

            if(obj instanceof StraightLine){

                $("#inputStraightLineP0X").attr("value",parseFloat(obj.p0[0]));
                $("#inputStraightLineP0Y").attr("value",parseFloat(obj.p0[1]));
                $("#inputStraightLineP1X").attr("value",parseFloat(obj.p1[0]));
                $("#inputStraightLineP1Y").attr("value",parseFloat(obj.p1[1]));

            }

            if(obj instanceof Circle){

                $("#inputCenterX").attr("value",parseFloat(obj.center_point[0]));
                $("#inputCenterY").attr("value",parseFloat(obj.center_point[1]));
                $("#inputRadius").attr("value",parseFloat(obj.radius));

            }

            if(obj instanceof ParametricCurve){
                $("#inputSegments").attr("value",parseFloat(obj.segments));
            }

        };
        
        /*
         * event handler for "new line button".
         */
        $("#btnNewLine").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw
                        
        }));

        /*
         * event handler for "new circle button".
         */
        $("#btnNewCircle").click( (function() {
        
            // create the actual circle and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
            
            var c = randomCircle();              
            var circle = new Circle( [c[0], c[1]], 
                                         c[2], 
                                         style );
            scene.addObjects([circle]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
                        
        }));

        /*
         * event handler for "new paramtric curve button".
         */
        $("#btnNewParametricCurve").click( (function() {
        
            // create the actual circle and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };

            var f_t = function(t){
                return parseFloat(350 + 100 * Math.sin(t));
            };

            var g_t = function(t){
                return parseFloat(150 + 100 * Math.cos(t));
            };

            var p_curve = new ParametricCurve(0, 5, f_t , g_t , 20, style);
            scene.addObjects([p_curve]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(p_curve); // this will also redraw
                        
        }));

        // setting up callbacks
        sceneController.onSelection(showPropertiesOfSelection);
        sceneController.onObjChange(updateInputFields);
           
    };

    

    // initializes 
    (function init() {
        $(".props").hide();
    })();

    // return the constructor function 
    return HtmlController;


})); // require 



            
