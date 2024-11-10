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
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let controller = null;
let gamepad = null;

function setupControllers() {
  const controllers = renderer.xr.getControllers();
  controller = controllers[0];
  scene.add(controller);
}

function animate() {
  if (gamepad) {
    const gamepadData = navigator.getGamepads()[0];

    // Obtener los valores de los ejes del control
    const leftStickX = gamepadData.axes[0];  // Eje X del joystick izquierdo
    const leftStickY = gamepadData.axes[1];  // Eje Y del joystick izquierdo

    // Decidir el movimiento
    if (leftStickY > 0.1) {
      moveForward = true;
      moveBackward = false;
    } else if (leftStickY < -0.1) {
      moveBackward = true;
      moveForward = false;
    } else {
      moveForward = false;
      moveBackward = false;
    }

    if (leftStickX > 0.1) {
      moveRight = true;
      moveLeft = false;
    } else if (leftStickX < -0.1) {
      moveLeft = true;
      moveRight = false;
    } else {
      moveLeft = false;
      moveRight = false;
    }
  }

  // Mover la cámara
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  if (moveForward) {
    camera.position.addScaledVector(direction, moveSpeed);
  }
  if (moveBackward) {
    camera.position.addScaledVector(direction, -moveSpeed);
  }
  if (moveLeft) {
    camera.position.x -= moveSpeed;
  }
  if (moveRight) {
    camera.position.x += moveSpeed;
  }

  // Actualizar el controlador
  if (controller) {
    const controllerData = controller.getWorldPosition();
    // Puedes agregar la lógica para usar el controlador para mover o interactuar
  }

  renderer.render(scene, camera);
}

// Configurar el controlador y WebXR
renderer.xr.getSession().then((session) => {
  setupControllers();
});

