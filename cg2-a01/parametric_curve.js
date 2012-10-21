// JavaScript Document

/* requireJS module definition */
define(["util","vec2","scene","point_dragger"],
		(function(Util, vec2, Scene, PointDragger){
	
	"use strict";
	
	var ParametricCurve = function(t_min, t_max, func_f, func_g, segments, lineStyle){

		this.t_min = t_min;
		this.t_max = t_max;
		this.func_f = func_f;
		this.func_g = func_g;
		this.segments = segments;
		this.pointArr = [];
		this.func = function (func_x, t) {
			return eval(func_x);
		};


	    console.log("creating parametric curve with t min " + 
	        t_min + ", t max " + t_max + " and " + segments +" segments");
        
        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
		
	};

	ParametricCurve.prototype.draw = function(context) {		
		
		context.beginPath();

		for(var i = 0; i <= this.segments; i++){
			var t = (this.t_min + i/this.segments * (this.t_max - this.t_min));	
			this.pointArr[i] = [this.func(this.func_f, t), this.func(this.func_g, t)];
			if(i == 0){
				context.moveTo(this.pointArr[0][0],this.pointArr[0][1]);
			}else {
				context.lineTo(this.pointArr[i][0],this.pointArr[i][1]);
			}
		}

		// set drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color; 

		// actually start drawing
        context.stroke(); 
	};

	ParametricCurve.prototype.isHit = function(context,pos) {
		var p0 = this.pointArr[0];

		for(var i = 1; i < this.pointArr.length; i++){		
			var p1 = this.pointArr[i];
			
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
    ParametricCurve.prototype.createDraggers = function() {
    	return [];
    };

    return ParametricCurve;

}));