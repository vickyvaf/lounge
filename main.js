import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);
camera.position.set(-2.5, 1.8, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minPolarAngle = 0; 
controls.maxPolarAngle = Math.PI / 2; 

const textureLoader = new THREE.TextureLoader();

const baseColor = textureLoader.load(
	"textures/Poliigon_WoodFloorAsh_4186/BaseColor.jpg",
);
const normalMap = textureLoader.load(
	"textures/Poliigon_WoodFloorAsh_4186/Normal.png",
);
const roughnessMap = textureLoader.load(
	"textures/Poliigon_WoodFloorAsh_4186/Roughness.jpg",
);
const aoMap = textureLoader.load(
	"textures/Poliigon_WoodFloorAsh_4186/AmbientOcclusion.jpg",
);
const metalnessMap = textureLoader.load(
	"textures/Poliigon_WoodFloorAsh_4186/Metallic.jpg",
);
const displacementMap = textureLoader.load(
	"textures/Poliigon_WoodFloorAsh_4186/Displacement.tiff",
);

baseColor.colorSpace = THREE.SRGBColorSpace;

const floorGeometry = new THREE.PlaneGeometry(5, 5, 50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
	map: baseColor,
	normalMap: normalMap,
	roughnessMap: roughnessMap,
	metalnessMap: metalnessMap,
	aoMap: aoMap,
	displacementMap: displacementMap,
	metalness: 0.5,
	roughness: 0.5,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const textures = [
	baseColor,
	normalMap,
	roughnessMap,
	metalnessMap,
	aoMap,
	displacementMap,
];

textures.forEach((tex) => {
	if (tex) {
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(4, 4); 
	}
});

const baseColorWall = textureLoader.load(
	"textures/Poliigon_PlasterPainted_7664/BaseColor.jpg",
);
const normalMapWall = textureLoader.load(
	"textures/Poliigon_PlasterPainted_7664/Normal.png",
);
const roughnessMapWall = textureLoader.load(
	"textures/Poliigon_PlasterPainted_7664/Roughness.jpg",
);
const aoMapWall = textureLoader.load(
	"textures/Poliigon_PlasterPainted_7664/AmbientOcclusion.jpg",
);
const metalnessMapWall = textureLoader.load(
	"textures/Poliigon_PlasterPainted_7664/Metallic.jpg",
);
const displacementMapWall = textureLoader.load(
	"textures/Poliigon_PlasterPainted_7664/Displacement.tiff",
);

baseColorWall.colorSpace = THREE.SRGBColorSpace;

const wallMaterial = new THREE.MeshStandardMaterial({
	map: baseColorWall,
	normalMap: normalMapWall,
	roughnessMap: roughnessMapWall,
	metalnessMap: metalnessMapWall,
	aoMap: aoMapWall,
	displacementMap: displacementMapWall,
	metalness: 0,
	roughness: 1,
	side: THREE.DoubleSide,
});

const leftSideWallGeometry = new THREE.PlaneGeometry(5, 3);
const leftsideWall = new THREE.Mesh(leftSideWallGeometry, wallMaterial);
leftsideWall.position.z = -2.5;
leftsideWall.position.y = 1.5;
scene.add(leftsideWall);

const rightSideWallGeometry = new THREE.PlaneGeometry(5, 3);
const rightSideWall = new THREE.Mesh(rightSideWallGeometry, wallMaterial);
rightSideWall.position.z = 2.5;
rightSideWall.position.y = 1.5;
scene.add(rightSideWall);

const backWallGeometry = new THREE.PlaneGeometry(5, 3);
const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
backWall.rotation.y = Math.PI / 2; 
backWall.position.x = -2.5;
backWall.position.y = 1.5;
scene.add(backWall);

const frontWallGeometry = new THREE.PlaneGeometry(5, 3);
const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
frontWall.rotation.y = Math.PI / 2; 
frontWall.position.x = 2.5;
frontWall.position.y = 1.5;
scene.add(frontWall);

const roofGeomerty = new THREE.PlaneGeometry(5, 5);
const roof = new THREE.Mesh(roofGeomerty, wallMaterial);
roof.rotation.x = -Math.PI / 2;
roof.position.y = 3;
scene.add(roof);

const gltfLoader = new GLTFLoader();

gltfLoader.load("models/simple_sofa.glb", (gltf) => {
	const sofa = gltf.scene;
	sofa.scale.set(1.5, 1.5,1.5); 
	sofa.position.set(-1.8, 0, 0);
	sofa.rotation.y = 33
	scene.add(sofa);
});

gltfLoader.load("models/generic_television_set.glb", (gltf) => {	
	const tv= gltf.scene
	tv.rotation.y = 11
	tv.scale.set(0.004, 0.004, 0.004); 
	tv.position.set(2, 1.45, 0); 
	scene.add(tv);
});

gltfLoader.load("models/tv_stand.glb", (gltf) => {	
	const tvStand = gltf.scene
	tvStand.rotation.y = 22
	tvStand.scale.set(0.25, 0.25, 0.25); 
	tvStand.position.set(2,0, 0); 
	scene.add(tvStand);
});

new RGBELoader()
	.setPath("hdris/")
	.load("small_empty_room_1_1k.hdr", (hdrEquirect) => {
		hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
		scene.environmentIntensity = 0.9
		scene.environment = hdrEquirect;
		scene.background = hdrEquirect;
	});

function animate() {	
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
