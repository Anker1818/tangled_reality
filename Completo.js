import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

let gamepad;

window.addEventListener("gamepadconnected", (event) => {
  console.log("Controlador conectado:", gamepad.id);
});


class Game {
    constructor() {
        // Configuración inicial
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10); // Posición de la cámara
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;

        // Agregar el canvas al documento
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(VRButton.createButton(this.renderer));

        // Crear luces para la escena

        const ambientLight = new THREE.AmbientLight(0x404040); // Luz suave
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 70, 10000);
        pointLight.position.set(-20, 30, 10);
        this.scene.add(pointLight);

        // Instanciar Ambiente
        this.ambiente = new Ambiente(this.scene);
        this.initAmbiente();


        this.personaje = new Personaje(this.scene, this.camera);

        // Raycaster
        this.raycaster = new THREE.Raycaster();

        // Enemigo
        const enemyGeometry = new THREE.BoxGeometry(2, 2, 2);
        const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        this.enemy.position.set(5, 1, -10);
        this.scene.add(this.enemy);



    }


        initAmbiente() {
            // Piso
            this.ambiente.agregarObjetos({
                geometria: new THREE.BoxGeometry(300, 7, 300),
                textura: 'Texturas terror/piso.jpg',
                normalMap: 'Texturas terror/pisonormal.png',
                posicion: [0, -14, 0],
            });
    
            // Modelo GLTF (cabaña)
            this.ambiente.cargarModelo({
                ruta: 'cabana.glb',
                posicion: [0, 0, -180],
                escala: [5, 5, 5],
            });
    
            // Sprites (árboles y otros objetos)
            this.ambiente.cargarSprites('Texturas terror/spritearbolpngcopia.png', [
                { x: -120, y: 25, z: 105, escalaX: 50, escalaY: 100 },  // Árbol 1
                { x: -80, y: 40, z: 90, escalaX: 80, escalaY: 80 },     // Árbol 2
                { x: -40, y: 30, z: 70, escalaX: 60, escalaY: 60 },     // Árbol 3
                { x: 100, y: 45, z: -20, escalaX: 90, escalaY: 90 },    // Árbol 4
                { x: 50, y: 35, z: 120, escalaX: 70, escalaY: 70 }      // Árbol 5
            ]);
            
            this.ambiente.cargarSprites('Texturas terror/pastook.png', [
                { x: 120, y: 0, z: 105, escalaX: 60, escalaY: 60 },    // Pasto 1
                { x: 80, y: 0, z: 90, escalaX: 80, escalaY: 80 },      // Pasto 2
                { x: 40, y: 0, z: 70, escalaX: 50, escalaY: 50 },      // Pasto 3
                { x: 110, y: 0, z: -20, escalaX: 100, escalaY: 100 },  // Pasto 4
                { x: 57, y: 0, z: 120, escalaX: 90, escalaY: 90 }      // Pasto 5
            ]);
        }
        animate() {
            this.renderer.setAnimationLoop(() => {
                this.personaje.actualizarControles();
                this.personaje.mover();
                this.personaje.disparar(this.raycaster, this.enemy);

                this.renderer.render(this.scene, this.camera);
            });

    }
}


  class Ambiente{ 
    constructor(scene) {
        this.scene = scene;
        this.textureLoader = new THREE.TextureLoader();
        this.loaderGLTF = new GLTFLoader();
        this.sprites = [];
    }

    agregarObjetos({ geometria, textura, materialOptions = {}, posicion = [0, 0, 0], rotacion = [0, 0, 0] }) {
        let texturaCargada = null;
        if (textura) {
            texturaCargada = new THREE.TextureLoader().load(textura);
        }

        const material = new THREE.MeshStandardMaterial({ ...materialOptions, map: texturaCargada });
        const objeto = new THREE.Mesh(geometria, material);

        objeto.position.set(...posicion);
        objeto.rotation.set(...rotacion);

        this.scene.add(objeto);
        return objeto;
    }

    cargarModelo({ ruta, posicion = [0, 0, 0], escala = [1, 1, 1] }) {
        this.loaderGLTF.load(
            ruta,
            (gltf) => {
                const model = gltf.scene;
                model.position.set(...posicion);
                model.scale.set(...escala);
                this.scene.add(model);
            },
            undefined,
            (error) => console.error('Error al cargar el modelo:', error)
        );
    }

    cargarSprites(rutaTextura, configuraciones) {
        this.textureLoader.load(rutaTextura, (texture) => {
            const spriteMaterial = new THREE.SpriteMaterial({ 
                map: texture,
                sizeAttenuation: true
            });
    
            configuraciones.forEach(({ x, y, z, escalaX = 70, escalaY = 70 }) => {
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(x, y, z);
                sprite.scale.set(escalaX, escalaY, 1);
                this.scene.add(sprite);
                this.sprites.push(sprite);
            });
        });
    }
    
}

