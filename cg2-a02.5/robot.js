/*
  *
 * Module main: CG2 Aufgabe 2 Teil 2, Winter 2012/2013
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* 
 *  RequireJS alias/path configuration (http://requirejs.org/)
 */

requirejs.config({
    paths: {
    
        // jquery library
        "jquery": [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'],
            
        // gl-matrix library
        "gl-matrix": "../lib/gl-matrix-1.3.7"

    }
});


/*
 * The function defined below is the "main" module,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 *
 */

/* requireJS module definition */
define(["jquery", "gl-matrix", "util", "webgl-debug", 
        "program", "shaders", "animation", "html_controller", "scene_node", 
        "models/triangle", "models/cube", "models/band", "models/skull"], 
       (function($, glmatrix, util, WebGLDebugUtils, 
                    Program, shaders, Animation, HtmlController, SceneNode,
                    Triangle, Cube, Band, Skull ) {

    "use strict";
    
    /*
     *  This function asks the HTML Canvas element to create
     *  a context object for WebGL rendering.
     *
     *  It also creates awrapper around it for debugging 
     *  purposes, using webgl-debug.js
     *
     */
    
    var makeWebGLContext = function(canvas_name) {
    
        // get the canvas element to be used for drawing
        var canvas=$("#"+canvas_name).get(0);
        if(!canvas) { 
            throw "HTML element with id '"+canvas_name + "' not found"; 
            return null;
        };

        // get WebGL rendering context for canvas element
        var options = {alpha: true, depth: true, antialias:true};
        var gl = canvas.getContext("webgl", options) || 
                 canvas.getContext("experimental-webgl", options);
        if(!gl) {
            throw "could not create WebGL rendering context";
        };
        
        // create a debugging wrapper of the context object
        var throwOnGLError = function(err, funcName, args) {
            throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
        };
        var gl=WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
        
        return gl;
    };
    
    /*
     * main program, to be called once the document has loaded 
     * and the DOM has been constructed
     * 
     */

    $(document).ready( (function() {
    
        // catch errors for debugging purposes 
        try {

            console.log("document ready - starting!");
            
            // create WebGL context object for the named canvas object
            var gl = makeWebGLContext("drawing_area");
                                        
            // a simple scene is an object with a few objects and a draw() method
            var MyRobotScene = function(gl, transformation) {

                // store the WebGL rendering context 
                this.gl = gl;  
                
                // create WebGL program using constant red color
                var prog_red = new Program(gl, shaders.vs_NoColor(), 
                                            shaders.fs_ConstantColor([0.7,0.3,0.2,1]) );
                var prog_blue = new Program(gl, shaders.vs_NoColor(), 
                                             shaders.fs_ConstantColor([0.5,0.3,0.5,1]) );
                                       
                // create WebGL program using per-vertex-color
                var prog_vertexColor = new Program(gl, shaders.vs_PerVertexColor(), 
                                                    shaders.fs_PerVertexColor() );
                                                    
                // please register all programs in this list
                this.programs = [prog_red, prog_blue, prog_vertexColor];
                                                    
                // create some objects to be drawn
                var skull = new Skull(gl);
                var band = new Band(gl, { radius: 0.18, height: 0.1, segments: 50 } );
                var bandNeck = new Band(gl, { radius: 0.1, height: 0.15, segments: 50 } );
                var bandHip = new Band(gl, { radius: 0.08, height: 0.1, segments: 50 } );
                var triangle = new Triangle(gl);
                var cube = new Cube(gl);

// ----------------------------------------------------------------------------------------

                var gunEarLeft_1 = new SceneNode("gunEarLeft_1");
                var gunEarLeftSkin_1 = new SceneNode("gunEarLeftSkin_1", [cube], prog_blue); 
                mat4.rotate(gunEarLeftSkin_1.transformation, 90 * Math.PI/180, [1,0,0] );
                mat4.scale(gunEarLeftSkin_1.transformation,[0.02,0.3,0.02]);
                gunEarLeft_1.addObjects([gunEarLeftSkin_1]);  
                mat4.translate(gunEarLeft_1.transformation,[0.0005,0.1,0.3]);


                var gunEarLeft_2 = new SceneNode("gunEarLeft_2");
                var gunEarLeftSkin_2 = new SceneNode("gunEarLeftSkin_2", [cube], prog_blue); 
                mat4.rotate(gunEarLeftSkin_2.transformation, 90 * Math.PI/180, [1,0,0] );
                mat4.scale(gunEarLeftSkin_2.transformation,[0.02,0.45,0.02]);
                gunEarLeft_2.addObjects([gunEarLeftSkin_2]);  
                mat4.translate(gunEarLeft_2.transformation,[0.0005,0.05,0.35]); 


                var gunEarRight = new SceneNode("gunEarRight");
                var gunEarRightSkin = new SceneNode("gunEarRightSkin", [cube], prog_blue);
                mat4.rotate(gunEarRightSkin.transformation, 90 * Math.PI/180, [1,0,0] ); 
                mat4.scale(gunEarRightSkin.transformation,[0.06,0.3,0.06]);
                gunEarRight.addObjects([gunEarRightSkin]);  
                mat4.translate(gunEarRight.transformation,[-0.0005,0,0.33]);

// ----------------------------------------------------------------------------------------
                
                var gunMouthLeft = new SceneNode("gunMouthLeft");
                var gunMouthLeftSkin = new SceneNode("gunMouthLeftSkin", [cube], prog_blue);
                mat4.rotate(gunMouthLeftSkin.transformation, 90 * Math.PI/180, [1,0,0] ); 
                mat4.scale(gunMouthLeftSkin.transformation,[0.04,0.3,0.04]);
                gunMouthLeft.addObjects([gunMouthLeftSkin]);  
                mat4.translate(gunMouthLeft.transformation,[0.05,0.08,0.3]);


                var gunMouthRight = new SceneNode("gunMouthRight");
                var gunMouthRightSkin = new SceneNode("gunMouthRightSkin", [cube], prog_blue);
                mat4.rotate(gunMouthRightSkin.transformation, 90 * Math.PI/180, [1,0,0] ); 
                mat4.scale(gunMouthRightSkin.transformation,[0.04,0.3,0.04]);
                gunMouthRight.addObjects([gunMouthRightSkin]);  
                mat4.translate(gunMouthRight.transformation,[-0.05,0.08,0.3]);


                var mouth = new SceneNode("mouth",[gunMouthLeft,gunMouthRight]);
                var mouthSkin = new SceneNode("mouthSkin", [cube], prog_red);
                mat4.scale(mouthSkin.transformation,[0.25,0.35,0.4]);
                mouth.addObjects([mouthSkin]);  
                mat4.translate(mouth.transformation,[0,-0.25,0.3]);

// ----------------------------------------------------------------------------------------
                
                // dimensions
                var headSize      = [0.7, 0.7, 0.7];
                
                var eyeLeft = new SceneNode("eyeLeft");
                var eyeLeftSkin = new SceneNode("eyeLeftSkin", [triangle], prog_vertexColor);
                mat4.rotate(eyeLeftSkin.transformation, 120 * Math.PI/180, [1,0,0] );
                mat4.scale(eyeLeftSkin.transformation,[0.25,0.25,0]);
                eyeLeft.addObjects([eyeLeftSkin]);  
                mat4.translate(eyeLeft.transformation,[0.2,0.2,0.4]);


                var eyeRight = new SceneNode("eyeRight");
                var eyeRightSkin = new SceneNode("eyeRightSkin", [triangle], prog_vertexColor);
                mat4.rotate(eyeRightSkin.transformation, 120 * Math.PI/180, [1,0,0] );
                mat4.scale(eyeRightSkin.transformation,[0.25,0.25,0]);
                eyeRight.addObjects([eyeRightSkin]);  
                mat4.translate(eyeRight.transformation,[-0.2,0.2,0.4]);


                var earLeft = new SceneNode("earLeft",[gunEarLeft_1,gunEarLeft_2]);
                var earLeftSkin = new SceneNode("eyeRightSkin", [band], prog_red);
                mat4.rotate(earLeftSkin.transformation, 85 * Math.PI/180, [0,0,1] );
                mat4.rotate(earLeftSkin.transformation, 170 * Math.PI/180, [1,0,0] );
                earLeft.addObjects([earLeftSkin]);  
                mat4.translate(earLeft.transformation,[0.43,0.1,0.1]);


                var earRight = new SceneNode("earRight",[gunEarRight]);
                var earRightSkin = new SceneNode("earRightSkin", [band], prog_red);
                mat4.rotate(earRightSkin.transformation, 275 * Math.PI/180, [0,0,1] );
                mat4.rotate(earRightSkin.transformation, 350 * Math.PI/180, [1,0,0] );
                earRight.addObjects([earRightSkin]);  
                mat4.translate(earRight.transformation,[-0.43,0.1,0.1]);


                var head = new SceneNode("head",[eyeLeft,eyeRight,earLeft,earRight,mouth]);
                var headSkin =new SceneNode("skullSkin", [skull], prog_vertexColor);
                head.addObjects([headSkin]);
                mat4.translate(head.transformation,[0,0.2,0]);
                mat4.scale(head.transformation, headSize );

// ----------------------------------------------------------------------------------------
                var neck = new SceneNode("neck",[head]);
                var neckSkin = new SceneNode("neckSkin", [bandNeck], prog_red);
                mat4.rotate(neckSkin.transformation, 90 * Math.PI/180, [0,0,1]);
                neck.addObjects([neckSkin]);  
                mat4.translate(neck.transformation,[0,0.1,0.25]); 

// ----------------------------------------------------------------------------------------
                
                var footLeft = new SceneNode("footLeft");
                var footLeftSkin = new SceneNode("footLeftSkin", [triangle], prog_vertexColor); 
                mat4.rotate(footLeftSkin.transformation, 90 * Math.PI/180, [1,0,0]);
                mat4.scale(footLeftSkin.transformation,[0.4,0.4,0.4]);
                footLeft.addObjects([footLeftSkin]);  
                mat4.translate(footLeft.transformation,[0,-0.2,0.18]);


                var lowestLegLeft = new SceneNode("lowestLegLeft",[footLeft]);
                var lowestLegLeftSkin = new SceneNode("lowestLegLeftSkin", [cube], prog_vertexColor); 
                mat4.rotate(lowestLegLeftSkin.transformation, 320 * Math.PI/180, [1,0,0]);
                mat4.scale(lowestLegLeftSkin.transformation,[0.05,0.45,0.05]);
                lowestLegLeft.addObjects([lowestLegLeftSkin]);  
                mat4.translate(lowestLegLeft.transformation,[0,-0.3,0]); 


                var lowerLegLeft = new SceneNode("lowerLegLeft",[lowestLegLeft]);
                var lowerLegLeftSkin = new SceneNode("lowerLegLeftSkin", [cube], prog_vertexColor); 
                mat4.rotate(lowerLegLeftSkin.transformation, 10 * Math.PI/180, [1,0,0]);
                mat4.scale(lowerLegLeftSkin.transformation,[0.1,0.6,0.1]);
                lowerLegLeft.addObjects([lowerLegLeftSkin]);  
                mat4.translate(lowerLegLeft.transformation,[0,-0.32,-0.08]);


                var kneeLeft = new SceneNode("kneeLeft",[lowerLegLeft]);
                var kneeLeftSkin = new SceneNode("kneeLeftSkin", [bandHip], prog_red);
                mat4.rotate(kneeLeftSkin.transformation, 90 * Math.PI/180, [0,0,1]);        
                kneeLeft.addObjects([kneeLeftSkin]);
                mat4.translate(kneeLeft.transformation,[0,-0.07,-0.23]);


                var thighLeft =  new SceneNode("thighLeft",[kneeLeft]);
                var thighLeftSkin = new SceneNode("thighLeftSkin", [cube], prog_vertexColor); 
                mat4.rotate(thighLeftSkin.transformation, 345 * Math.PI/180, [1,0,0]);
                mat4.scale(thighLeftSkin.transformation,[0.1,0.1,0.45]);
                thighLeft.addObjects([thighLeftSkin]);  
                mat4.translate(thighLeft.transformation,[0,-0.08,-0.3]);


                var hipLeft = new SceneNode("hipLeft",[thighLeft]);
                var hipLeftSkin = new SceneNode("hipLeftSkin", [bandHip], prog_red);
                mat4.rotate(hipLeftSkin.transformation, 90 * Math.PI/180, [0,0,1]);
                hipLeft.addObjects([hipLeftSkin]);  
                mat4.translate(hipLeft.transformation,[0.25,0,0.2]);

// ----------------------------------------------------------------------------------------
                
                var footRight = new SceneNode("footRight");
                var footRightSkin = new SceneNode("footRightSkin", [triangle], prog_vertexColor); 
                mat4.rotate(footRightSkin.transformation, 90 * Math.PI/180, [1,0,0]);
                mat4.scale(footRightSkin.transformation,[0.4,0.4,0.4]);
                footRight.addObjects([footRightSkin]);  
                mat4.translate(footRight.transformation,[0,-0.2,0.18]);

                var lowestLegRight = new SceneNode("lowestLegRight",[footRight]);
                var lowestLegRightSkin = new SceneNode("lowestLegRightSkin", [cube], prog_vertexColor); 
                mat4.rotate(lowestLegRightSkin.transformation, 320 * Math.PI/180, [1,0,0]);
                mat4.scale(lowestLegRightSkin.transformation,[0.05,0.45,0.05]);
                lowestLegRight.addObjects([lowestLegRightSkin]);  
                mat4.translate(lowestLegRight.transformation,[0,-0.3,0]); 


                var lowerLegRight = new SceneNode("lowerLegRight",[lowestLegRight]);
                var lowerLegRightSkin = new SceneNode("lowerLegRightSkin", [cube], prog_vertexColor); 
                mat4.rotate(lowerLegRightSkin.transformation, 10 * Math.PI/180, [1,0,0]);
                mat4.scale(lowerLegRightSkin.transformation,[0.1,0.6,0.1]);
                lowerLegRight.addObjects([lowerLegRightSkin]);  
                mat4.translate(lowerLegRight.transformation,[0,-0.32,-0.08]);


                var kneeRight = new SceneNode("kneeRight",[lowerLegRight]);
                var kneeRightSkin = new SceneNode("kneeRightSkin", [bandHip], prog_red);
                mat4.rotate(kneeRightSkin.transformation, 90 * Math.PI/180, [0,0,1]);
                kneeRight.addObjects([kneeRightSkin]);
                mat4.translate(kneeRight.transformation,[0,-0.07,-0.23]);


                var thighRight =  new SceneNode("thighRight",[kneeRight]);
                var thighRightSkin = new SceneNode("thighRightSkin", [cube], prog_vertexColor); 
                mat4.rotate(thighRightSkin.transformation, 345 * Math.PI/180, [1,0,0]);
                mat4.scale(thighRightSkin.transformation,[0.1,0.1,0.45]);
                thighRight.addObjects([thighRightSkin]);  
                mat4.translate(thighRight.transformation,[0,-0.08,-0.3]);


                var hipRight = new SceneNode("hipRight",[thighRight]);
                var hipRightSkin = new SceneNode("hipRightSkin", [bandHip], prog_red);
                mat4.rotate(hipRightSkin.transformation, 90 * Math.PI/180, [0,0,1]);
                hipRight.addObjects([hipRightSkin]);  
                mat4.translate(hipRight.transformation,[-0.25,0,0.2]);

// ----------------------------------------------------------------------------------------
                  
                var body = new SceneNode("body",[neck,hipLeft,hipRight]);
                
                var bodySkin = new SceneNode("bodySkin", [cube], prog_vertexColor);
                mat4.rotate(bodySkin.transformation, 355 * Math.PI/180, [1,0,0]);
                mat4.scale(bodySkin.transformation,[0.4,0.1,0.6]);

                body.addObjects([bodySkin]);  
                mat4.translate(body.transformation,[0,-0.3,-0.35]);

// ----------------------------------------------------------------------------------------

                // an entire robot
                var robot1  = new SceneNode("robot1", [body]);
                //var robot1  = new SceneNode("robot1", [hipLeft]);
                mat4.translate(robot1.transformation, [0,0.5,0]);

                // the world - this node is needed in the draw() method below!
                this.world  = new SceneNode("world", [robot1], prog_red); 
                
                // for the UI - this will be accessed directly by HtmlController
                this.drawOptions = {"Perspective": true};


                /*
                 *
                 * Method to rotate within a specified joint - called from HtmlController
                 *
                 */

                this.rotateJoint = function(joint, angle) {
                
                    window.console.log("rotating " + joint + " by " + angle + " degrees." );
                    
                    // degrees to radians
                    angle = angle*Math.PI/180;
                    
                    // manipulate the right matrix, depending on the name of the joint
                    switch(joint) {
                        case "worldY": 
                            mat4.rotate(this.world.transformation, angle, [0,1,0]);
                            break;
                        case "worldX": 
                            mat4.rotate(this.world.transformation, angle, [1,0,0]);
                            break;
                        case "body":
                            mat4.rotate(body.transformation, angle, [0,0,1]);
                            break;
                        case "neckY":
                            mat4.rotate(neck.transformation, angle, [1,0,0]);
                            break;
                        case "neckX":
                            mat4.rotate(neck.transformation, angle, [0,1,0]);
                            break;
                        case "hipLeftY":
                            mat4.rotate(hipLeft.transformation, angle, [1,0,0]);
                            break;
                        case "kneeLeftY":
                            mat4.rotate(kneeLeft.transformation, angle, [1,0,0]);
                            break;
                        case "lowestLegLeftY":
                            mat4.rotate(lowestLegLeft.transformation, angle, [1,0,0]);
                            break;
                        case "footLeftY":
                            mat4.rotate(footLeft.transformation, angle, [1,0,0]);
                            break;
                        case "hipRightY":
                            mat4.rotate(hipRight.transformation, angle, [1,0,0]);
                            break;
                        case "kneeRightY":
                            mat4.rotate(kneeRight.transformation, angle, [1,0,0]);
                            break;
                        case "lowestLegRightY":
                            mat4.rotate(lowestLegRight.transformation, angle, [1,0,0]);
                            break;
                        case "footRightY":
                            mat4.rotate(footRight.transformation, angle, [1,0,0]);
                            break;
                        default:
                            window.console.log("joint " + joint + " not implemented:");
                            break;
                    };
                    this.draw();
                }; // rotateJoint()
                
            }; // MyRobotScene constructor
            
            // the scene's draw method draws whatever the scene wants to draw
            MyRobotScene.prototype.draw = function() {
            
                // get aspect ratio of canvas
                var c = $("#drawing_area").get(0);
                var aspectRatio = c.width / c.height;
                
                // set camera's projection matrix in all programs
                var projection = this.drawOptions["Perspective"] ?
                                    mat4.perspective(45, aspectRatio, 0.01, 100) : 
                                    mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);
                
                for(var i=0; i<this.programs.length; i++) {
                    var p = this.programs[i];
                    p.use();
                    p.setUniform("projectionMatrix", "mat4", projection);
                };
                                    
                // initial camera / initial model-view matrix
                var modelView = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);
                
                // shortcut
                var gl = this.gl;
                
                // clear color and depth buffers
                gl.clearColor(0.7, 0.7, 0.7, 1.0); 
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
                
                // enable depth testing, keep fragments with smaller depth values
                gl.enable(gl.DEPTH_TEST); 
                gl.depthFunc(gl.LESS);  
                
                // start drawing at the world's root node
                this.world.draw(gl,this.prog_vertexColor, modelView);

            }; // MyRobotScene draw()
            
            // create scene and start drawing
            var scene = new MyRobotScene(gl);
            scene.draw();
            
            // create an animation: rotate some joints
            var animation = new Animation( (function(t,deltaT) {
            
                this.customSpeed = this.customSpeed || 1;
                
                // speed  times deltaT
                var speed = deltaT/1000*this.customSpeed;
                
                // rotate around Y with relative speed 3
                //scene.rotateJoint("worldY", 0.2*speed);

                // walking
                var bodySpeed = 0.2*speed;
                var hipSpeed = speed;
                var kneeSpeed = 3*speed;
                var lowestLegSpeed = 1.5*speed;
                var footSpeed = 3*speed

                if(t%3000<750){
                    scene.rotateJoint("body",  bodySpeed);
                    scene.rotateJoint("hipLeftY",  hipSpeed);
                    scene.rotateJoint("kneeLeftY", -kneeSpeed);
                    scene.rotateJoint("lowestLegLeftY", -lowestLegSpeed);
                    scene.rotateJoint("footLeftY", footSpeed);
                }else if(t%3000>750 && t%3000<1500){
                    scene.rotateJoint("body",  -bodySpeed);
                    scene.rotateJoint("hipLeftY", -hipSpeed);
                    scene.rotateJoint("kneeLeftY", kneeSpeed);
                    scene.rotateJoint("lowestLegLeftY", lowestLegSpeed);
                    scene.rotateJoint("footLeftY", -footSpeed);
                }

                if(t%3000>1500 && t%3000<2250){
                    scene.rotateJoint("body",  -bodySpeed);
                    scene.rotateJoint("hipRightY", hipSpeed);
                    scene.rotateJoint("kneeRightY",-kneeSpeed);
                    scene.rotateJoint("lowestLegRightY", -lowestLegSpeed);
                    scene.rotateJoint("footRightY", footSpeed);
                }else if(t%3000>2250){
                    scene.rotateJoint("body",  bodySpeed);
                    scene.rotateJoint("hipRightY", -hipSpeed);
                    scene.rotateJoint("kneeRightY", kneeSpeed);
                    scene.rotateJoint("lowestLegRightY", lowestLegSpeed);
                    scene.rotateJoint("footRightY", -footSpeed);
                }

                var headSpeed = 0.5*speed;

                // looking
                if(t%20000<2500){
                    scene.rotateJoint("neckX", -headSpeed);
                }else if(t%20000>3500 && t%20000<5000){
                    scene.rotateJoint("neckY", headSpeed);
                }else if(t%20000>5000 && t%20000<8000){
                    scene.rotateJoint("neckY", -headSpeed);
                }else if(t%20000>8500 && t%20000<10000){
                    scene.rotateJoint("neckY", headSpeed);
                }else if(t%20000>13000 && t%20000<15500){
                    scene.rotateJoint("neckX", headSpeed);
                }
            
                // redraw
                scene.draw();
                
            }));
            
            // create HTML controller that handles all the interaction of
            // HTML elements with the scene and the animation
            var controller = new HtmlController(scene,animation); 
        
        // end of try block
        } catch(err) {
            if($("#error")) {
                $('#error').text(err.message || err);
                $('#error').css('display', 'block');
            };
            window.console.log("exception: " + (err.message || err));;
            throw err;
        };
        
        
    })); // $(document).ready()
    
    
})); // define module
        

