# AIT-CG-3D-Ray-Tracing

Implement a real-time ray tracer depicting a 3D winter holiday scene with realistic lighting. Created as a second milestone of the 3D project for my Computer Graphics course at the Aquincum Instute of Technology the fall of 2019 with professor László Szécsi.

<p align="center">
  <img src="/resources/screenshot01.png" alt="A screenshot of the running project demonstrating each of the completed features." width="800">
</p>

One should be able to download the [3D_ray_tracing](https://github.com/trastopchin/AIT-CG-3D-Ray-Tracing/tree/master/3D_ray_tracing) folder and open up the [index.html](https://github.com/trastopchin/AIT-CG-3D-Ray-Tracing/blob/master/3D_ray_tracing/graphics/index.html) file in a web browser to see the project. To navigate the scene one can use the WASD keys to move around as well as click down and drag the mouse to change the camera's orientation. In the case of google chrome, one might have to open the browser with `open /Applications/Google\ Chrome.app --args --allow-file-access-from-files` in order to load images and textures properly. This project was built upon László Szécsi's starter code and class powerpoint slides.

Whereas there is still some JavaScript code that is making this project work, the majority of the ray tracing implementation takes place within the [trace-fs.glsl](https://github.com/trastopchin/AIT-CG-3D-Ray-Tracing/blob/master/3D_ray_tracing/graphics/js/shaders/trace-fs.glsl) fragment shader.

## Completed Features:

1. **Point light.** At least one point light source and corresponding properly cast, not just plane-projected shadows should be present.

2. **Directional light.** At least one directional light source and corresponding properly cast shadows should be present.

3. **Fir.** A stylized evergreen made primarily out of clipped cones or parabolids, with diffuse green color.

4. **Wooden floor.** An infinite plane of wood, featuring diffuse reflection with a procedural texturing pattern.

5. **Polished wood.** The wooden floor also has ideal reflection.

6. **Snowman.** A snowman made out of diffuse white sphere, an orange cone for a nose, and some black pieces of coal for eyes.

7. **Baubles.** Ellipsoids made of an ideally reflective (mirror-like) material.

## Built With

* [WebGLMath](https://github.com/szecsi/WebGLMath) - László Szécsi's vector math library for WebGL programming.
