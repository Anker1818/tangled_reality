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
    //   const enemyGeometry = new THREE.BoxGeometry(2, 2, 2);
    //   const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    //   this.enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    //   this.enemy.position.set(5, 1, -10);
    //   this.scene.add(this.enemy);
      


        // Enemigos
        this.enemies = [];  // Arreglo para almacenar los enemigos

        // Cargar enemigos en la escena
        this.loadEnemies();

       


    }

    loadEnemies() {
        // Crear instancias de enemigos con diferentes posiciones y modelos
        const enemy1 = new Enemy(this.scene, 25, -10, -100, 'Assets/Personaje_2.glb');
        const enemy2 = new Enemy(this.scene, -50, -10, -20, 'Assets/Personaje_2.glb');
        const enemy3 = new Enemy(this.scene, -100, -10, -20, 'Assets/Personaje_2.glb');
        const enemy4 = new Enemy(this.scene, 100, -10, -20, 'Assets/Personaje_2.glb');
        const enemy5 = new Enemy(this.scene, 110, -10, -50, 'Assets/Personaje_2.glb');
        
        // Agregar a la lista de enemigos
        this.enemies.push(enemy1, enemy2, enemy3, enemy4, enemy5);

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

            this.ambiente.cargarModelo({
                ruta: 'arbol_texture.glb',
                posicion: [0, 0, 145],
                escala: [5, 5, 5],
            });

            // Modelo GLTF (arbol)
            this.ambiente.cargarModelo({
                ruta: 'arbol_texture.glb',
                posicion: [-70, 0, 60],
                escala: [5, 5, 5],
            });

            // Modelo GLTF (arbol)
            this.ambiente.cargarModelo({
                ruta: 'arbol_texture.glb',
                posicion: [50, 0, 60],
                escala: [5, 5, 5],
            });

            // Modelo GLTF (arbol)
            this.ambiente.cargarModelo({
                ruta: 'arbol_texture.glb',
                posicion: [10, 0, 40],
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
               this.enemies.forEach(enemy => {
                   enemy.actualizarPosicion(this.personaje);
                   enemy.cambiarColor(this.color);

               });

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
    
                // Establecer posición y escala
                model.position.set(...posicion);
                model.scale.set(...escala);
    
                // Asignar la propiedad userData.isGLTFModel a todos los Mesh
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.userData.isGLTFModel = true;
                    }
                });
    
                // Agregar el modelo a la escena
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
                this.disparoSound= new THREE.Audio(this.listener);
                const audioLoader = new THREE.AudioLoader();
                
                // Cargar el sonido de pasos (cambia la ruta a tu archivo de sonido)
                audioLoader.load('Efectos de Audio/pasos-normales--normal-steps-sound-effect-hd_01.mp3', (buffer) => {
                    this.stepSound.setBuffer(buffer);
                    this.stepSound.setLoop(false); // No lo repetimos
                    this.stepSound.setVolume(0.5); // Ajusta el volumen
                });

                audioLoader.load('Efectos de Audio/efecto-de-sonido-de-un-disparo_01.mp3', (buffer) => {
                    this.disparoSound.setBuffer(buffer);
                    this.disparoSound.setLoop(false); // No lo repetimos
                    this.disparoSound.setVolume(0.5); // Ajusta el volumen
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
            new THREE.SphereGeometry(0.1, 16, 16),
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

        this.raycaster.ray.origin.copy(this.character.position);
        this.raycaster.ray.direction.copy(direction);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        // Revisar si hay colisión cercana
        let isBlocked = false;
        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                const object = intersects[i].object;
    
                // Comprobar si es un modelo GLTF/GLB (por su nombre o tipo)
                if (object.userData.isGLTFModel) {
                    console.log("Este es un modelo GLTF/GLB");
                    if (intersects[i].distance < 0.7) {
                        isBlocked = true; // Bloquea el movimiento si está demasiado cerca
                        break; // No necesitamos seguir buscando
                    }
                }
                
            }
        }
   // Verificar límites del área
   const limites = {
    minX: -150,
    maxX: 150,
    minZ: -150,
    maxZ: 150,
};

const nuevaPosicion = this.character.position.clone(); // Clonar para calcular

// Movimiento hacia adelante
if (this.moveForward && !isBlocked) {
    nuevaPosicion.addScaledVector(direction, this.speed);
    if (
        nuevaPosicion.x >= limites.minX &&
        nuevaPosicion.x <= limites.maxX &&
        nuevaPosicion.z >= limites.minZ &&
        nuevaPosicion.z <= limites.maxZ
    ) {
        this.character.position.copy(nuevaPosicion);
        this.reproducirSonidoPasos();
    }
}

