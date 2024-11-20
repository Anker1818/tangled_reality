import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

let gamepad;

window.addEventListener("gamepadconnected", (event) => {
});


class Game {
    constructor() {
        // Configuración inicial
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0xcccccc, 45, 600 );
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10); // Posición de la cámara
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;

        // Agregar el canvas al documento
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(VRButton.createButton(this.renderer));

        // Crear luces para la escena

        const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // Luz suave
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

            const posiciones = [
                { x: -200, y: 8.5, z: -160, escalaX: 60, escalaY: 50 },
                { x: -230, y: 8.5, z: 0, escalaX: 60, escalaY: 50 },
                { x: -160, y: 8.5, z: 130, escalaX: 60, escalaY: 50 },
                { x: -40, y: 8.5, z: -220, escalaX: 60, escalaY: 50 },
                { x: -95, y: 8.5, z: -80, escalaX: 60, escalaY: 50 },
                { x: 60, y: 8.5, z: -200, escalaX: 60, escalaY: 50 },
                { x: 130, y: 8.5, z: -230, escalaX: 60, escalaY: 50 },
                { x: 230, y: 8.5, z: -60, escalaX: 60, escalaY: 50 },
                { x: 110, y: 8.5, z: -30, escalaX: 60, escalaY: 50 },
                { x: -190, y: 8.5, z: -190, escalaX: 60, escalaY: 50 },
                { x: -210, y: 8.5, z: -230, escalaX: 60, escalaY: 50 },
                { x: -120, y: 8.5, z: -30, escalaX: 60, escalaY: 50 },
                { x: -80, y: 8.5, z: -10, escalaX: 60, escalaY: 50 },
                { x: -135, y: 8.5, z: 80, escalaX: 60, escalaY: 50 },
                { x: -135, y: 8.5, z: -55, escalaX: 60, escalaY: 50 },
                { x: 135, y: 8.5, z: 55, escalaX: 60, escalaY: 50 },
                { x: -90, y: 8.5, z: -180, escalaX: 60, escalaY: 50 },
                { x: 110, y: 8.5, z: 75, escalaX: 60, escalaY: 50 },
                { x: 90, y: 8.5, z: 140, escalaX: 60, escalaY: 50 },
                { x: 125, y: 8.5, z: 30, escalaX: 60, escalaY: 50 },
                { x: 200, y: 8.5, z: 220, escalaX: 60, escalaY: 50 },
                { x: 230, y: 8.5, z: 90, escalaX: 60, escalaY: 50 },
                { x: -130, y: 8.5, z: 90, escalaX: 60, escalaY: 50 },
                { x: -50, y: 8.5, z: 10, escalaX: 60, escalaY: 50 },
                { x: -125, y: 8.5, z: 60, escalaX: 60, escalaY: 50 },
                { x: -195, y: 8.5, z: 220, escalaX: 60, escalaY: 50 },
                { x: -135, y: 8.5, z: 60, escalaX: 60, escalaY: 50 },
                { x: -185, y: 8.5, z: -50, escalaX: 60, escalaY: 50 },
                { x: -60, y: 8.5, z: -60, escalaX: 60, escalaY: 50 },
                { x: 105, y: 8.5, z: -80, escalaX: 60, escalaY: 50 },
                { x: 25, y: 8.5, z: 30, escalaX: 60, escalaY: 50 },
                { x: -75, y: 8.5, z: 30, escalaX: 60, escalaY: 50 },
                { x: -60, y: 8.5, z: 60, escalaX: 60, escalaY: 50 },
                { x: -230, y: 8.5, z: 60, escalaX: 60, escalaY: 50 },
                { x: 160, y: 8.5, z: 160, escalaX: 60, escalaY: 50 },
                { x: 60, y: 8.5, z: 120, escalaX: 60, escalaY: 50 },
                { x: -60, y: 8.5, z: 120, escalaX: 60, escalaY: 50 },
                { x: -60, y: 8.5, z: 50, escalaX: 60, escalaY: 50 },
                { x: -10, y: 8.5, z: 230, escalaX: 60, escalaY: 50 },
                { x: 30, y: 8.5, z: 120, escalaX: 60, escalaY: 50 },
                { x: -20, y: 8.5, z: 180, escalaX: 60, escalaY: 50 },
                { x: 165, y: 8.5, z: 190, escalaX: 60, escalaY: 50 },
                { x: 80, y: 8.5, z: 225, escalaX: 60, escalaY: 50 },
                { x: 190, y: 8.5, z: 120, escalaX: 60, escalaY: 50 },
                { x: -120, y: 8.5, z: 190, escalaX: 60, escalaY: 50 },
                { x: 50, y: 8.5, z: 200, escalaX: 60, escalaY: 50 },
                { x: 180, y: 8.5, z: -50, escalaX: 60, escalaY: 50 },
                { x: 190, y: 8.5, z: 10, escalaX: 60, escalaY: 50 }
            ];
    
            const texturas = [
                'Texturas terror/spritearbolpngcopia.png',
                'Texturas terror/arbolterrorokcopia.png',
                'Texturas terror/otraTextura.png'
            ];
    
            this.ambiente.cargarPlanosSecuenciales(texturas, posiciones);
    

        }
        animate() {
            this.renderer.setAnimationLoop(() => {
                this.personaje.actualizarControles();
                this.personaje.mover();
                this.personaje.disparar(this.raycaster, this.enemy);
                this.personaje.actualizarPuntero();

                this.renderer.render(this.scene, this.camera);
            });

    }
}


  class Ambiente{ 
    constructor(scene) {
        this.scene = scene;
        this.textureLoader = new THREE.TextureLoader();
        this.loaderGLTF = new GLTFLoader();
        this.planos= [];
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

    cargarPlanosSecuenciales(texturas, posiciones) {
        // Iterar sobre las posiciones y alternar las texturas
        for (let i = 0; i < posiciones.length; i++) {
            const pos = posiciones[i];
            const texturePath = texturas[i % texturas.length]; // Alternar las texturas
            this.createPlane(pos.x, pos.y, pos.z, pos.escalaX || 70, pos.escalaY || 70, texturePath);
        }
    }
    
    createPlane(x, y, z, escalaX, escalaY, texturePath) {
        // Crear la geometría y el material del plano
        const geometry = new THREE.PlaneGeometry(escalaX, escalaY);
        const texture = new THREE.TextureLoader().load(texturePath);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        });
    
        // Crear el mesh del plano
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(x, y, z);
        this.scene.add(plane);
        return plane; // Retornar el plano si es necesario
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

                // Sonido de pasos
                this.listener = new THREE.AudioListener(); // Necesario para escuchar sonidos en 3D
                camera.add(this.listener); // Asociamos el listener a la cámara
                this.stepSound = new THREE.Audio(this.listener);
                const audioLoader = new THREE.AudioLoader();
                
                // Cargar el sonido de pasos (cambia la ruta a tu archivo de sonido)
                audioLoader.load('Efectos de Audio/pasos-normales--normal-steps-sound-effect-hd_01.mp3', (buffer) => {
                    this.stepSound.setBuffer(buffer);
                    this.stepSound.setLoop(false); // No lo repetimos
                    this.stepSound.setVolume(0.5); // Ajusta el volumen
                });

        // Inicializar el personaje con una geometría básica (puedes reemplazarlo con un modelo)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.6, 16);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.8; // Altura del cuerpo
        body.visible = false;
        this.character.add(body);


        // Linterna (luz puntual)
        this.linterna = new THREE.SpotLight(0xFFFFFF, 900, 50, Math.PI / 5, 0.6, 2);
        this.linterna.position.set(0, 1.6, 0);  // Posición inicial de la linterna (mismo nivel que la cámara)
        this.linterna.decay = 2; 
        this.linternaTarget = new THREE.Object3D();
        this.linternaTarget.position.set(0, 1.6, -1); // Un punto adelante de la linterna
        this.character.add(this.linternaTarget);
        this.linterna.target = this.linternaTarget;
        
        this.character.add(this.linterna); 
        this.scene.add(this.linternaTarget); 
        
        this.linternaEncendida = false; 
        this.lastButtonState = false;



        this.pointer = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this.pointer.visible = false; // Inicialmente invisible
        this.scene.add(this.pointer);

        // Raycaster para detectar la dirección
        this.raycaster = new THREE.Raycaster();
        this.pointerDistance = 5;  // Distancia máxima para el puntero
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

        if (this.linternaEncendida) {
            this.actualizarDireccionLinterna();
        }
    }
    actualizarDireccionLinterna() {
        // Obtener la dirección de la cámara
        const direccionCamara = new THREE.Vector3();
        this.character.children[0].getWorldDirection(direccionCamara);
        
        // Obtener la posición mundial de la linterna
        const posicionLinterna = new THREE.Vector3();
        this.linterna.getWorldPosition(posicionLinterna);
        
        // Calcular la posición objetivo delante de la cámara
        const posicionObjetivo = new THREE.Vector3();
        posicionObjetivo.copy(posicionLinterna).add(
            direccionCamara.multiplyScalar(5) // El target estará 5 unidades delante
        );
        
        // Actualizar la posición del target
        this.linternaTarget.position.copy(posicionObjetivo);
    }
    mover() {
        const direction = new THREE.Vector3();
        this.character.children[0].getWorldDirection(direction); // Dirección de la cámara

        if (this.moveForward) {
            this.character.position.addScaledVector(direction, this.speed);
             this.reproducirSonidoPasos();
        }
        if (this.moveBackward) {
            this.character.position.addScaledVector(direction, -this.speed);
            this.reproducirSonidoPasos();
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

    reproducirSonidoPasos() {
        // Si el sonido no se está reproduciendo ya, lo reproducimos
        if (!this.stepSound.isPlaying) {
            this.stepSound.play();
        }
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

    actualizarPuntero() {
        const direction = new THREE.Vector3();
        this.character.children[0].getWorldDirection(direction);
    
        // Configurar el raycaster para que apunte hacia adelante desde el personaje
        this.raycaster.ray.origin.copy(this.character.position);
        this.raycaster.ray.direction.copy(direction);
    
        // Determinar la posición del puntero
        const intersects = this.raycaster.intersectObject(this.scene, true);
        
        if (intersects.length > 0) {
            // Si hay colisión, mover el puntero a la posición de la colisión
            this.pointer.position.copy(intersects[0].point);
            this.pointer.visible = true;
    
            // Aquí puedes agregar alguna lógica adicional si deseas destacar o cambiar el color del puntero cuando hay una colisión
            this.pointer.material.color.set(0x0000ff); // Ejemplo de cambiar el color a rojo cuando colisiona con algo
        } else {
            // Si no hay colisión, colocar el puntero a una distancia predeterminada
            this.pointer.position.copy(this.raycaster.ray.origin).add(direction.multiplyScalar(this.pointerDistance));
            this.pointer.visible = true;
    
            // Puedes agregar algún color o efecto si no hay colisión, por ejemplo, cambiar a un color diferente
            this.pointer.material.color.set(0xffffff); // Ejemplo de color verde cuando no hay colisión
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
