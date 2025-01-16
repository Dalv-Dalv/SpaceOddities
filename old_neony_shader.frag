#ifdef GL_ES
precision mediump float;
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

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b * cos(6.28318 * (c * t * d));
}

vec3 customPalette(float t){
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t * d));
}

vec3 newPalette(float t){
    t = fract(t);
    vec3 a = vec3(1.0, 0.0, 0.0);
    vec3 b = vec3(0.0, 1.0, 1.0);
    vec3 c = vec3(1.0, 0.0, 0.0);
    float midt = t * 0.5 + 0.5;
    //0 -> 0.5
    // -1 -> -0.5 -> 0
    return a;
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

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv0 = (fragCoord / u_resolution) * 2.0 - 1.0;
    float t = u_time * 0.5;

    float scroll = u_scroll;

    vec2 mouse = (u_mouse / u_resolution) * 2.0 - 1.0 + vec2(0.1, -0.05);

    uv0.x *= u_resolution.x / u_resolution.y;

    uv0 = uv0 * 1.0;

    uv0 = uv0 + vec2(0.0, 1.0) * scroll * 1.0;

    vec3 finalCol = vec3(0.0);

    const float n = 10.0;
    for(float i = 0.0; i < n; i++){
        mat2 m = mat2( 1.6,  1.2, -1.2,  1.6);
        uv0 = uv0 * 1.02 + vec2(sin(t + i) * 0.3, cos(t + i) * 0.3) / 20.0 + mouse * 0.004;
        uv0 = uv0 + vec2(0.0, 1.0) * scroll * (i + 1.0) * 0.02;
        //uv0 = uv0 * 1.02 + vec2(0.1, 0.1) / 2.0;

        vec2 uv = uv0;
        vec2 offs = vec2(t, t) * 0.1;
        float f = 0.5000*noise(uv + offs); uv = m*uv;
        f += 0.2500*noise(uv + offs); uv = m*uv;
        f += 0.1250*noise(uv + offs); uv = m*uv;
        f += 0.0625*noise(uv + offs); uv = m*uv;

        float d = f;
        d = abs(sin(d * 6.0 + t));
        d = pow(0.04/d, 1.4);

        d = clamp(d, 0.0, 1.0);
        vec3 col = customPalette(f + t + i / n) * d;
        finalCol += clamp(col, 0.0, 1.0) * (n - 1.0 - i) / n;
        finalCol = clamp(finalCol, 0.0, 1.0);
    }

    fragColor = vec4(finalCol, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}