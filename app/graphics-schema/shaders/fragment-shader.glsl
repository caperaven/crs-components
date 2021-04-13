precision highp float;

uniform sampler2D map;
uniform vec3 u_color;
varying vec2 texCoord;

float median(float r, float g, float b) {
     return max(min(r, g), min(max(r, g), b));
}

void main() {
     vec3 color = texture2D(map, texCoord).rgb;
     float dis = 0.5 - median(color.r, color.g, color.b);
     dis += min(0.2, abs(dis));

     gl_FragColor = vec4(gl_FragCoord.x/600.0, 0.0, 0.0, 1.0);

//     vec3 color = texture2D(map, texCoord).rgb;
//     vec3 factor = vec3(0.3, 0.3, 0.3);
//     float gray = dot(color, factor);
//     gl_FragColor = vec4(vec3(gray), 1.0);
}

