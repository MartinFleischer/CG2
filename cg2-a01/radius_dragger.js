/*
 * Module: radius_dragger.
 *
 */


/* requireJS module definition */
define(["util", "scene"], 
       (function(Util,Scene) {

    "use strict";

    /*
     *
     */

    var RadiusDragger = function(getRad, setRad, drawStyle) {

        // remember the callbacks
        this.getRad = getRad;
        this.setRad = setRad;
        
        // default draw style
        this.drawStyle = drawStyle || { 
            radius:5, 
            width:2, 
            color: "#ff0000", 
            fill: false 
        };
        
        // attribute queried by SceneController to recognize draggers
        this.isDragger = true; 
                                        
    };

    /*
     * draw the dragger as a small circle
     */
    RadiusDragger.prototype.draw = function (context) {

        // what is my current position?
        var pos = this.getRad();

        // what shape to draw
        context.beginPath();
        context.arc(pos[0], pos[1], // position
                    this.drawStyle.radius,    // radius
                    0.0, Math.PI*2,           // start and end angle
                    true);                    // clockwise
        context.closePath();
        
        // draw style
        context.lineWidth   = this.drawStyle.width;
        context.strokeStyle = this.drawStyle.color;
        context.fillStyle   = this.drawStyle.color;
        
        // trigger the actual drawing
        if(this.drawStyle.fill) {
            context.fill();
        };
        context.stroke();
    };

    /* 
     * test whether the specified mouse position "hits" this dragger
     */
    RadiusDragger.prototype.isHit = function (context,mousePos) {
    
        // what is my current position?
        var pos = this.getRad();
    
        // check whether distance between mouse and dragger's center
        // is at max (radius+1) 
        var dx = mousePos[0] - pos[0];
        var dy = mousePos[1] - pos[1];
        var r = this.drawStyle.radius+1;
        return (dx*dx + dy*dy) <= (r*r);           

    };
        
    /*
     * Event handler triggered by a SceneController when mouse
     * is being dragged
     */
    RadiusDragger.prototype.mouseDrag = function (dragEvent) {
    
        // change position of the associated original (!) object
        this.setRad(dragEvent);
            
    };

    // this module exposes only the constructor for Dragger objects
    return RadiusDragger;

})); // define
