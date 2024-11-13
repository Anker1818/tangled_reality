// Inicializa la variable para el controlador
let gamepad;

window.addEventListener("gamepadconnected", (event) => {
  console.log("Controlador conectado:", gamepad.id);
});


import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

// Creamos el personaje
const character = new THREE.Object3D();
scene.add(character);



// Posicionamos la cámara en el personaje
character.add(camera);  // La cámara sigue al personaje
camera.position.set(0, 1.6, 0);  // Ajusta la altura de la cámara


// Texturas
const texturePasto = new THREE.TextureLoader().load('Assets/Pasto1.jpg');
const textureArbol = new THREE.TextureLoader().load('Assets/Arbol1.jpg');

// Materiales
const materialPasto1 = new THREE.MeshBasicMaterial({ map: texturePasto });
const materialArbol1 = new THREE.MeshBasicMaterial({ map: textureArbol });

const geometry = new THREE.BoxGeometry(50, 1, 50);
const cube = new THREE.Mesh(geometry, materialPasto1);
cube.position.set(0, -1, 0);
scene.add(cube);

const geometry1 = new THREE.BoxGeometry(2, 10, 2);
const arbol = new THREE.Mesh(geometry1, materialArbol1);
arbol.position.set(5, 4, 5);
scene.add(arbol);

let moveForward = false;  
let moveBackward = false;
let gamepad1 = null;
const speed = 0.1;



// Gravedad

const gravity = 0.01;  // Aceleración de la gravedad
let verticalSpeed = 0; // Velocidad vertical del personaje



function updateCharacterMovement() {
  gamepad = navigator.getGamepads();


  if (gamepad[0]) {
    gamepad1 = gamepad[0]; // Asigna gamepad1 correctamente
    const leftStickY = gamepad1.axes[1]; // Accede a los ejes desde gamepad1

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

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // Hacer que el movimiento dependa de la dirección de la cámara
  if (moveForward) {
    character.position.addScaledVector(direction, speed);  // Avanzar
  }
  if (moveBackward) {
    character.position.addScaledVector(direction, -speed); // Retroceder
  }

  if (character.position.y > -1) { // Verificar si el personaje está por encima del suelo
    verticalSpeed -= gravity; // Aplicar gravedad
  } else {
    verticalSpeed = 0; // Detener la caída si está en el suelo
    character.position.y = -1; // Asegurar que el personaje esté justo en el suelo
  }

  // Actualizar la posición del personaje con la velocidad vertical
  character.position.y += verticalSpeed;
}

function animate() {
  renderer.setAnimationLoop(() => {
      updateCharacterMovement();
      renderer.render(scene, camera);
  });
}
animate();