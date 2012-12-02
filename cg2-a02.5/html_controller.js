/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

 
/* requireJS module definition */
define(["jquery"], 
       (function($) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     *
     * parameters_
     * - the scene
     * - the animation
     * - list of all checkable scene objects 
     *
     */
    var HtmlController = function(scene,animation) {

        /* to be inserted into HtmlController constructor */

        
        // change robot's rotation angles on key press
        $(document).keypress((function(event) {
            window.console.log("key " + event.which + " pressed");
            // which key corresponds to which joint
            // there are two keys for each joint: with Shift and without Shift pressed
            var keyJointMap = {
                88: "worldX",            120: "worldX", 
                89: "worldY",            121: "worldY", 
                87: "body",              119: "body",
                81: "neckX",             113: "neckX",
                97: "neckY",              65: "neckY",
                69: "hipLeftY",          101: "hipLeftY",
                82: "kneeLeftY",         114: "kneeLeftY",
                84: "lowestLegLeftY",    116: "lowestLegLeftY",
                90: "footLeftY",         122: "footLeftY",
                68: "hipRightY",         100: "hipRightY",
                70: "kneeRightY",        102: "kneeRightY",
                71: "lowestLegRightY",   103: "lowestLegRightY",
                72: "footRightY",        104: "footRightY"
            };
            // Move by +5 deg or -5 deg depending on Shift key
            // Assumption: keycodes below 97 are with Shift. 
            scene.rotateJoint(keyJointMap[event.which], event.which<97? -5 : 5);
        }));
    
        // internal function: turn a draw option name into a valid HTML element ID
        var drawOptionId = function(name) {
            return "drawOpt_"+name.replace(" ", "_");
        }
    

        // event handler for changes in HTML input elements
        var updateParams = function() {
        
            // toggle animation on/off
            if( $("#anim_Toggle").attr("checked") == undefined ) {
                animation.stop();
            } else {
                animation.resume();
            };

            // set animation speed
            animation.customSpeed = parseFloat($("#anim_Speed").attr("value"));
            
            // modify the drawOptions attribute depending on checkboxes
            for(var o in scene.drawOptions) {
                var element_selector = "#"+drawOptionId(o);
                scene.drawOptions[o] = $(element_selector).attr("checked") == "checked"? true : false;
            };
            
            // in case the animation is not playing, redraw the scene
            scene.draw();
            
        };
        
        // set initial values for the input elements
        $("#anim_Toggle").attr("checked", undefined);
        $("#anim_Speed").attr("value", 20);
        
        // create one input element for each object in "objects"
        for(var o in scene.drawOptions) {
            
            // put together valid HTML code for a new table row 
            var newRow = '<tr><td>'+o+'</td>'+
                         '<td><input id="'+drawOptionId(o)+'" type="checkbox" class="inputParam"></input></td></tr>\n';
                         
            // insert HTML code after the last table row so far.
            $('#param_table tr:last').after(newRow);
            
            // if object is in the scene now, check it
            if(scene.drawOptions[o] == true) {
                $("#"+drawOptionId(o)).attr("checked","checked");

            };
        };
        
        // set up event handler and execute it once so everything is set consistently
        $(".inputParam").change( updateParams ); 
        updateParams();
        
    }; // end of HtmlController constructor function
        

    // return the constructor function 
    return HtmlController;


})); // require 



            
