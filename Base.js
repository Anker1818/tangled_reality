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

// Event Listeners para el teclado (W, A, S, D)
window.addEventListener('keydown', (event) => {
    if (event.key === 'w') moveForward = true;
    if (event.key === 's') moveBackward = true;
    if (event.key === 'a') moveLeft = true;
    if (event.key === 'd') moveRight = true;
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'w') moveForward = false;
    if (event.key === 's') moveBackward = false;
    if (event.key === 'a') moveLeft = false;
    if (event.key === 'd') moveRight = false;
});

// Detectar los controles del gamepad
let gamepad = null;

window.addEventListener('gamepadconnected', (event) => {
    console.log("Control conectado:", event.gamepad);
    gamepad = event.gamepad;
    monitorGamepad();
});

window.addEventListener('gamepaddisconnected', () => {
    console.log("Control desconectado");
    gamepad = null;
});

function monitorGamepad() {
    if (gamepad) {
        // Monitorear el estado de los joysticks (ejes)
        const leftStickX = gamepad.axes[0]; // Movimiento horizontal joystick izquierdo
        const leftStickY = gamepad.axes[1]; // Movimiento vertical joystick izquierdo

        // Usar los joysticks para mover la cámara
        const direction = new THREE.Vector3();

        // Movimiento de la cámara usando el joystick izquierdo
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
}

function animate() {
    // Obtener la dirección de la cámara
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Mover la cámara dependiendo de los valores de los controles
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

    // Monitorear los controles del gamepad en cada fotograma
    if (gamepad) {
        monitorGamepad();
    }

    renderer.render(scene, camera);
}
