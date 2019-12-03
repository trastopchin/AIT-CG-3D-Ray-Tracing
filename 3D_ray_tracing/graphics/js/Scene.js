/*
Tal Rastopchin
December 1, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.
*/
"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];
    this.gameObjects = [];

    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");    
    this.programs.push( 
    	this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured));

    this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad-vs.glsl");    
    this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace-fs.glsl");
    this.fsShow = new Shader(gl, gl.FRAGMENT_SHADER, "show-fs.glsl");
    this.programs.push( 
    	this.traceProgram = new TexturedProgram(gl, this.vsQuad, this.fsTrace));
    this.programs.push( 
      this.showProgram = new TexturedProgram(gl, this.vsQuad, this.fsShow));

    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);    

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.traceMaterial = new Material(this.traceProgram);
    this.envTexture = new TextureCube(gl, [
      "media/fnx.png",
      "media/fx.png",
      "media/fy.png",
      "media/fny.png",
      "media/fz.png",
      "media/fnz.png",]
      );
    this.traceMaterial.envTexture.set(this.envTexture);
    this.traceMesh = new Mesh(this.traceMaterial, this.texturedQuadGeometry);

    this.traceQuad = new GameObject(this.traceMesh);
    this.gameObjects.push(this.traceQuad);

    this.slowpokeMaterial = new Material(this.texturedProgram);
    this.slowpokeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonDh.png"));
    this.eyeMaterial = new Material(this.texturedProgram);
    this.eyeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"));
    this.mesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", 
        [this.slowpokeMaterial, this.eyeMaterial]);

    this.avatar =  new GameObject(this.mesh);
    //this.gameObjects.push(this.avatar);

    this.camera = new PerspectiveCamera(...this.programs); 
    this.camera.position.set(0, 0, 8);
    this.camera.update();

    // scene clipped quadrics management and definition
    this.clippedQuadrics = [];

    this.clippedQuadrics.push(
      new ClippedQuadric(this.clippedQuadrics.length, ...this.programs));
    this.clippedQuadrics[0].makeUnitSphere();
    this.clippedQuadrics[0].transform(new Mat4().translate(0, 0, 0));

    this.clippedQuadrics.push(
      new ClippedQuadric(this.clippedQuadrics.length, ...this.programs));
    this.clippedQuadrics[1].makePlane();
    this.clippedQuadrics[1].transform(new Mat4().translate(0, -2, 0));

    // defining scene lights
    this.lights = [];

    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights[0].position.set(1, 1, 1, 1);
    this.lights[0].powerDensity.set(1, 1, 1);

    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights[1].position.set(0, 4, 0, 1);
    this.lights[1].powerDensity.set(10, 10, 10);

    this.addComponentsAndGatherUniforms(...this.programs);

    gl.enable(gl.DEPTH_TEST);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.width / canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
    this.timeAtLastFrame = timeAtThisFrame;
    this.time = t;

    this.lights[1].position.set(Math.cos(t), 2, Math.sin(t), 1);

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.move(dt, keysPressed);

    for(const gameObject of this.gameObjects) {
        gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
        gameObject.draw(this, this.camera, ...this.clippedQuadrics, ...this.lights);
    }
  }
}
