#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform float u_scroll;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec3 color_sdf(float sdf, vec3 color){
    return color * clamp((-sdf), 0.0, 1.0);
}
float circle_sdf(vec2 uv, vec2 pos, float radius) {
    return length(uv - pos) - radius;
}

float smin(float a, float b, float k) {
    k *= 2.0;
    float x = b-a;
    return 0.5*( a+b-sqrt(x*x+k*k) );
}

vec2 hash(vec2 p){
	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float noise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2  i = floor( p + (p.x+p.y)*K1 );
    vec2  a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x); 
    vec2  o = vec2(m,1.0-m);
    vec2  b = a - o + K2;
	vec2  c = a - 1.0 + 2.0*K2;
    vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
}

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float voronoi(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);

    float res = 8.0;
    for(int j=-1; j<=1; j++)
    for(int i=-1; i<=1; i++)
    {
        vec2 b = vec2(i, j);
        vec2 point = random2(p + b);
        vec2 r = vec2(b) - f + point;
        float d = dot(r, r);

        res = min(res, d);
    }
    return sqrt(res);
}

vec3 hueShift(vec3 col, float shift) {
    vec3 P = vec3(0.55735)*dot(vec3(0.55735),col);
    
    vec3 U = col-P;
    
    vec3 V = cross(vec3(0.55735),U);

    col = U*cos(shift*6.2832) + V*sin(shift*6.2832) + P;
    
    return col;
}

vec3 lerpCol(vec3 a, vec3 b, float t) {
    return a * t + b * (1.0 - t);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord / u_resolution) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    vec2 mouse = (u_mouse / u_resolution) * 2.0 - 1.0 + vec2(0.1, -0.05);


    float t = u_time * 1.0;
    float scroll = u_scroll;


    vec2 layerUV = uv * 0.13 + vec2(0.0, scroll * 0.1);
    vec3 finalCol = vec3(0.0);
    const float numLayers = 4.0;
    for(float i = 0.0; i < numLayers; i++){
        float lerp_i = (1.0 - i / numLayers) * 0.9;

        layerUV = layerUV * 1.5 + vec2(10.0 + t * 0.01, 10.0);
        layerUV = layerUV + vec2(0.0, 1.0) * (scroll) * 0.1;
        // layerUV += mouse * 0.005;

        vec2 fuv = layerUV * 3.0; // Noise size
        mat2 m = mat2( 1.6,  1.2, -1.2,  1.6);
        float f0 = noise(fuv * 10.0); // Fbm level 0 noise / Simplex base noise
        float f = 0.0;
        f += 0.5000*f0; fuv = m*fuv; // Calculate fbm noise
        f += 0.2500*noise(fuv); fuv = m*fuv;


        float saturation = 0.1;
        vec3 colorVariation = vec3(1.0 - saturation) + hueShift(vec3(1.0, 0.5, 0.2), f * 0.4 + 0.8 + lerp_i * 0.2) * saturation;
        float ft = abs(noise(fuv * 2.0 + vec2(t, t) * 0.1));
        colorVariation *= ft * 0.9 + 0.1;


        f0 = clamp(abs(f0), 0.0, 0.9) + 0.1;

        float x = ((0.01 + i * 0.01) * (f0 * 0.6 + 0.4)) / (voronoi(layerUV * 20.0));
        x = clamp(pow(x, 1.5), 0.0, 2.0); // contrast


        finalCol += colorVariation * x * (lerp_i + 0.1);
    }

    // float fade = clamp(clamp((fragCoord.y / 1080.0), 0.0, 1.0) * 2.0, 0.0, 1.0);
    // finalCol *= fade;
    
    fragColor = vec4(finalCol, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}