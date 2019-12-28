# AIT-CG-3D-Ray-Tracing

Implemented a real-time ray tracer depicting a 3D winter holiday scene with realistic lighting. Created as a second milestone of the 3D project for my Computer Graphics course at the Aquincum Instute of Technology the fall of 2019 with professor László Szécsi.

<p align="center">
  <img src="/resources/screenshot01.png" alt="A screenshot of the running project demonstrating each of the completed features." width="800">
</p>

One should be able to download the [3D_ray_tracing](https://github.com/trastopchin/AIT-CG-3D-Ray-Tracing/tree/master/3D_ray_tracing) folder and open up the [index.html](https://github.com/trastopchin/AIT-CG-3D-Ray-Tracing/blob/master/3D_ray_tracing/graphics/index.html) file in a web browser to see the project. To navigate the scene one can use the WASD keys to move around as well as click down and drag the mouse to change the camera's orientation. In the case of google chrome, one might have to open the browser with `open /Applications/Google\ Chrome.app --args --allow-file-access-from-files` in order to load images and textures properly. This project was built upon László Szécsi's starter code and class powerpoint slides.

Whereas there is still some JavaScript code that is making this project work, the majority of the ray tracing implementation takes place within the [trace-fs.glsl](https://github.com/trastopchin/AIT-CG-3D-Ray-Tracing/blob/master/3D_ray_tracing/graphics/js/shaders/trace-fs.glsl) fragment shader.

## Implementation Details

* This ray tracer renders implicitly defined quadratic surfaces with point lights, directional lights, the maximum blinn-phong reflection model, shadows, and ideal mirror reflection. The ray tracer handles shadows and ideal reflection by using secondary rays to probe the scene for light occluders and compute the incoming illumination of an ideal reflection.

* By implementing the ray tracing algorithm in a GLSL fragment shader, we are able take advantage of the natural parallelization of the OpenGL rendering pipeline. This is important because we can vastly speed up our algorithm without having to worry about parallelization details.

* As opposed to finding the ray-surface intersection for a certain set of quadric surfaces explicitly, this ray tracer generalizes to solve an arbitrary ray-quadric intersection. The ray tracer handles this by storing the coefficents of a generic quadratic surface in a 4x4 matrix. To determine the associated quadratic surface, we can multiply said 4x4 matrix with the row vector (x y z 1) from the left and the column vector (x y z 1)^T from the right. In this fashion, we can write an `intersectQuadric` method that takes both a quadratic coefficient matrix and a ray and determines the ray-quadric intersection for that specific quadratic surface. This is useful because we do not have to write and explicitly solve for individual ray-quadric intersections. Furthermore, we can determine the surface normal in terms of this quadratic coefficent matrix, and so this method naturally works with basic lighting and recursive ray tracing methods.

## Completed Project Features

1. **Point light.** At least one point light source and corresponding properly cast, not just plane-projected shadows should be present.

2. **Directional light.** At least one directional light source and corresponding properly cast shadows should be present.

3. **Fir.** A stylized evergreen made primarily out of clipped cones or parabolids, with diffuse green color.

4. **Wooden floor.** An infinite plane of wood, featuring diffuse reflection with a procedural texturing pattern.

5. **Polished wood.** The wooden floor also has ideal reflection.

6. **Snowman.** A snowman made out of diffuse white sphere, an orange cone for a nose, and some black pieces of coal for eyes.

7. **Baubles.** Ellipsoids made of an ideally reflective (mirror-like) material.

## Built With

* [WebGLMath](https://github.com/szecsi/WebGLMath) - László Szécsi's vector math library for WebGL programming.
