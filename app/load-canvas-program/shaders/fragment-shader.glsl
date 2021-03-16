precision highp float;

uniform sampler2D u_msdf;
uniform vec3 u_fgColor;
uniform vec3 u_bgColor;
uniform float u_pxRange;
in vec2 texCoord;
out vec4 color;

float median(float r, float g, float b) {
     return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
     vec2 unitRange = vec2(u_pxRange)/vec2(textureSize(u_msdf, 0));
     vec2 screenTexSize = vec2(1.0)/fwidth(texCoord);
     return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

void main() {
     vec3 msd = texture(u_msdf, texCoord).rgb;
     float sd = median(msd.r, msd.g, msd.b);
     float screenPxDistance = screenPxRange()*(sd - 0.5);
     float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);

     vec3 result = mix(u_fgColor, u_bgColor, opacity);
     color = vec4(result, 1.0);
}

