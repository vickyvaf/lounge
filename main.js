import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

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
renderer.toneMappingExposure = 1
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

function isMobileDevice() {
	return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
	document.body.appendChild(VRButton.createButton(renderer));
}

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

const clickTargets = [];

function registerClickable(object3D, cameraTarget) {
	clickTargets.push({ object: object3D, target: cameraTarget });
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const gltfLoader = new GLTFLoader();

gltfLoader.load("models/simple_sofa.glb", (gltf) => {
	const sofa = gltf.scene;
	sofa.scale.set(1.5, 1.5, 1.5);
	sofa.position.set(-1.8, 0, 0);
	sofa.rotation.y = 33
	sofa.name = "sofa"

	sofa.traverse((child) => {
		if (child.isMesh) {

			child.material = new THREE.MeshStandardMaterial({
				color: 0x666666,
				roughness: 1,
				metalness: 0,
			});
		}
	});

	scene.add(sofa);
	registerClickable(sofa, new THREE.Vector3(-0.2, 1.5, 0));
});

gltfLoader.load("models/generic_television_set.glb", (gltf) => {
	const tv = gltf.scene
	tv.rotation.y = 11
	tv.scale.set(0.004, 0.004, 0.004);
	tv.position.set(2, 1.45, 0);
	tv.name = "tv"
	scene.add(tv);
	registerClickable(tv, new THREE.Vector3(0.5, 1.5, 0));
});

gltfLoader.load("models/tv_stand.glb", (gltf) => {
	const tvStand = gltf.scene
	tvStand.rotation.y = 22
	tvStand.scale.set(0.25, 0.25, 0.25);
	tvStand.position.set(2, 0, 0);
	tvStand.name = "tvStand"
	scene.add(tvStand);
	registerClickable(tvStand, new THREE.Vector3(0, 1, 0));
});

new RGBELoader()
	.setPath("hdris/")
	.load("small_empty_room_1_1k.hdr", (hdrEquirect) => {
		hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
		scene.environmentIntensity = 0.7
		scene.environment = hdrEquirect;
		scene.background = hdrEquirect;
	});


window.addEventListener("mouseup", (event) => {
	if (isDragging) return;

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	clickTargets.forEach(({ object, target }) => {
		const intersects = raycaster.intersectObject(object, true);
		if (intersects.length > 0) {
			animateCamera(camera.position.clone(), target, object.position);
		}
	});
});

let animStart = null;
let startPos, endPos, lookAtTarget;

function animateCamera(from, to, lookAt) {
	animStart = performance.now();
	startPos = from.clone();
	endPos = to.clone();
	lookAtTarget = lookAt.clone();
}

let isDragging = false;

window.addEventListener("mousedown", () => {
	isDragging = false;
});

window.addEventListener("mousemove", () => {
	isDragging = true;
});

window.addEventListener("mouseup", (event) => {
	if (isDragging) return;

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
});

window.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		camera.position.set(-2.5, 1.8, 0);
		camera.lookAt(0, 0, 0);
		controls.target.set(0, 0, 0);
		controls.update();
		escHint.style.display = "none"
		closeSidebar()
	}
});

let hoveredRoot = null;

renderer.domElement.addEventListener("mousemove", (event) => {
	const rect = renderer.domElement.getBoundingClientRect();
	mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
	mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects.length > 0) {
		const obj = intersects[0].object;

		let root = obj;
		while (root.parent && root.parent.type !== "Scene") {
			root = root.parent;
		}

		if (root.name) {
			if (hoveredRoot !== root) {
				if (hoveredRoot) {
					hoveredRoot.traverse((child) => {
						if (child.isMesh && child.material && child.material.emissive) {
							child.material.emissive.set(0x000000);
						}
					});
				}

				root.traverse((child) => {
					if (child.isMesh && child.material && child.material.emissive) {
						child.material.emissive.set(0x555555);
					}
				});

				hoveredRoot = root;
			}
		} else {
			if (hoveredRoot) {
				hoveredRoot.traverse((child) => {
					if (child.isMesh && child.material && child.material.emissive) {
						child.material.emissive.set(0x000000);
					}
				});
				hoveredRoot = null;
			}
		}

	} else {
		if (hoveredRoot) {
			hoveredRoot.traverse((child) => {
				if (child.isMesh && child.material && child.material.emissive) {
					child.material.emissive.set(0x000000);
				}
			});
			hoveredRoot = null;
			document.body.style.cursor = "default";
		}
	}
});

const bounds = {
	minX: -2.5,
	maxX: 1.5,
	minY: 0.5,
	maxY: 2,
	minZ: -2.5,
	maxZ: 2.5
};

function clampCamera() {
	camera.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, camera.position.x));
	camera.position.y = Math.max(bounds.minY, Math.min(bounds.maxY, camera.position.y));
	camera.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, camera.position.z));
}

if (window.DeviceOrientationEvent) {
	window.addEventListener('deviceorientation', (event) => {
		const alpha = THREE.MathUtils.degToRad(event.alpha || 0);
		const beta = THREE.MathUtils.degToRad(event.beta || 0);
		const gamma = THREE.MathUtils.degToRad(event.gamma || 0);

		camera.rotation.set(beta, alpha, -gamma, 'ZYX');
	}, true);
}

