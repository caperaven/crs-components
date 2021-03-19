precision highp float;

uniform sampler2D map;
varying vec2 texCoord;

void main() {
     vec3 color = texture2D(map, texCoord).rgb;
     gl_FragColor = vec4(color, 1.0);
}

