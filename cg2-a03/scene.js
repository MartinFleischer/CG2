/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Scene
 *
 * This module defines the scene to be drawn.
 *
 * A Scene object has a draw() method to draw itself, plus some
 * public attributes that may be used by animation functions etc:
 *
 * Scene.world:       the root node of the scene, of type SceneNode
 *
 * Scene.camera:      the camera to be used, consisting of two attributes:
 *                    camera.viewMatrix and camera.projectionMatrix.
 * 
 * Scene.drawOptions: array of strings defining on/off drawing options. 
 *                    this is potentially used by HtmlController to create
 *                    the corresponding check boxes in the HTML document.
 *
 */


/* requireJS module definition */
define(["jquery", "gl-matrix", 
        "program", "shaders", "scene_node", "texture", "light", "material",
        "models/parametric"], 
       (function($, glmatrix, 
                 Program, shaders, SceneNode, texture, light, material,
                 parametric ) {

    "use strict";
                                        
            // a simple scene is an object with a few objects and a draw() method
            var Scene = function(gl) {

                // store the WebGL rendering context 
                this.gl = gl;  
                
                // create WebGL program using constant blue color
                var prog_blue = new Program(gl, shaders("minimal_vs"), 
                                                shaders("frag_color_fs") );
                prog_blue.use();
                prog_blue.setUniform("fragColor", "vec4", [0.0, 0.0, 1.0, 1.0]);
                
                // WebGL program for using phong illumination 
                var prog_phong = new Program(gl, shaders("phong_vs"), 
                                                 shaders("phong_fs")  );
                prog_phong.use();
                prog_phong.setUniform("ambientLight", "vec3", [0.4,0.4,0.4]);
                   
                var prog_planet = new Program(gl, shaders("planet_vs"), 
                                                  shaders("planet_fs") );
                prog_planet.use();
                prog_planet.setUniform("fragColor", "vec4", [0.0, 0.0, 1.0, 1.0]);
                prog_planet.setUniform("ambientLight", "vec3", [0.4,0.4,0.4]);


                // register all programs in this list for setting the projection matrix later
                this.programs = [prog_blue, prog_phong,prog_planet];
                
                // TODO second light
                // light source 
                this.sun       = new light.DirectionalLight("light",  {"direction": [-1,0,0], "color": [1,1,1] }, [prog_planet,prog_phong] ); 
                this.sunNode   = new SceneNode("SunNode", [this.sun], prog_planet);
                                
                // equator ring for orientation
                this.ringMaterial = new material.PhongMaterial("material", 
                                                                    {"ambient":   [0.5,0.3,0.3],
                                                                     "diffuse":   [0.8,0.2,0.2],
                                                                     "specular":  [0.4,0.4,0.4],
                                                                     "shininess": 80
                                                                     });
                this.ringGeometry = new parametric.Torus(gl, 1.2, 0.04, {"uSegments":80, "vSegments":40});
                this.ringNode     = new SceneNode("EquatorNode", [this.ringMaterial, this.ringGeometry], prog_phong);


                // Planet Node
                // TODO Material verändern
                this.sphereMaterial = new material.PhongMaterial("material", 
                                                                    {"ambient":   [0.5,0.3,0.3],
                                                                     "diffuse":   [0.8,0.2,0.2],
                                                                     "specular":  [0.4,0.4,0.4],
                                                                     "shininess": 50
                                                                     });
                this.sphereGeometry = new parametric.Sphere(gl, 1);
                this.sphereNode   = new SceneNode("PlanetNode", [this.sphereMaterial, this.sphereGeometry], prog_planet);
                // textures
                this.sphereDaySurfaceTex = new texture.Texture2D(gl, "./textures/earth_month04_2048.jpg");
                this.sphereNightSurfaceTex = new texture.Texture2D(gl, "./textures/earth_at_night_2048.jpg");
                this.sphereNightBathymetryTex = new texture.Texture2D(gl, "./textures/earth_bathymetry_2048.jpg");
                this.sphereCloudsTex = new texture.Texture2D(gl, "./textures/earth_clouds_2048.jpg");
                var scene = this;
                texture.onAllTexturesLoaded(function(){
                    prog_planet.use();
                    prog_planet.setTexture("daylightTexture", 0, scene.sphereDaySurfaceTex);
                    prog_planet.setTexture("nightlightTexture", 1, scene.sphereNightSurfaceTex);
                    prog_planet.setTexture("bathymetryTexture", 2, scene.sphereNightBathymetryTex);
                    prog_planet.setTexture("cloudsTexture", 3, scene.sphereCloudsTex);
                    scene.draw();
                });

                // Wireframe
                this.sphereWireGeometry = new parametric.Sphere(gl, 1, { "wireframe": true});
                this.sphereWireNode   = new SceneNode("PlanetWireNode", [this.sphereMaterial, this.sphereWireGeometry], prog_blue);

                // the poles are modeled on the Z axis, so swap z and y axes  
                mat4.rotate(this.ringNode.transformation, Math.PI/2.0, [1,0,0]);
                mat4.rotate(this.sphereNode.transformation, Math.PI/2.0, [1,0,0]);
                mat4.rotate(this.sphereWireNode.transformation, Math.PI/2.0, [1,0,0]);

                // the world node - this is potentially going to be accessed from outside
                this.world  = new SceneNode("world", [this.sunNode, this.ringNode, this.sphereNode, this.sphereWireNode], prog_blue); 
                
                // initial camera parameters
                var c = gl.canvas;
                var aspectRatio = c.width / c.height;
                this.camera = {};
                this.camera.viewMatrix = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);
                this.camera.projectionMatrix = mat4.perspective(45, aspectRatio, 0.01, 100);
                
                // for the UI - this will be accessed directly by HtmlController
                this.drawOptions = { "Planet": true, "Wireframe": false, "Ring": true, "Night Lights": true, "Clouds": false};
                
            }; // Scene constructor
            
            // draw the scene, starting at the root node
            Scene.prototype.draw = function() {
            
                // shortcut
                var gl = this.gl;
                
                // switch grid on/off
                this.ringNode.visible = this.drawOptions["Ring"];
                this.sphereNode.visible = this.drawOptions["Planet"];
                this.sphereWireNode.visible = this.drawOptions["Wireframe"];

                // Draw options
                var prog_planet = this.programs[2];
                if(this.drawOptions["Night Lights"]){
                    prog_planet.use();
                    prog_planet.setUniform("nightLights", "bool", true);
                }else {
                    prog_planet.use();
                    prog_planet.setUniform("nightLights", "bool", false);
                };

                if(this.drawOptions["Clouds"]){
                    prog_planet.use();
                    prog_planet.setUniform("clouds", "bool", true);
                }else {
                    prog_planet.use();
                    prog_planet.setUniform("clouds", "bool", false);
                };
                
                // set camera's projection matrix in all programs
                for(var i=0; i<this.programs.length; i++) {
                    var p = this.programs[i];
                    p.use();
                    p.setUniform("projectionMatrix", "mat4", this.camera.projectionMatrix);
                };
                                    
                // initially set model-view matrix to the camera's view matrix
                var modelView = this.camera.viewMatrix;
                
                // enable depth testing, keep fragments with smaller depth values
                gl.enable(gl.DEPTH_TEST); 
                gl.depthFunc(gl.LESS);  
                                
                // clear color and depth buffers
                gl.clearColor(1.0, 1.0, 1.0, 1.0); 
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

                // start drawing with the root node
                this.world.draw(gl, null, modelView);

            }; // Scene draw()
            
        return Scene;
    
})); // define module
        

