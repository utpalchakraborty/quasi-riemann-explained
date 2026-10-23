import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React, {useMemo} from 'react';
import * as THREE from 'three';
import numerics from '../data/numerics.json';
import {color} from '../design/tokens';

// The computed surface log|zeta(sigma + i t)| in 3D, shaded as a cyanotype
// relief: contour lines on the surface, the strip edges and the critical line
// drawn into it, and each zero a well. The camera flies up the critical line.

const L = numerics.landscape as {sigma: number[]; t: number[]; abs_zeta: number[][]};
const NT = L.t.length;
const I0 = L.sigma.findIndex((v) => v >= -0.1 - 1e-9);
const I1 = L.sigma.findIndex((v) => v >= 1.1 - 1e-9);
const NS = I1 - I0 + 1;
const FLOOR = -3;
const CEIL = 1.9;
export const SX = 10; // world units per unit of sigma
export const TY = 2; // world units per unit of t
export const HZ = 1.0; // world units per unit of log|zeta|
const sigmaToX = (s: number) => (s - 0.5) * SX;
const tToY = (t: number) => (t - L.t[0]) * TY;
const zeros = (numerics.zeta_zero_heights as number[]).filter((v) => v > L.t[0] && v < L.t[NT - 1]);

const vertex = /* glsl */ `
varying vec3 vWorld;
varying float vH;
varying float vSigma;
attribute float h;
attribute float sigma;
void main() {
  vH = h;
  vSigma = sigma;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const fragment = /* glsl */ `
