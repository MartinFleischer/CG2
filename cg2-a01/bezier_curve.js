// JavaScript Document

/* requireJS module definition */
define(["util","vec2","scene","point_dragger", "polygon_dragger"],
		(function(Util, vec2, Scene, PointDragger, PolygonDragger){
	
	"use strict";
	
	var BezierCurve = function(pointArr, segments, lineStyle){


		this.segments = segments;
		this.pointArr = pointArr;
        
        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
		
	};

	BezierCurve.prototype.draw = function(context) {		
		
		context.beginPath();

		var p0 = this.pointArr[0];
		var p1 = this.pointArr[1];
		var p2 = this.pointArr[2];
		var p3 = this.pointArr[3];

		context.moveTo(p0[0],p0[1]);

		var calcP = function(coord, t) {
			return (Math.pow(1 - t, 3) * p0[coord]) + (3 * Math.pow(1 - t, 2) * t  * p1[coord]) + (3 * (1 - t) * Math.pow(t, 2) * p2[coord]) + (Math.pow(t, 3) * p3[coord]) ;
		};

		for(var i = 1; i <= this.segments; i++){

			var t = 1 / this.segments * i;

			var px = calcP(0, t);
			var py = calcP(1, t);

			context.lineTo(px, py);
		}

		// set drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color; 

		// actually start drawing
        context.stroke(); 
	};

	BezierCurve.prototype.isHit = function(context,pos) {
	    return false;
	};

	// returns an empty list
    BezierCurve.prototype.createDraggers = function() {
    	
    	var polyDraggerStyle = { radius:8, color: "#FF0000", width:0.3, fill:true };
    	var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true };
        var draggers = [];

        var _bezier = this;
        var getP0 = function() { return _bezier.pointArr[0]; };
        var setP0 = function(dragEvent) { _bezier.pointArr[0] = dragEvent.position; };
        var getP1 = function() { return _bezier.pointArr[1]; };
        var setP1 = function(dragEvent) { _bezier.pointArr[1] = dragEvent.position; };
        var getP2 = function() { return _bezier.pointArr[2]; };
        var setP2 = function(dragEvent) { _bezier.pointArr[2] = dragEvent.position; };
        var getP3 = function() { return _bezier.pointArr[3]; };
        var setP3 = function(dragEvent) { _bezier.pointArr[3] = dragEvent.position; };
    
        draggers.push(new PolygonDragger(getP0, setP0, getP1, polyDraggerStyle));
        draggers.push(new PolygonDragger(getP1, setP1, getP2, polyDraggerStyle));
        draggers.push(new PolygonDragger(getP2, setP2, getP3, polyDraggerStyle));
        draggers.push(new PolygonDragger(getP3, setP3, undefined, polyDraggerStyle));
   		
   		draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
   		draggers.push( new PointDragger(getP1, setP1, polyDraggerStyle) );
   		draggers.push( new PointDragger(getP2, setP2, polyDraggerStyle) );
   		draggers.push( new PointDragger(getP3, setP3, draggerStyle) );

   		return draggers;
    };

    return BezierCurve;

}));