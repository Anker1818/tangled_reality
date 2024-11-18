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

        const pointLight = new THREE.PointLight(0xffffff, 10000, 10000);
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
                posicion: [0, 5, -180],
                escala: [5, 7, 5],
            });
    
            // Sprites (árboles y otros objetos)
            this.ambiente.cargarSprites('Texturas terror/spritearbolpngcopia.png', [
                [-120, 33, 105],
                [-80, 33, 90],
                [-40, 33, 70],
                [100, 33, -20],
                [50, 33, 120],
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
    }

    agregarObjetos({ geometria, textura, materialOptions = {}, posicion = [0, 0, 0], rotacion = [0, 0, 0] }) {
        let texturaCargada = null;
        if (textura) {
            texturaCargada = new THREE.TextureLoader().load(textura);
        }

        const material = new THREE.MeshBasicMaterial({ ...materialOptions, map: texturaCargada });
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

    cargarSprites(rutaTextura, posiciones) {
        this.textureLoader.load(rutaTextura, (texture) => {
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            
            posiciones.forEach(([x, z]) => {
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(x, 35, z);  // Posición del sprite
                sprite.scale.set(70, 70, 1);     // Tamaño del sprite
    
                // Mantener la rotación en el eje Y constante
                const updateRotation = () => {
                    // Obtener la dirección de la cámara
                    const cameraDirection = new THREE.Vector3();
                    this.camera.getWorldDirection(cameraDirection);
                    
                    // Modificar la dirección del sprite para que no rote en Y
                    sprite.lookAt(new THREE.Vector3(
                        sprite.position.x + cameraDirection.x,
                        sprite.position.y,  // Mantener la posición Y constante
                        sprite.position.z 
                    ));
                };
    
                this.scene.add(sprite);
    
                // Actualizar la rotación del sprite en cada frame
                sprite.updateRotation = updateRotation;
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
    }

    actualizarControles() {
        const gamepads = navigator.getGamepads();
        if (gamepads[0]) {
            this.gamepad = gamepads[0];
            const leftStickY = this.gamepad.axes[1];

            this.moveForward = leftStickY < -0.1;
            this.moveBackward = leftStickY > 0.1;
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
}


const game = new Game();
game.animate();
