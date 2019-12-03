/*
Tal Rastopchin
December 1, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.
*/
"use strict"; 
/* exported ClippedQuadric */
class ClippedQuadric extends UniformProvider {
  constructor(id, ...programs) {
    super(`clippedQuadrics[${id}]`);
    this.addComponentsAndGatherUniforms(...programs);
  }

  makeUnitSphere() {
    this.surface.set(
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      0,  0,  0, -1);

    this.clipper.set(
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      0,  0,  0, -2);
  }

  makeUnitCylinder(){
    this.surface.set(
      1,  0,  0,  0,
      0,  0,  0,  0,
      0,  0,  1,  0,
      0,  0,  0, -1);

    this.clipper.set(
      0,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  0,  0,
      0,  0,  0, -0.5);
  }

  makeUnitCone(){
    this.surface.set(
      1,  0,  0,  0,
      0,  -1,  0,  0,
      0,  0,  1,  0,
      0,  0,  0,  0);

    this.clipper.set(
      0,  0,  0,  0,
      0,  1,  0,  -1,
      0,  0,  0,  0,
      0,  0,  0,  0);
  }

  makeUnitParaboloid(){
    this.surface.set(
      1,  0,  0,  0,
      0,  0,  0,  -1,
      0,  0,  1,  0,
      0,  0,  0,  0);

    this.clipper.set(
      0,  0,  0,  0,
      0,  1,  0,  -1,
      0,  0,  0,  0,
      0,  0,  0,  0);
  }

  makePlane() {
    this.surface.set(
      0,  0,  0,  0,
      0,  1,  0,  -1,
      0,  0,  0,  0,
      0,  0,  0,  0);

    this.clipper.set(
      0,  0,  0,  0,
      0,  1,  0,  -2,
      0,  0,  0,  0,
      0,  0,  0,  0);
  }

  // transforms both the surface and the clipper matrices according
  // to the transformation matrix T
  transform(T) {
    const Tcopy = T.clone();

    // transform surface
    T.invert();               // T is now T-1
    this.surface.premul(T);   // A is now T-1 * A
    T.transpose();            // T is now T-1T
    this.surface.mul(T);      // A is now A'

    // transform clipper
    Tcopy.invert();
    this.clipper.premul(Tcopy);
    Tcopy.transpose();
    this.clipper.mul(Tcopy);
  }
}