// Movimiento hacia atrás (sin bloqueo)
if (this.moveBackward) {
    nuevaPosicion.addScaledVector(direction, -this.speed);
    if (
        nuevaPosicion.x >= limites.minX &&
        nuevaPosicion.x <= limites.maxX &&
        nuevaPosicion.z >= limites.minZ &&
        nuevaPosicion.z <= limites.maxZ
    ) {
        this.character.position.copy(nuevaPosicion);
        this.reproducirSonidoPasos();
    }
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


    reproducirSonidoDisparo() {
        // Si el sonido no se está reproduciendo ya, lo reproducimos
        if (!this.disparoSound.isPlaying) {
            this.disparoSound.play();
        }
        
    }


    disparar(raycaster, camera) {
        if (this.gamepad && this.gamepad.buttons[7].value > 0.5) { // Gatillo derecho presionado
            console.log("Disparo activado");
    
            this.reproducirSonidoDisparo();
    
            // Configurar el raycaster
            raycaster.ray.origin.copy(this.character.position);
            raycaster.ray.direction.set(0, 0, -1).applyQuaternion(this.character.children[0].quaternion);
    
            // Detectar intersecciones
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            for (let i = 0; i < intersects.length; i++) {
                const intersectedObject = intersects[i].object;
    
                if (intersectedObject.userData.isEnemy) {
                    const enemyInstance = intersectedObject.userData.enemyInstance;
    
                    // Validar antes de llamar a `recibirDisparo`
                    if (enemyInstance && typeof enemyInstance.recibirDisparo === "function") {
                        enemyInstance.recibirDisparo();
                        return; // Salir después de impactar
                    } else {
                        console.error("La instancia del enemigo no está configurada correctamente o falta el método recibirDisparo.");
                    }
                }

                            // Vibrar el control al disparar (si el navegador lo soporta)
            if (navigator.vibrate) {
                navigator.vibrate(150); // Vibrar durante 150 ms
            } else {
                console.log("La API de vibración no está soportada en este navegador");
            }
            }
    
            console.log("No se detectaron impactos en enemigos.");
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
    
        // Establecer la posición del puntero en una distancia fija
        let pointerPosition = this.raycaster.ray.origin.clone().add(direction.multiplyScalar(this.pointerDistance));
    
        if (intersects.length > 0) {
            // Si hay colisión, mover el puntero a la posición de la colisión
            pointerPosition.copy(intersects[0].point);
    
            // Cambiar el color del puntero cuando colisiona con algo
            this.pointer.material.color.set(0x0000ff); // Cambiar el color a azul cuando colisiona
        } else {
            // Si no hay colisión, mantener el puntero a la distancia predeterminada
            this.pointer.material.color.set(0xffffff); // Color blanco cuando no colisiona
        }
    
        // Actualizar la posición del puntero
        this.pointer.position.copy(pointerPosition);
        this.pointer.visible = true; // Asegurarse de que el puntero siempre sea visible
    }
    toggleLinterna() {
        console.log("Linterna cambiada");
        this.linternaEncendida = !this.linternaEncendida;
        this.linterna.visible = this.linternaEncendida;   // Activar o desactivar la linterna
    }
}


class Enemy {
    constructor(scene, x, y, z, modelPath, camera) {
        this.scene = scene;
        this.camera = camera;
        this.position = new THREE.Vector3(x, y, z);
        this.modelPath = modelPath;
        this.enemyMesh = null;
        this.loaderGLTF = new GLTFLoader();

        // Llamar a la función para cargar el modelo
        this.loadModel();

        this.speed = 0.2;
        this.lives = 40; // Agregar vidas
        this.isChasing = false;


                        // Sonido de pasos
                        this.listener = new THREE.AudioListener(); // Necesario para escuchar sonidos en 3D
                        this.minusSound = new THREE.Audio(this.listener);
                        this.deathSound= new THREE.Audio(this.listener);
                        const audioLoader = new THREE.AudioLoader();
                        
                        // Cargar el sonido de pasos (cambia la ruta a tu archivo de sonido)
        



                        // Cargar el sonido de pasos (cambia la ruta a tu archivo de sonido)
                        audioLoader.load('Efectos de Audio/michael-jackson-hee-hee-sound-effect_01.mp3', (buffer) => {
                            this.minusSound.setBuffer(buffer);
                            this.minusSound.setLoop(false); // No lo repetimos
                            this.minusSound.setVolume(0.8); // Ajusta el volumen
                        });

                        audioLoader.load('Efectos de Audio/oof--sound-effect-hd---homemadesoundeffects.mp3', (buffer) => {
                            this.deathSound.setBuffer(buffer);
                            this.deathSound.setLoop(false); // No lo repetimos
                            this.deathSound.setVolume(0.8); // Ajusta el volumen
                        });
        





    }

    // Función para cargar el modelo del enemigo
    loadModel() {
        this.loaderGLTF.load(this.modelPath, (gltf) => {
            this.enemyMesh = gltf.scene;
            this.enemyMesh.position.set(this.position.x, this.position.y, this.position.z);
    
            // Configurar `userData` para todos los hijos del modelo
            this.enemyMesh.traverse((child) => {
                if (child.isMesh) {
                    child.userData.isEnemy = true;
                    child.userData.enemyInstance = this; // Asociar instancia del enemigo
                }
            });
    
            this.scene.add(this.enemyMesh);
        }, undefined, (error) => {
            console.error('Error al cargar el modelo GLTF:', error);
        });
    }

    reproducirSonidoMinus() {
        // Si el sonido no se está reproduciendo ya, lo reproducimos
        if (!this.minusSound.isPlaying) {
            this.minusSound.play();
        }
    }

    reproducirSonidoDeath() {
        // Si el sonido no se está reproduciendo ya, lo reproducimos
        if (!this.deathSound.isPlaying) {
            this.deathSound.play();
        }
    }




        // Método para cambiar el color del enemigo
  // Función para cargar el modelo del enemigo
  loadModel() {
    this.loaderGLTF.load(this.modelPath, (gltf) => {
        this.enemyMesh = gltf.scene;
        this.enemyMesh.position.set(this.position.x, this.position.y, this.position.z);

        // Configurar `userData` para todos los hijos del modelo
        this.enemyMesh.traverse((child) => {
            if (child.isMesh) {
                child.userData.isEnemy = true;
                child.userData.enemyInstance = this; // Asociar instancia del enemigo
            }
        });

        this.scene.add(this.enemyMesh);
    }, undefined, (error) => {
        console.error('Error al cargar el modelo GLTF:', error);
    });
}


    // Método para reducir vidas y manejar su eliminación
    recibirDisparo() {
        if (this.lives > 0) {
            this.lives--;
            this.reproducirSonidoMinus()
            console.log(`Enemigo golpeado, vidas restantes: ${this.lives}`);
            this.cambiarColor(new THREE.Color(0xff0000)); // Cambiar a rojo
            setTimeout(() => this.cambiarColor(new THREE.Color(0xffffff)), 300); // Volver al color original después de 200 ms

            if (this.lives <= 0) {
                
                this.morir();
            }
        }
    }

    // Método para cambiar el color del enemigo
    cambiarColor(color) {
        if (this.enemyMesh) {
            this.enemyMesh.traverse((child) => {
                if (child.isMesh) {
                    // Si el material tiene un mapa de textura, cambia el color base
                    if (child.material.map) {
                        // Solo cambiar el color base si tiene una textura
                        child.material.color.set(color);
                    } else {
                        // Si no tiene textura, cambiar el color directamente
                        child.material.color.set(color);
                    }
                    child.material.needsUpdate = true;
                }
            });
        }
    }
        // Método para eliminar el enemigo
        morir() {
            console.log("Enemigo eliminado");
            this.scene.remove(this.enemyMesh);
            this.reproducirSonidoDeath()
            this.enemyMesh = null; // Liberar referencia
        }
    

    actualizarPosicion(personaje) {
        if (this.enemyMesh && personaje.character) {
            // Calcular distancia al personaje
            const distancia = this.enemyMesh.position.distanceTo(personaje.character.position);

            // Si está suficientemente cerca, empieza a perseguir
            if (distancia < 40) {
                this.isChasing = true;
                this.perseguir(personaje);
            } else {
                this.isChasing = false;
            }

            // Hacer que el enemigo mire hacia el personaje
            this.mirarHacia(personaje);
        }
    }

        // Función para hacer que el enemigo mire hacia el personaje
        mirarHacia(personaje) {
            // Asegurarse de que tanto el enemigo como el personaje están definidos
            if (this.enemyMesh && personaje.character) {
                // El enemigo siempre mira hacia el personaje
                this.enemyMesh.lookAt(personaje.character.position);
            }
        }

        perseguir(personaje) {
            if (!this.enemyMesh || !personaje.character) return; // Validar que ambos existen
        
            // Calcular la dirección hacia el personaje
            const direction = new THREE.Vector3();
            direction.subVectors(personaje.character.position, this.enemyMesh.position);
            direction.normalize();
        
            // Mover al enemigo hacia el personaje
            this.enemyMesh.position.addScaledVector(direction, this.speed);
        }


    // Actualizar lógica del enemigo, por ejemplo, su movimiento

}



const game = new Game();
game.animate();

