import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.gamepad = null;

    this.environment = new Environment(this.scene);
    this.character = new Character(this.scene, this.camera);

    this.enemies = [];

    this.createEnemies();
    this.initRenderer();
    this.addVRSupport();
    this.addEventListeners();
  }

  createEnemies() {
    // Crear 3 enemigos en posiciones aleatorias o fijas
    this.enemies.push(new Enemy(this.scene, new THREE.Vector3(5, 0, 10)));
    this.enemies.push(new Enemy(this.scene, new THREE.Vector3(-5, 0, 15)));
    this.enemies.push(new Enemy(this.scene, new THREE.Vector3(10, 0, -10)));
  }

  initRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }

  addVRSupport() {
    document.body.appendChild(VRButton.createButton(this.renderer));
  }

  addEventListeners() {
    window.addEventListener("gamepadconnected", (event) => {
      this.gamepad = navigator.getGamepads()[event.gamepad.index];
      console.log("Controlador conectado:", this.gamepad.id);
    });
  }

  update() {
    // Actualiza la información del gamepad en cada fotograma
    if (this.gamepad) {
      // Actualiza el gamepad para reflejar los cambios
      this.gamepad = navigator.getGamepads()[this.gamepad.index];

      // Pasamos el gamepad actualizado a la clase Character para que se mueva correctamente
      this.character.updateMovement(this.gamepad);
      this.character.checkForEnemies(this.enemies, this.gamepad);
    }
  }

  animate() {
    this.renderer.setAnimationLoop(() => {
      this.update();
      this.renderer.render(this.scene, this.camera);
    });
  }
}

class Character {
  constructor(scene, camera) {
    this.character = new THREE.Object3D();
    this.speed = 0.1;
    this.gravity = 0.01;
    this.verticalSpeed = 0;
    this.moveForward = false;
    this.moveBackward = false;

    scene.add(this.character);
    this.character.add(camera);
    camera.position.set(0, 1.6, 0);

    // Inicializa el raycaster para la detección de enemigos
    this.raycaster = new THREE.Raycaster();
  }

  updateMovement(gamepad) {
    const leftStickY = gamepad.axes[1]; // Eje Y del stick izquierdo

    if (leftStickY > 0.1) {
      this.moveForward = false;
      this.moveBackward = true;
    } else if (leftStickY < -0.1) {
      this.moveBackward = false;
      this.moveForward = true;
    } else {
      this.moveForward = false;
      this.moveBackward = false;
    }

    const direction = new THREE.Vector3();
    this.character.getWorldDirection(direction);

    if (this.moveForward) {
      this.character.position.addScaledVector(direction, this.speed);
    }
    if (this.moveBackward) {
      this.character.position.addScaledVector(direction, -this.speed);
    }

    if (this.character.position.y > -1) {
      this.verticalSpeed -= this.gravity;
    } else {
      this.verticalSpeed = 0;
      this.character.position.y = -1;
    }

    this.character.position.y += this.verticalSpeed;
  }

  checkForEnemies(enemies, gamepad) {
    // Detectar el gatillo derecho para disparar
    const rightTrigger = gamepad.buttons[5].value; // PS4 right trigger value

    if (rightTrigger > 0.5) {
      // Lanzar un rayo desde la cámara
      this.raycaster.ray.origin.copy(this.camera.position);
      this.raycaster.ray.direction.set(0, 0, -1).applyQuaternion(this.camera.quaternion);

      // Comprobar si el rayo colisiona con algún enemigo
      const intersects = this.raycaster.intersectObjects(enemies.map(enemy => enemy.mesh));

      if (intersects.length > 0) {
        // El primer enemigo que interseca el rayo es "eliminado"
        intersects[0].object.destroy();
      }
    }
  }
}

class Enemy {
  constructor(scene, position) {
    this.scene = scene;
    this.position = position;
    this.geometry = new THREE.BoxGeometry(2, 2, 2);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position.x, position.y, position.z);
    this.scene.add(this.mesh);
  }

  destroy() {
    // Elimina el enemigo de la escena
    this.scene.remove(this.mesh);
    console.log("Enemigo destruido");
  }
}

// Inicializar y ejecutar el juego
const game = new Game();
game.animate();
