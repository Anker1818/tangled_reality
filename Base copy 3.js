import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';


scene.background = new THREE.Color(0xccfffb);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));


class Game {

  constructor()
  {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene.background = new THREE.Color(0xccfffb);
    
  }


}

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


let gamepad = null;


let isInVR = false;



const controller = renderer.xr.getController(0);
scene.add(controller);

// Detectar colisiones o acciones
controller.addEventListener('selectstart', (event) => {
   console.log("Controlador activado");
   // Aquí puedes disparar una función para interactuar con el juego
});


function animate() {
    // Solo procesar la entrada del gamepad si no estamos en VR
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
      gamepad = gamepads[0];  // Usamos el primer gamepad conectado

      // Detectamos la entrada del joystick izquierdo para el movimiento hacia adelante y hacia atrás
      const leftStickY = gamepad.axes[1];  // Eje Y del joystick izquierdo

      // Lógica para mover hacia adelante o hacia atrás según el eje Y del joystick izquierdo
      if (leftStickY > 0.1) {
        moveForward = false;
        moveBackward = true;
      } else if (leftStickY < -0.1) {
        moveBackward = false;
        moveForward = true;
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