function animate() {
	requestAnimationFrame(animate);

	if (animStart) {
		const t = Math.min((performance.now() - animStart) / 1000, 1);
		camera.position.lerpVectors(startPos, endPos, t);
		controls.target.lerp(lookAtTarget, t);
		if (t >= 1) animStart = null;
	}

	controls.update();
	clampCamera();
	renderer.setAnimationLoop(() => {
		renderer.render(scene, camera);
	});
}
animate();

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const sidebar = document.createElement("div");
sidebar.style.position = "fixed";
sidebar.style.top = "0";
sidebar.style.right = "-350px";
sidebar.style.width = "300px";
sidebar.style.height = "100%";
sidebar.style.background = "#fff";
sidebar.style.boxShadow = "-2px 0 8px rgba(0,0,0,0.2)";
sidebar.style.padding = "16px";
sidebar.style.transition = "right 0.3s ease";
sidebar.style.zIndex = "1000";

const closeBtn = document.createElement("button");
closeBtn.textContent = "×";
closeBtn.style.background = "none";
closeBtn.style.border = "none";
closeBtn.style.fontSize = "24px";
closeBtn.style.cursor = "pointer";
sidebar.appendChild(closeBtn);

const drawerTitle = document.createElement("h3");
drawerTitle.textContent = "Object Info";
sidebar.appendChild(drawerTitle);

const drawerImagePreview = document.createElement("img");
drawerImagePreview.style.width = "100%";
drawerImagePreview.style.height = "auto";
drawerImagePreview.style.marginBottom = "10px";
sidebar.appendChild(drawerImagePreview);

const drawerContent = document.createElement("div");
sidebar.appendChild(drawerContent);

document.body.appendChild(sidebar);

function openSidebar(title, content, image) {
	drawerTitle.textContent = title;
	drawerImagePreview.src = image
	drawerContent.innerHTML = content;
	escHint.style.display = 'block'
	sidebar.style.right = "0";
}

function closeSidebar() {
	escHint.style.display = "none"
	sidebar.style.right = "-350px";
}

closeBtn.addEventListener("click", closeSidebar);

renderer.domElement.addEventListener("mouseup", (event) => {
	if (isDragging) return;

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	clickTargets.forEach(({ object }) => {
		const intersects = raycaster.intersectObject(object, true);
		if (intersects.length > 0) {
			switch (object.name) {
				case "sofa":
					openSidebar(
						"Couch",
						"This elegant couch is perfect for your living room, made with high-quality fabric and comfortable cushions. Ideal for relaxing, reading, or watching TV.",
						"https://img-new.cgtrader.com/items/387761/df14e1c97d/modern-couch-3d-model-df14e1c97d.webp"
					);
					break;
				case "tv":
					openSidebar(
						"Television",
						"Experience stunning visuals and immersive sound with this 55-inch Ultra HD Smart TV. Perfect for movies, gaming, and streaming your favorite content.",
						"/previews/tv.png"
					);
					break;
				case "tvStand":
					openSidebar(
						"TV Table",
						"A sleek and sturdy TV stand to complement your living room setup. Made of premium wood with ample storage space for your media devices.",
						"/previews/tv_stand.png"
					);
					break;
				default:
					closeSidebar();
					break;
			}
		}
	});
});

const escHint = document.createElement("div");
escHint.textContent = "Press Esc to exit preview";
escHint.style.position = "fixed";
escHint.style.bottom = "20px";
escHint.style.left = "50%";
escHint.style.transform = "translateX(-50%)";
escHint.style.background = "rgba(0,0,0,0.6)";
escHint.style.color = "#fff";
escHint.style.padding = "6px 12px";
escHint.style.borderRadius = "4px";
escHint.style.fontFamily = "'Poppins', sans-serif";
escHint.style.fontSize = "14px";
escHint.style.zIndex = "1001";
escHint.style.opacity = "0.7";
escHint.style.display = 'none';

if (!isMobileDevice()) {
	document.body.appendChild(escHint);
}

const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

document.body.style.fontFamily = "'Poppins', sans-serif";

const fullscreenBtn = document.createElement("button");
fullscreenBtn.textContent = "⛶";
fullscreenBtn.style.position = "fixed";
fullscreenBtn.style.top = "20px";
fullscreenBtn.style.left = "20px";
fullscreenBtn.style.zIndex = "1002";
fullscreenBtn.style.background = "rgba(0,0,0,0.6)";
fullscreenBtn.style.color = "#fff";
fullscreenBtn.style.border = "none";
fullscreenBtn.style.padding = "8px 12px";
fullscreenBtn.style.fontSize = "18px";
fullscreenBtn.style.borderRadius = "4px";
fullscreenBtn.style.cursor = "pointer";
fullscreenBtn.style.opacity = "0.8";

fullscreenBtn.addEventListener("mouseenter", () => {
	fullscreenBtn.style.opacity = "1";
});
fullscreenBtn.addEventListener("mouseleave", () => {
	fullscreenBtn.style.opacity = "0.8";
});

fullscreenBtn.addEventListener("click", () => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen().catch((err) => {
			console.warn(`Error attempting to enable fullscreen: ${err.message}`);
		});
	} else {
		document.exitFullscreen();
	}
});

document.body.appendChild(fullscreenBtn);
