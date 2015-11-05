var titlePhong = {
 
    uniforms: THREE.UniformsUtils.merge( [
 
        THREE.UniformsLib[ "common" ],
        THREE.UniformsLib[ "bump" ],
        THREE.UniformsLib[ "normalmap" ],
        THREE.UniformsLib[ "fog" ],
        THREE.UniformsLib[ "lights" ],
        THREE.UniformsLib[ "shadowmap" ],
 
        {
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
            "shininess": { type: "f", value: 30 },
            "mult": { type: "f", value: 1 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 )},
            "time"  : { type: "f", value: 0.0}
        }
 
    ] ),
 
     
    vertexShader: [
        //"#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        //"#define USE_MAP",
        "#define USE_ENVMAP",
        "#define ENVMAP_TYPE_CUBE",
        "#define ENVMAP_MODE_REFLECTION",
        "#define ENVMAP_BLENDING_MULTIPLY",
        "#define WRAP_AROUND",
        "#define USE_SKINNING",
        //"#define USE_BUMPMAP",
         
        "varying vec3 vViewPosition;",
 
        "#ifndef FLAT_SHADED",
 
        "   varying vec3 vNormal;",
 
        "#endif",
 
        THREE.ShaderChunk[ "common" ],
        THREE.ShaderChunk[ "map_pars_vertex" ],
        THREE.ShaderChunk[ "lightmap_pars_vertex" ],
        THREE.ShaderChunk[ "envmap_pars_vertex" ],
        THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
        THREE.ShaderChunk[ "color_pars_vertex" ],
        //THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
        THREE.ShaderChunk[ "skinning_pars_vertex" ],
        THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
        THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],
        "uniform float time;",
        //"attribute vec3 center;",
        //"attribute float level;",
        "attribute float wf;",
         
        "void main() {",
 
            THREE.ShaderChunk[ "map_vertex" ],
            THREE.ShaderChunk[ "lightmap_vertex" ],
            THREE.ShaderChunk[ "color_vertex" ],
            //THREE.ShaderChunk[ "morphnormal_vertex" ],
            THREE.ShaderChunk[ "skinbase_vertex" ],
            THREE.ShaderChunk[ "skinnormal_vertex" ],
             
            THREE.ShaderChunk[ "defaultnormal_vertex" ],
 
            "#ifndef FLAT_SHADED", // Normal computed with derivatives when FLAT_SHADED
 
            "   vNormal = normalize( transformedNormal );",
 
            "#endif",
 
            //"float timeRatio = 1.0 - smoothstep(0.0, 5.0, 0.6 * time - 0.4 * level);",
            //"float timeRatio = 1.0 - smoothstep(0.0, 5.0, 5.0-wf);",
            "float timeRatio = -0.2+wf*3.8;",
 
            //"vec3 ondulation =  levelRatio * 0.0 * cos(0.02 * time - 0.15 * level) * lineNormal;",
            //"vec3 ondulation = vec3(0.0);",
            //"vec3 dips = position.xyz+normal*wf;",
            //"float disp = noiseScale * pnoise( noiseDetail * position + vec3(undTime, undTime, undTime), vec3( 10.0 ) );",
            //"float disp = noiseScale * pnoise( noiseDetail * position + vec3(time, time, time), vec3( 10.0 ) );",
             
         
            //"vec3 pPosition = mix(position.xyz, center, timeRatio) + ondulation;",
            //"vec4 mv = modelViewMatrix * vec4( newPosition, 1.0 );",
 
            //THREE.ShaderChunk[ "morphtarget_vertex" ],
            "vec3 newPosition = position - normal * timeRatio;", 
             
            //THREE.ShaderChunk[ "skinning_vertex" ],
            "vec4 skinVertex = bindMatrix * vec4( newPosition , 1.0 );",
            "vec4 skinned = vec4( 0.0 );",
            "skinned += boneMatX * skinVertex * skinWeight.x;",
            "skinned += boneMatY * skinVertex * skinWeight.y;",
            "skinned += boneMatZ * skinVertex * skinWeight.z;",
            "skinned += boneMatW * skinVertex * skinWeight.w;",
            "skinned  = bindMatrixInverse * skinned;",
         
            "vec4 mvPosition = modelViewMatrix * skinned;",
         
            "gl_Position = projectionMatrix * mvPosition;",
             
            THREE.ShaderChunk[ "logdepthbuf_vertex" ],
 
            "vViewPosition = -mvPosition.xyz;",
 
            THREE.ShaderChunk[ "worldpos_vertex" ],
            THREE.ShaderChunk[ "envmap_vertex" ],
            THREE.ShaderChunk[ "lights_phong_vertex" ],
            THREE.ShaderChunk[ "shadowmap_vertex" ],
 
        "}"
 
    ].join("\n"),
 
    fragmentShader: [
        //"#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        //"#define USE_MAP",
        "#define USE_ENVMAP",
        "#define ENVMAP_TYPE_CUBE",
        "#define ENVMAP_MODE_REFLECTION", 
        "#define ENVMAP_BLENDING_MULTIPLY",
        "#define WRAP_AROUND",
        "#define USE_SKINNING",
        //"#define USE_BUMPMAP",
         
        "uniform vec3 diffuse;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        "uniform float opacity;",
        "uniform float mult;",
 
        THREE.ShaderChunk[ "common" ],
        THREE.ShaderChunk[ "color_pars_fragment" ],
        THREE.ShaderChunk[ "map_pars_fragment" ],
        THREE.ShaderChunk[ "alphamap_pars_fragment" ],
        THREE.ShaderChunk[ "lightmap_pars_fragment" ],
        THREE.ShaderChunk[ "envmap_pars_fragment" ],
        THREE.ShaderChunk[ "fog_pars_fragment" ],
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
        THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
        THREE.ShaderChunk[ "normalmap_pars_fragment" ],
        THREE.ShaderChunk[ "specularmap_pars_fragment" ],
        THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],
        "void main() {",
 
        "   vec3 outgoingLight = vec3( 0.0 );", // outgoing light does not have an alpha, the surface does
        "   vec4 diffuseColor = vec4( diffuse, opacity );",
 
            THREE.ShaderChunk[ "logdepthbuf_fragment" ],
            THREE.ShaderChunk[ "map_fragment" ],
            THREE.ShaderChunk[ "color_fragment" ],
            THREE.ShaderChunk[ "alphamap_fragment" ],
            THREE.ShaderChunk[ "alphatest_fragment" ],
            THREE.ShaderChunk[ "specularmap_fragment" ],
 
            THREE.ShaderChunk[ "lights_phong_fragment" ],
 
            THREE.ShaderChunk[ "lightmap_fragment" ],
            THREE.ShaderChunk[ "envmap_fragment" ],
            THREE.ShaderChunk[ "shadowmap_fragment" ],
 
            THREE.ShaderChunk[ "linear_to_gamma_fragment" ],
 
            THREE.ShaderChunk[ "fog_fragment" ],
 
        "   gl_FragColor = vec4( outgoingLight, diffuseColor.a )*mult;",    // TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects
 
        "}"
 
    ].join("\n")
 
}