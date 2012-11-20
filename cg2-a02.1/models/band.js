/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 *
 */


 /* requireJS module definition */
 define(["util", "vbo"], 
     (function(Util, vbo) {

        "use strict";

    /*
    */
    var Band = function(gl, config) {

        // read the configuration parameters
        config = config || {};
        var radius   = config.radius         || 1.0;
        var height   = config.height         || 0.1;
        var segments = config.segments       || 20;
        this.asWireframe = config.asWireframe || false;
        this.wireframe = {};
        
        window.console.log("Creating a " + (this.asWireframe? "Wireframe " : "") + 
            "Band with radius="+radius+", height="+height+", segments="+segments ); 

        // generate vertex coordinates and store in an array
        var coords = [];
        for(var i=0; i<=segments; i++) {

            // X and Z coordinates are on a circle around the origin
            var t = (i/segments)*Math.PI*2;
            var x = Math.sin(t) * radius;
            var z = Math.cos(t) * radius;
            // Y coordinates are simply -height/2 and +height/2 
            var y0 = height/2;
            var y1 = -height/2;
            
            // add two points for each position on the circle
            // IMPORTANT: push each float value separately!
            coords.push(x,y0,z);
            coords.push(x,y1,z);
            
        };  

        var triangles = [];

        for(var i=0; i<segments*2; i+=2){
            triangles.push(i,   i+1, i+2);
            triangles.push(i+2, i+1, i+3);    
        }

        var lines = [];

        for(var i=0; i<segments*2; i+=2){
            lines.push(i  , i+1);
            lines.push(i  , i+2); 
            lines.push(i+1, i+3); 
            lines.push(i+2, i+3);    
        }

        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
            "dataType": gl.FLOAT,
            "data": coords 
        } );

        // create vertex buffer object (VBO) for the indices
        this.triangleBuffer = new vbo.Indices(gl, {"indices": triangles});

        // create vertex buffer object (VBO) for the indices
        this.linesBuffer = new vbo.Indices(gl, {"indices": lines});

    };

    // draw method clears color buffer and optionall depth buffer
    Band.prototype.draw = function(gl,program) {

        if(this.asWireframe){
            // bind the attribute buffers
            this.coordsBuffer.bind(gl, program, "vertexPosition");
            this.linesBuffer.bind(gl);

            // draw the vertices as points
            gl.drawElements(gl.LINES, this.linesBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        } else {
            // bind the attribute buffers
            this.coordsBuffer.bind(gl, program, "vertexPosition");
            this.triangleBuffer.bind(gl);

            // draw the vertices as points
            gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        }
    };

    // this module only returns the Band constructor function    
    return Band;

})); // define


