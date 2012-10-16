/*
 * JavaScript / Canvas teaching framwork 

 * Module: circle
 *

 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "radius_dragger"], 
       (function(Util,vec2,Scene,PointDragger, RadiusDragger) {
       
    "use strict";

    /**

     */ 

    var Circle = function(center_point, radius, lineStyle) {

        console.log("creating circle with center_point [" + 
                    center_point[0] + "," + center_point[1] + "] and radius " +
                    radius + ".");
        
        // draw style for drawing the circle
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

        // convert to Vec2 just in case the points were given as arrays
        this.center_point = center_point || [0,0];
        this.radius = radius || 0;
        
    };

    // draw this cicle into the provided 2D rendering context
    Circle.prototype.draw = function(context) {

        // draw actual circle
        context.beginPath();
        
        // set cirlce to draw
        context.arc(this.center_point[0], this.center_point[1], 
            this.radius, // radius
            0.0, Math.PI * 2); // start and end angle
        context.closePath();

        // set drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;
        
        // actually start drawing
        context.stroke(); 
        
    };

    // test whether the mouse position is on this circle
    Circle.prototype.isHit = function(context,pos) {
        
        var distance = vec2.length(vec2.sub(this.center_point, pos));
        var sensitivity = (this.lineStyle.width/2)+2;
        var difference = Math.max(this.radius,distance) - Math.min(this.radius,distance);

        return difference <= sensitivity;

    };
    
    // return list of draggers to move this circle
    Circle.prototype.createDraggers = function() {

        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggers = [];
        
        // create closure and callbacks for dragger
        var _circle = this;
        var getCenterPoint = function() { return _circle.center_point; };
        var setCenterPoint = function(dragEvent) { _circle.center_point = dragEvent.position; };
        
        var getRadiusDragger = function(){ return vec2.add(_circle.center_point,[_circle.radius,0]) ;};
        var setRadiusDragger = function(dragEvent) { 
            if(_circle.radius + dragEvent.delta[0] >= 5 ){
                _circle.radius += dragEvent.delta[0];
            }
        };

        draggers.push( new PointDragger(getCenterPoint, setCenterPoint, draggerStyle) );
        draggers.push( new RadiusDragger(getRadiusDragger, setRadiusDragger, draggerStyle) );
        
        return draggers;

    };
    
    // this module only exports the constructor for Circle objects
    return Circle;

})); // define

    
