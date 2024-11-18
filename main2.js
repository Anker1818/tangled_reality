import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

class VRScene {
  constructor() {
    // Inicializar la escena
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Configurar el renderizado
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setAnimationLoop(this.animate.bind(this));
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(VRButton.createButton(this.renderer));

    // Agregar luces a la escena
    this.addLights();

    // Cargar los objetos y texturas
    this.loadTextures();
    this.loadGLTFModel();

    // Configuración de la cámara
    this.camera.position.z = 300;
  }

  addLights() {
    // Luz ambiental suave
    const lighta = new THREE.AmbientLight(0x404040);
    this.scene.add(lighta);

    // Luz puntual
    const light2 = new THREE.PointLight(0xffffff, 10000, 10000);
    light2.position.set(-20, 30, 10);
    this.scene.add(light2);
  }

  loadTextures() {
    // Cargar textura para el suelo
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('Texturas terror/piso.jpg', (texture) => {
      const geometry = new THREE.BoxGeometry(300, 7, 300);
      const textureN = new THREE.TextureLoader().load('Texturas terror/pisonormal.png');
      const material = new THREE.MeshPhongMaterial({ map: texture, normalMap: textureN });
      const cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
      cube.position.y = -14;
    });

    // Cargar texturas para los sprites
    this.loadSprites('Texturas terror/spritearbolpngcopia.png', 100, 100, [
      [-120, 33, 105], [-80, 33, 90], [-40, 33, 70], [-40, 33, 30], [-100, 33, 20],
      [100, 33, 20], [50, 33, 120], [30, 33, 30], [-120, 33, -105], [-100, 33, -20],
      [100, 33, -20]
    ]);
    this.loadSprites('Texturas terror/arbolterrorokcopia.png', 100, 100, [
      [-100, 33, -10], [122, 33, 120], [0, 33, 120], [-80, 33, 120], [100, 33, 80],
      [-100, 33, -100], [100, 33, -80]
    ]);
    this.loadSprites('Texturas terror/pastook.png', 30, 30, [
      [20, -5, -30], [10, -5, -5], [14, -5, -25], [21, -5, 2], [-120, -5, -30],
      [-100, -5, -5], [14, -5, -25], [21, -5, 2], [21, -5, 140], [-120, -5, 120]
    ]);
  }

  loadSprites(texturePath, scaleX, scaleY, positions) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(texturePath, (texture) => {
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      positions.forEach(([x, y, z]) => {
        this.createSprite(spriteMaterial, x, y, z, scaleX, scaleY);
      });
    });
  }

  createSprite(material, x, y, z, scaleX, scaleY) {
    const sprite = new THREE.Sprite(material);
    sprite.position.set(x, y, z);
    sprite.scale.set(scaleX, scaleY, 1);
    this.scene.add(sprite);
  }

  loadGLTFModel() {
    const loader = new GLTFLoader();
    loader.load('cabana.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 5, -180);
      model.scale.set(5, 7, 5);
      this.scene.add(model);
    }, (xhr) => {
      console.log(`Modelo cargado al ${(xhr.loaded / xhr.total) * 100}%`);
    }, (error) => {
      console.error('Error al cargar el modelo:', error);
    });
  }

  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Crear la escena VR
const vrScene = new VRScene();
