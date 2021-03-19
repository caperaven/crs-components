precision highp float;

uniform sampler2D map;
uniform vec3 u_color;
varying vec2 texCoord;

void main() {
     vec3 color = texture2D(map, texCoord).rgb;
     vec3 result = mix(color, u_color, 0.5);
     gl_FragColor = vec4(result, 1.0);
}

