/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Skull
 */


/* requireJS module definition */
define(["util", "vbo"], 
       (function(Util, vbo) {
       
    "use strict";
    
    /*
     */
    var Skull = function(gl) {
    
        
        window.console.log("Creating a unit Skull."); 
    
        // generate points and store in an array
        var coords = [ 
                       -0.2, -0.4,  0.5,  // A: index 0
                        0.2, -0.4,  0.5,  // B: index 1
                        0.4,  0.5,  0.2,  // C: index 2
                       -0.4,  0.5,  0.2,  // D: index 3
                       
                       // back
                       -0.5, -0.1, -0.7,  // I: index 4
                        0.5, -0.1, -0.7,  // J: index 5
                        0.5,  0.7, -0.7,  // L: index 6
                       -0.5,  0.7, -0.7,  // K: index 7
                       
                       // left 1
                       -0.2, -0.4,  0.5,  // A': index 8
                       -0.4,  0.5,  0.2,  // D': index 9
                       -0.4, -0.1, -0.1,  // G : index 10
                       -0.2, -0.4,  0.2,  // E : index 11

                       // left 2
                       -0.4,  0.5,  0.2,  // D'': index 12
                       -0.4, -0.1, -0.1,  // G' : index 13        
                       -0.5, -0.1, -0.7,  // I' : index 14
                       -0.5,  0.7, -0.7,  // K': index 15

                       // right 1
                        0.2, -0.4,  0.5,  // B': index 16
                        0.4,  0.5,  0.2,  // C': index 17
                        0.4, -0.1, -0.1,  // H : index 18
                        0.2, -0.4,  0.2,  // F : index 19

                       // right 2
                        0.4,  0.5,  0.2,  // C'': index 20
                        0.4, -0.1, -0.1,  // H' : index 21        
                        0.5, -0.1, -0.7,  // J' : index 22
                        0.5,  0.7, -0.7,  // L' : index 23

                        // top
                        0.4,  0.5,  0.2,  // C''': index 24
                       -0.4,  0.5,  0.2,  // D''': index 25
                        0.5,  0.7, -0.7,  // L'' : index 26
                       -0.5,  0.7, -0.7,  // K'' : index 27

                       //bottom1
                       -0.2, -0.4,  0.5,  // A'': index 28
                        0.2, -0.4,  0.5,  // B'': index 29
                       -0.2, -0.4,  0.2,  // E' : index 30
                        0.2, -0.4,  0.2,  // F' : index 31

                       //bottom2
                       -0.2, -0.4,  0.2,  // E'': index 32
                        0.2, -0.4,  0.2,  // F'': index 33
                       -0.4, -0.1, -0.1,  // G'': index 34
                        0.4, -0.1, -0.1,  // H'': index 35  

                       //bottom3
                       -0.4, -0.1, -0.1,  // G''': index 35
                        0.4, -0.1, -0.1,  // H''': index 36
                       -0.5, -0.1, -0.7,  // I'' : index 37
                        0.5, -0.1, -0.7,  // J'' : index 38                                              
                     ];

        var triangles = [ 
                          // front
                           0,  1,  2,
                           0,  2,  3,

                           // back
                           4,  6,  5,     
                           4,  7,  6,

                           // left1
                           8,  9, 10,
                           8, 10, 11,

                           // left2
                          12, 13, 14,
                          12, 14, 15,

                          // right1
                          16, 17, 18,
                          16, 18, 19,

                          // right2
                          20, 21, 22,
                          20, 22, 23,

                          //top
                          24, 25, 26,
                          25, 26, 27,

                          //bottom1
                          28, 29, 30,
                          29, 30, 31,

                          //bottom2
                          32, 33, 34,
                          33, 34, 35,

                          //bottom3
                          36, 37, 38,
                          37, 38, 39
                        ];

        var color = [ 1.0,0.0,0.0,1.0,
                      1.0,0.0,0.0,1.0,
                      1.0,0.0,0.0,1.0,
                      1.0,0.0,0.0,1.0,

                      0.0,1.0,0.0,1.0,
                      0.0,1.0,0.0,1.0,
                      0.0,1.0,0.0,1.0,
                      0.0,1.0,0.0,1.0,

                      0.0,0.0,1.0,1.0,
                      0.0,0.0,1.0,1.0,
                      0.0,0.0,1.0,1.0,
                      0.0,0.0,1.0,1.0,

                      1.0,1.0,0.0,1.0,
                      1.0,1.0,0.0,1.0,
                      1.0,1.0,0.0,1.0,
                      1.0,1.0,0.0,1.0,

                      1.0,0.0,1.0,1.0,
                      1.0,0.0,1.0,1.0,
                      1.0,0.0,1.0,1.0,
                      1.0,0.0,1.0,1.0,

                      0.0,1.0,1.0,1.0,
                      0.0,1.0,1.0,1.0,
                      0.0,1.0,1.0,1.0,
                      0.0,1.0,1.0,1.0,

                      1.0,0.0,0.0,1.0,
                      1.0,0.0,0.0,1.0,
                      1.0,0.0,0.0,1.0,
                      1.0,0.0,0.0,1.0,

                      0.0,1.0,0.0,1.0,
                      0.0,1.0,0.0,1.0,
                      0.0,1.0,0.0,1.0,
                      0.0,1.0,0.0,1.0,

                      0.0,0.0,1.0,1.0,
                      0.0,0.0,1.0,1.0,
                      0.0,0.0,1.0,1.0,
                      0.0,0.0,1.0,1.0,

                      1.0,1.0,0.0,1.0,
                      1.0,1.0,0.0,1.0,
                      1.0,1.0,0.0,1.0,
                      1.0,1.0,0.0,1.0
                    ];

        
                                          
        // therer are 3 floats per vertex, so...
        this.numVertices = coords.length / 3;
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );

       this.colorBuf = new vbo.Attribute(gl, { "numComponents": 4,
                                                  "dataType": gl.FLOAT,
                                                  "data": color 
                                                } );

        // create vertex buffer object (VBO) for the indices
        this.triangleBuffer = new vbo.Indices(gl, {"indices": triangles});
    };

    // draw method clears color buffer and optionall depth buffer
    Skull.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, "vertexPosition");
        this.triangleBuffer.bind(gl);
        this.colorBuf.bind(gl, program, "vertexColor");
                
        // draw the vertices as points
        //gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 
        // draw the vertices as 
        gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);   
    };
        
    // this module only returns the constructor function    
    return Skull;

})); // define

    
