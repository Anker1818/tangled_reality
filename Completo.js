import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

class Game {
    constructor() {
        // Configuración inicial
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10); // Posición de la cámara
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        //this.renderer.xr.enabled = true;

        // Agregar el canvas al documento
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(VRButton.createButton(this.renderer));

        // Crear luces para la escena
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz ambiental
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direccional
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        // Instanciar Ambiente
        this.ambiente = new Ambiente(this.scene);

        // Crear y agregar objetos
        this.initObjects();

        // Iniciar animación
        this.animate();
    }

    initObjects() {
        // Crear geometrías
        const geometriaCubo = new THREE.BoxGeometry(2, 2, 2);
        const geometriaEsfera = new THREE.SphereGeometry(1, 32, 32);

        // Agregar un cubo con textura
        this.ambiente.agregarObjetos({
            geometria: geometriaCubo,
            textura: 'Assets/Pasto1.jpg', // Ruta de la textura
            posicion: [0, 1, 0],
        });

        // Agregar una esfera sin textura
        this.ambiente.agregarObjetos({
            geometria: geometriaEsfera,
            materialOptions: { color: 0xff0000 }, // Color rojo
            posicion: [2, 2, 2],
        });
    }

    animate() {
        // Bucle de animación
        const render = () => {
            this.renderer.setAnimationLoop(() => {
                this.renderer.render(this.scene, this.camera);
            });
        };

        render();
    }
}

class Ambiente {
    constructor(scene) {
        this.scene = scene;
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
}

const game = new Game();
