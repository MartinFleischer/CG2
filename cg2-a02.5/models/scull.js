/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 *
 * We use a right-handed coordinate system with Z pointing towards the 
 * viewer. For example, vertex A (front bottom left) has the coordinates  
 * ( x = -0.5, y = -0.5, z = 0.5 ) . 
 *
 * The scull only consists of eight different vertex positions; however 
 * for various reasons (e.g. different normal directions) these vertices
 * are "cloned" for each face of the scull. There will be 3 instances
 * of each vertex, since each vertex belongs to three different faces.
 *
 */


/* requireJS module definition */
define(["util", "vbo"], 
       (function(Util, vbo) {
       
    "use strict";
    
    /*
     */
    var scull = function(gl) {
    
        
        window.console.log("Creating a unit scull."); 
    
        // generate points and store in an array
        var coords = [ 
                       // front
                       -0.4, -0.3,  0.7,  // A: index 0
                        0.4, -0.3,  0.7,  // B: index 1
                        0.5,  0.3,  0.4,  // C: index 2
                       -0.5,  0.3,  0.4,  // D: index 3
                       
                       // back
                       -0.4, -0.3, -0.4,  // E: index 4
                        0.4, -0.3, -0.4,  // F: index 5
                        0.5,  0.4, -0.7,  // G: index 6
                       -0.5,  0.4, -0.7,  // H: index 7
                       
                       // left
                       -0.4, -0.3,  0.7,  // A': index 8
                       -0.5,  0.3,  0.4,  // D': index 9
                       -0.5,  0.4, -0.7,  // H': index 10
                       -0.4, -0.3, -0.4,  // E': index 11
                       
                       // right
                        0.4, -0.3,  0.7,  // B': index 12
                        0.4, -0.3, -0.4,  // F': index 13
                        0.5,  0.4, -0.7,  // G': index 14
                        0.5,  0.3,  0.4,  // C': index 15
                       
                       // top
                       -0.5,  0.3,  0.4,  // D'': index 16
                        0.5,  0.3,  0.4,  // C'': index 17
                        0.5,  0.4, -0.7,  // G'': index 18
                       -0.5,  0.4, -0.7,  // H'': index 19

                       // bottom
                       -0.4, -0.3,  0.7,  // A'': index 20
                       -0.4, -0.3, -0.4,  // E'': index 21
                        0.4, -0.3, -0.4,  // F'': index 22
                        0.4, -0.3,  0.7   // B'': index 23
                     ];

        var triangles = [ 
                          // front
                           0,  1,  2,
                           0,  2,  3,

                           // back
                           4,  6,  5,     
                           4,  7,  6,

                           // left
                           8,  9, 10,
                           8, 10, 11,

                          // right  
                          12, 13, 14,
                          12, 14, 15,

                          // top
                          16, 17, 18,
                          16, 18, 19,

                          // bottom
                          20, 21, 22,
                          20, 22, 23
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
    scull.prototype.draw = function(gl,program) {
    
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
    return scull;

})); // define

    
