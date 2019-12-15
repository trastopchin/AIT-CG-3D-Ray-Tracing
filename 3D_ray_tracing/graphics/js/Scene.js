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

    this.camera = new PerspectiveCamera(...this.programs); 
    this.camera.position.set(0, 2, 8);
    this.camera.pitch = -0.2;
    this.camera.update();

    // scene definition
    this.clippedQuadrics = [];
    this.lights = [];

    this.woodenFloor = this.createClippedQuadric();
    this.woodenFloor.makePlane();
    this.woodenFloor.transform(new Mat4().translate(0, -2, 0));
    this.woodenFloor.procMix = 1;
    this.woodenFloor.reflectance.set(0.5, 0.5, 0.5);

    
    for (let i = -1; i < 2; i+=2) {
      for (let j = -1; j < 2; j+=2) {
        const ball = this.createClippedQuadric();
        
        ball.makeUnitSphere();
        ball.transform(new Mat4().scale(1.5, 1, 1));
        ball.transform(new Mat4().translate(4 + i, 0, j));

        ball.reflectance.set(1, 1, 1);
        ball.materialColor.set(0, 0, 0);
      }
    }
    
    this.tree1 = this.createClippedQuadric();
    this.tree1.makeUnitCone();
    this.tree1.materialColor.set(0, 1, 0);
    this.tree1.specularColor.set(0, 0, 0);
    this.tree2 = this.createClippedQuadric();
    this.tree2.makeUnitCone();
    this.tree2.materialColor.set(0, 1, 0);
    this.tree2.specularColor.set(0, 0, 0);
    this.tree3 = this.createClippedQuadric();
    this.tree3.makeUnitCone();
    this.tree3.materialColor.set(0, 1, 0);
    this.tree3.specularColor.set(0, 0, 0);

    const t = new Mat4().rotate(Math.PI);
    t.scale(1, 2, 1);
    t.translate(0, 1, 0);
    this.tree1.transform(t);
    t.scale(0.8, 1, 0.8);
    t.translate(0, 1, 0);
    this.tree2.transform(t);
    t.scale(0.8, 1, 0.8);
    t.translate(0, 1, 0);
    this.tree3.transform(t);
    

    for (let i = 0; i < 3; i++) {
      const snowBall = this.createClippedQuadric();
      snowBall.makeUnitSphere();

      snowBall.transform(new Mat4().scale(1-i/3, 1-i/3 ,1-i/3).translate(-4, i, 0));
      if (i === 1) {
        snowBall.transform(new Mat4().translate(0, 0.2, 0));
      }

      if (i === 2) {
        const eye1 = this.createClippedQuadric();
        eye1.makeUnitSphere();
        eye1.transform(new Mat4()
          .scale(0.05, 0.05, 0.05)
          .translate(-4+0.2, i+0.1, 0.25));
        eye1.materialColor.set(0, 0, 0);

        const eye2 = this.createClippedQuadric();
        eye2.makeUnitSphere();
        eye2.transform(new Mat4()
          .scale(0.05, 0.05, 0.05)
          .translate(-4-0.2, i+0.1, 0.25));
        eye2.materialColor.set(0, 0, 0);

        const nose = this.createClippedQuadric();
        nose.makeUnitCone();
        nose.transform(new Mat4()
          .scale(0.1, 1, 0.1)
          .rotate(-Math.PI/2, 1, 0, 0)
          .translate(-4, i, 1));

        nose.materialColor.set(1, 0.75, 0);
      }

      snowBall.materialColor.set(1, 1, 1);
      snowBall.specularColor.set(0, 0, 0);
    }

    this.dir1 = this.createLight();
    this.dir1.position.set(1, 1, 1, 0);
    this.dir1.powerDensity.set(2, 2, 2);

    this.point1 = this.createLight();
    this.point1.powerDensity.set(4, 4, 4);

    

    // my code here

    this.addComponentsAndGatherUniforms(...this.programs);

    gl.enable(gl.DEPTH_TEST);
  }

  createClippedQuadric() {
    const clippedQuadric = new ClippedQuadric(this.clippedQuadrics.length, ...this.programs);
    clippedQuadric.materialColor.set(1, 1, 1);
    clippedQuadric.specularColor.set(1, 1, 1);
    clippedQuadric.procMix = 0;
    clippedQuadric.reflectance.set(0, 0, 0);
    this.clippedQuadrics.push(clippedQuadric);
    return clippedQuadric;
  }

  createLight() {
    const light = new Light(this.lights.length, ...this.programs);
    this.lights.push(light);
    return light;
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

    // my code here
    this.point1.position.set(4 * Math.cos(t), 1, 4 * Math.sin(t), 1);

    // my code here

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
