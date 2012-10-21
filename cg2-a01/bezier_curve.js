// JavaScript Document

/* requireJS module definition */
define(["util","vec2","scene","point_dragger", "polygon_dragger"],
		(function(Util, vec2, Scene, PointDragger, PolygonDragger){
	
	"use strict";
	
	var BezierCurve = function(pointArr, segments, lineStyle){


		this.segments = segments;
		this.pointArr = pointArr;
		this.p0 = this.pointArr[0];
		this.p1 = this.pointArr[1];
		this.p2 = this.pointArr[2];
		this.p3 = this.pointArr[3];

		this.calcP = function(coord, t) {
			return (Math.pow(1 - t, 3) * this.p0[coord]) + (3 * Math.pow(1 - t, 2) * t  * this.p1[coord]) + (3 * (1 - t) * Math.pow(t, 2) * this.p2[coord]) + (Math.pow(t, 3) * this.p3[coord]) ;
		};
        
        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
		
	};

	BezierCurve.prototype.draw = function(context) {		
		
		context.beginPath();
		context.moveTo(this.p0[0], this.p0[1]);

		for(var i = 1; i <= this.segments; i++){

			var t = 1 / this.segments * i;

			var px = this.calcP(0, t);
			var py = this.calcP(1, t);

			context.lineTo(px, py);
		}

		// set drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color; 

		// actually start drawing
        context.stroke(); 
	};

	BezierCurve.prototype.isHit = function(context,pos) {	

		for(var i = 1; i <= this.segments; i++){

			var t0 = 1 / this.segments * i - 1;
			var t1 = 1 / this.segments * i;

			var p0 = [this.calcP(0, t0), this.calcP(1, t0)];
			var p1 = [this.calcP(0, t1), this.calcP(1, t1)]
		
			// project point on line, get parameter of that projection point
	        var t = vec2.projectPointOnLine(pos, p0, p1);
	                
	        // outside the line segment?
	        if(t<0.0 || t>1) {
	        	p0 = p1;
	            continue; 
	        }
	        
	        // coordinates of the projected point 
	        var p = vec2.add(p0, vec2.mult( vec2.sub(p1,p0), t ));

	        // distance of the point from the line
	        var d = vec2.length(vec2.sub(p,pos));
	        
	        // allow 2 pixels extra "sensitivity"
	        if( d<=(this.lineStyle.width/2)+2 ){
	        	return true;
	        }
	        p0 = p1;
	    }

	    return false;
	};

	// returns an empty list
    BezierCurve.prototype.createDraggers = function() {
    	
    	var polyDraggerStyle = { radius:8, color: "#FF0000", width:0.3, fill:true };
    	var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true };
        var draggers = [];

        var _bezier = this;
        var getP0 = function() { return _bezier.p0; };
        var setP0 = function(dragEvent) { _bezier.p0 = dragEvent.position; };
        var getP1 = function() { return _bezier.p1; };
        var setP1 = function(dragEvent) { _bezier.p1 = dragEvent.position; };
        var getP2 = function() { return _bezier.p2; };
        var setP2 = function(dragEvent) { _bezier.p2 = dragEvent.position; };
        var getP3 = function() { return _bezier.p3; };
        var setP3 = function(dragEvent) { _bezier.p3 = dragEvent.position; };
    
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