precision highp float;

varying vec2 texCoord;
uniform sampler2D map;
uniform vec3 fgColor;
uniform float distanceFactor;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main() {
    vec3 smpl = texture2D(map, texCoord).rgb;
    float sigDist = distanceFactor * (median(smpl.r, smpl.g, smpl.b) - 0.5);
    float opacity = clamp(sigDist + 0.5, 0.0, 1.0);
    gl_FragColor = vec4(fgColor, opacity);
}