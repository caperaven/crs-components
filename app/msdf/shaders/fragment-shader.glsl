precision highp float;

in vec2 texCoord;
out vec4 color;
uniform sampler2D map;
uniform vec3 fgColor;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main() {
    vec3 smpl = texture(map, texCoord).rgb;
    float dist = 0.5 - median(smpl.r, smpl.g, smpl.b);
    float alpha = clamp(dist / fwidth(dist) + 0.5, 0.0, 1.0);

    if (alpha < 0.0001)
    {
        discard;
    }

    color = vec4(fgColor, alpha);
}