class Personaje {
    constructor(scene, camera) {
        this.scene = scene;

        // Crear un contenedor para el personaje
        this.character = new THREE.Object3D();
        scene.add(this.character);

        // Posicionar la cámara dentro del personaje
        this.character.add(camera);
        camera.position.set(0, 1.6, 0); // Ajustar altura

        // Gravedad
        this.gravity = 0.01;
        this.verticalSpeed = 0;

        // Movimiento
        this.speed = 0.5;
        this.moveForward = false;
        this.moveBackward = false;

        // Controlador
        this.gamepad = null;

        // Inicializar el personaje con una geometría básica (puedes reemplazarlo con un modelo)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.6, 16);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.8; // Altura del cuerpo
        body.visible = false;
        this.character.add(body);


        // Linterna (luz puntual)
        this.linterna = new THREE.PointLight(0xFFFFFF, 900, 50);  // Luz blanca, intensidad 1, distancia 100
        this.linterna.position.set(0, 1.6, 0);  // Posición inicial de la linterna (mismo nivel que la cámara)
        this.linterna.decay = 2; 
        this.character.add(this.linterna); 
        this.linternaEncendida = false; 
        this.lastButtonState = false;
    }

    actualizarControles() {
        const gamepads = navigator.getGamepads();
        if (gamepads[0]) {
            this.gamepad = gamepads[0];
            const leftStickY = this.gamepad.axes[1];

            this.moveForward = leftStickY < -0.1;
            this.moveBackward = leftStickY > 0.1;

    // Si el botón de encender/apagar la linterna es presionado (por ejemplo, botón 0)
    if (this.gamepad.buttons[0].value > 0.5 && !this.lastButtonState) {
        this.toggleLinterna();  // Alternar estado de la linterna
        this.lastButtonState = true;  // Actualizar el estado del botón
    }

    // Si el botón ya no está presionado, reseteamos el estado
    if (this.gamepad.buttons[0].value <= 0.5 && this.lastButtonState) {
        this.lastButtonState = false;  // Restablecer el estado del botón
    }
        }
    }

    mover() {
        const direction = new THREE.Vector3();
        this.character.children[0].getWorldDirection(direction); // Dirección de la cámara

        if (this.moveForward) {
            this.character.position.addScaledVector(direction, this.speed);
        }
        if (this.moveBackward) {
            this.character.position.addScaledVector(direction, -this.speed);
        }

        // Gravedad
        if (this.character.position.y > -1) {
            this.verticalSpeed -= this.gravity;
        } else {
            this.verticalSpeed = 0;
            this.character.position.y = -1;
        }

        this.character.position.y += this.verticalSpeed;
    }

    disparar(raycaster, enemy, camera) {
        if (this.gamepad && this.gamepad.buttons[7].value > 0.5) { // Gatillo derecho presionado
            console.log("Disparo activado");

            // Configurar raycaster
            raycaster.ray.origin.copy(this.character.position); // Usar la posición del personaje
            raycaster.ray.direction.set(0, 0, -1).applyQuaternion(this.character.children[0].quaternion); // Dirección de la cámara

            // Si el raycaster colisiona con el enemigo, lo destruye
            const intersects = raycaster.intersectObject(enemy);
            if (intersects.length > 0) {
                this.scene.remove(enemy); // Eliminar enemigo
                console.log("Enemigo destruido");
            }

            // Vibrar el control al disparar (si el navegador lo soporta)
            if (navigator.vibrate) {
                navigator.vibrate(150); // Vibrar durante 150 ms
            } else {
                console.log("La API de vibración no está soportada en este navegador");
            }
        }
    }

    toggleLinterna() {
        console.log("Linterna cambiada");
        this.linternaEncendida = !this.linternaEncendida;
        this.linterna.visible = this.linternaEncendida;   // Activar o desactivar la linterna
    }
}


const game = new Game();
game.animate();
