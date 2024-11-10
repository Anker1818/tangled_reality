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

// Función para detectar controladores VR
let controller = null;
let controllerGrip = null;
let leftController = null;
let rightController = null;

function setupControllers() {
  // Detecta los controladores VR
  const controllers = renderer.xr.getControllers();
  leftController = controllers[0];
  rightController = controllers[1];

  scene.add(leftController);
  scene.add(rightController);
}

function animate() {
  // Detectar entrada de controladores VR para el movimiento
  if (leftController) {
    const controllerPosition = leftController.position;
    // Puedes configurar el controlador izquierdo para que mueva hacia adelante o hacia atrás
    if (controllerPosition.z > 0.1) {  // Lógica para mover hacia adelante
      moveForward = true;
      moveBackward = false;
    } else if (controllerPosition.z < -0.1) {  // Lógica para mover hacia atrás
      moveBackward = true;
      moveForward = false;
    } else {
      moveForward = false;
      moveBackward = false;
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

// Inicializamos controladores y WebXR
renderer.xr.getSession().then(() => {
  setupControllers();
});
