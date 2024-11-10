import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

scene.background = new THREE.Color(0xccfffb);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

// Texturas
const texturePasto = new THREE.TextureLoader().load('Assets/Pasto1.jpg');
const textureArbol = new THREE.TextureLoader().load('Assets/Arbol1.jpg');

// Materiales
const materialPasto1 = new THREE.MeshBasicMaterial({ map: texturePasto });
const materialArbol1 = new THREE.MeshBasicMaterial({ map: textureArbol });

const geometry = new THREE.BoxGeometry(30, 1, 30);
const cube = new THREE.Mesh(geometry, materialPasto1);
cube.position.set(0, -1, 0);
scene.add(cube);

const geometry1 = new THREE.BoxGeometry(2, 10, 2);
const arbol = new THREE.Mesh(geometry1, materialArbol1);
arbol.position.set(5, 4, 5);
scene.add(arbol);

camera.position.z = 5;

// Velocidad de movimiento
const moveSpeed = 0.1;

// Variables de control de movimiento
let moveForward = false;
let moveBackward = false;

// Detectar el controlador VR y el Gamepad PS4
let controller = null;
let gamepad = null;

// Detectar el controlador VR y el Gamepad PS4
let vrController = null;
let ps4Controller = null;

function setupControllers() {
  // Detecta los controladores VR (WebXR)
  const vrControllers = renderer.xr.getControllers();
  vrController = vrControllers[0];
  scene.add(vrController);

  // Detecta el gamepad PS4
  window.addEventListener("gamepadconnected", (event) => {
    const gamepads = navigator.getGamepads();
    if (gamepads[event.gamepad.index].id.includes("PS4")) {
      ps4Controller = gamepads[event.gamepad.index];
      console.log("PS4 Gamepad conectado");
    }
  });
}


function animate() {
	// Si estamos en una sesión VR y tenemos un controlador VR o PS4
	if (renderer.xr.isPresenting) {
	  // Obtener el estado del controlador VR
	  const inputSource = vrController.inputSource;
  
	  if (inputSource) {
		const gamepadInput = inputSource.gamepad; // Obtenemos el gamepad del controlador VR
  
		// Detectamos el eje del joystick izquierdo del controlador VR
		const leftStickY = gamepadInput.axes[1];
  
		if (leftStickY < -0.1) {
		  moveForward = true;
		  moveBackward = false;
		} else if (leftStickY > 0.1) {
		  moveBackward = true;
		  moveForward = false;
		} else {
		  moveForward = false;
		  moveBackward = false;
		}
	  }
  
	  // Si también tenemos el PS4 conectado
	  if (ps4Controller) {
		const ps4LeftStickY = ps4Controller.axes[1]; // Eje Y del joystick izquierdo del PS4
  
		if (ps4LeftStickY < -0.1) {
		  moveForward = true;
		  moveBackward = false;
		} else if (ps4LeftStickY > 0.1) {
		  moveBackward = true;
		  moveForward = false;
		} else {
		  moveForward = false;
		  moveBackward = false;
		}
	  }
	} else {
	  // Modo no VR usando solo el PS4
	  const gamepads = navigator.getGamepads();
	  if (gamepads[0]) {
		ps4Controller = gamepads[0]; // Usamos el primer gamepad conectado
  
		// Detectamos la entrada del joystick izquierdo (eje Y) para el movimiento hacia adelante y hacia atrás
		const leftStickY = ps4Controller.axes[1];  // Eje Y del joystick izquierdo
  
		// Lógica para mover hacia adelante o atrás según el eje Y del joystick izquierdo
		if (leftStickY < -0.1) {
		  moveForward = true;
		  moveBackward = false;
		} else if (leftStickY > 0.1) {
		  moveBackward = true;
		  moveForward = false;
		} else {
		  moveForward = false;
		  moveBackward = false;
		}
	  }
	}
  
	// Obtener la dirección en la que la cámara está mirando
	const direction = new THREE.Vector3();
	camera.getWorldDirection(direction);
  
	// Hacer que el movimiento dependa de la dirección de la cámara
	if (moveForward) {
	  camera.position.addScaledVector(direction, moveSpeed);  // Avanzar
	}
	if (moveBackward) {
	  camera.position.addScaledVector(direction, -moveSpeed); // Retroceder
	}
  
	renderer.render(scene, camera);
  }
  