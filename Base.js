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

// Detectar los controles
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
        const rightStickX = gamepad.axes[2]; // Movimiento horizontal joystick derecho
        const rightStickY = gamepad.axes[3]; // Movimiento vertical joystick derecho

        // Usar los joysticks para mover la cámara
        const direction = new THREE.Vector3();

        // Movimiento de la cámara usando el joystick izquierdo
        if (leftStickY > 0.001) {
            camera.position.z -= moveSpeed; // Hacia adelante
        }
        if (leftStickY < -0.001) {
            camera.position.z += moveSpeed; // Hacia atrás
        }

        if (leftStickX > 0.001) {
            camera.position.x -= moveSpeed; // Hacia la derecha
        }
        if (leftStickX < -0.001) {
            camera.position.x += moveSpeed; // Hacia la izquierda
        }

        // Llamar nuevamente para seguir monitorizando el gamepad
        requestAnimationFrame(monitorGamepad);
    }
}

function animate() {
    if (gamepad) {
        // Actualizar estado de los controles en cada fotograma
        monitorGamepad();
    }

    renderer.render(scene, camera);
}
