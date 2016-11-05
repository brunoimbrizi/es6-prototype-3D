// @author brunoimbrizi / http://brunoimbrizi.com

// uniform sampler2D map;
varying vec2 vUv;

void main() {
	vec2 uv = vUv;
	// gl_FragColor = texture2D( map, uv );
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}