uniform vec3 cDeep;
uniform vec3 cLift;
uniform vec3 cMist;
uniform vec3 cPaper;
uniform vec3 cGilt;
uniform float frontier;   // sigma of a gilt line, < 0 for none
uniform float lines;      // contour visibility
uniform vec3 camPos;
varying vec3 vWorld;
varying float vH;
varying float vSigma;
float band(float v, float w) {
  float d = abs(fract(v - 0.5) - 0.5);
  return 1.0 - smoothstep(0.0, fwidth(v) * w, d);
}
void main() {
  vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  float diffuse = clamp(dot(n, normalize(vec3(-0.4, -0.6, 0.9))), 0.0, 1.0);
  float k = smoothstep(${FLOOR.toFixed(1)}, ${CEIL.toFixed(1)}, vH);
  vec3 high = mix(cLift, cMist, 0.32);
  vec3 col = mix(cLift * 0.8, high, k) * (0.62 + 0.55 * diffuse);
  float minor = band(vH * 4.0, 1.1);
  float major = band(vH, 1.4);
  col = mix(col, cMist, 0.45 * minor * lines);
  col = mix(col, cPaper, 0.85 * major * lines);
  float edge = max(band(vSigma, 1.6) * step(abs(vSigma - 0.5), 0.6), 0.0);
  col = mix(col, cMist, 0.6 * edge * step(0.9, abs(vSigma - 0.5) * 2.0));
  float crit = 1.0 - smoothstep(0.0, fwidth(vSigma) * 1.5, abs(vSigma - 0.5));
  col = mix(col, cMist, 0.5 * crit);
  if (frontier > 0.0) {
    float g = 1.0 - smoothstep(0.0, fwidth(vSigma) * 2.5, abs(vSigma - frontier));
    col = mix(col, cGilt, g);
  }
  float dist = length(vWorld - camPos);
  float fog = smoothstep(16.0, 48.0, dist);
  col = mix(col, cDeep, fog);
  gl_FragColor = vec4(col, 1.0);
}`;

const Surface: React.FC<{lines: number; frontier: number; camPos: THREE.Vector3}> = ({lines, frontier, camPos}) => {
	const geometry = useMemo(() => {
		const g = new THREE.BufferGeometry();
		const pos = new Float32Array(NS * NT * 3);
		const hs = new Float32Array(NS * NT);
		const ss = new Float32Array(NS * NT);
		for (let j = 0; j < NT; j++)
			for (let i = 0; i < NS; i++) {
				const k = j * NS + i;
				const h = Math.min(CEIL, Math.max(FLOOR, Math.log(L.abs_zeta[j][I0 + i])));
				pos[k * 3] = sigmaToX(L.sigma[I0 + i]);
				pos[k * 3 + 1] = tToY(L.t[j]);
				pos[k * 3 + 2] = h * HZ;
				hs[k] = h;
				ss[k] = L.sigma[I0 + i];
			}
		const idx: number[] = [];
		for (let j = 0; j < NT - 1; j++)
			for (let i = 0; i < NS - 1; i++) {
				const a = j * NS + i;
				idx.push(a, a + 1, a + NS, a + 1, a + NS + 1, a + NS);
			}
		g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		g.setAttribute('h', new THREE.BufferAttribute(hs, 1));
		g.setAttribute('sigma', new THREE.BufferAttribute(ss, 1));
		g.setIndex(idx);
		return g;
	}, []);
	const uniforms = useMemo(
		() => ({
			cDeep: {value: new THREE.Color(color.fieldDeep)},
			cLift: {value: new THREE.Color(color.fieldLift)},
			cMist: {value: new THREE.Color(color.mist)},
			cPaper: {value: new THREE.Color(color.paper)},
			cGilt: {value: new THREE.Color(color.gilt)},
			frontier: {value: -1},
			lines: {value: 1},
			camPos: {value: new THREE.Vector3()},
		}),
		[],
	);
	uniforms.frontier.value = frontier;
	uniforms.lines.value = lines;
	uniforms.camPos.value.copy(camPos);
	return (
		<mesh geometry={geometry}>
			<shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} side={THREE.DoubleSide} />
		</mesh>
	);
};

const Zeros: React.FC<{p: number}> = ({p}) => (
	<>
		{zeros.map((g) => (
			<group key={g} position={[sigmaToX(0.5), tToY(g), FLOOR * HZ]}>
				<mesh>
					<sphereGeometry args={[0.18, 16, 16]} />
					<meshBasicMaterial color={color.paper} transparent opacity={p} />
				</mesh>
				<mesh position={[0, 0, 2.2]}>
					<cylinderGeometry args={[0.025, 0.025, 4.4, 8]} />
					<meshBasicMaterial color={color.paper} transparent opacity={0.55 * p} />
				</mesh>
			</group>
		))}
	</>
);

type Props = {
	width: number;
	height: number;
	travel: number; // 0..1, camera position up the strip
	lines?: number;
	zeros?: number;
	frontier?: number; // sigma of the gilt line, or -1
	tilt?: number; // 0 looking straight down, 1 low and looking forward
};

export const Landscape3D: React.FC<Props> = ({width, height, travel, lines = 1, zeros: zp = 1, frontier = -1, tilt = 1}) => {
	const yStart = tToY(L.t[0]) - 8;
	const yEnd = tToY(L.t[NT - 1]) - 22;
	const y = yStart + (yEnd - yStart) * travel;
	const camPos = new THREE.Vector3(sigmaToX(0.5 + 0.16 * tilt), y, 30 - 21 * tilt);
	const look = new THREE.Vector3(sigmaToX(0.5), y + 0.5 + 17.5 * tilt, -2.2);
	return (
		<ThreeCanvas width={width} height={height} camera={{fov: 42, near: 0.1, far: 200, position: camPos.toArray(), up: [0, 0, 1]}}>
			<CameraRig pos={camPos} look={look} />
			<Surface lines={lines} frontier={frontier} camPos={camPos} />
			<Zeros p={zp} />
		</ThreeCanvas>
	);
};

const CameraRig: React.FC<{pos: THREE.Vector3; look: THREE.Vector3}> = ({pos, look}) => {
	const camera = useThree((s) => s.camera);
	camera.up.set(0, 0, 1);
	camera.position.copy(pos);
	camera.lookAt(look);
	camera.updateProjectionMatrix();
	return null;
};
