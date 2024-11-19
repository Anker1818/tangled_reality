// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { VRButton } from 'three/addons/webxr/VRButton.js';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.shadowMap.enabled = true; 
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.setAnimationLoop( animate );
// document.body.appendChild( renderer.domElement );
// document.body.appendChild(VRButton.createButton(renderer));


// const controls = new OrbitControls( camera, renderer.domElement );

// //luces
// const lighta = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( lighta );

// const light2 = new THREE.PointLight(0xffffff, 10000, 10000);
// light2.position.set(-20, 30, 10);
// scene.add( light2);

// const geometry = new THREE.BoxGeometry( 300, 7, 300 ); 
// const texture = new THREE.TextureLoader().load('Texturas terror/piso.jpg');
// const textureN = new THREE.TextureLoader().load('Texturas terror/pisonormal.png');
// const material = new THREE.MeshPhongMaterial( {map: texture, normalMap: textureN} ); 
// const cube = new THREE.Mesh( geometry, material ); 
// scene.add( cube );
// cube.position.y = -14

// // const geometry2 = new THREE.PlaneGeometry( 60, 50 );
// // const texture2 = new THREE.TextureLoader().load('texturas arbol/ArbolFINALCOPIA.png');
// // const material2 = new THREE.MeshStandardMaterial( {map: texture2, side: THREE.DoubleSide, transparent: true,} );
// // const plane = new THREE.Mesh( geometry2, material2 );
// // scene.add( plane );
// // plane.position.y = 8.5

// const createPlane = (x, y, z, texturePath) => {
//   const geometry = new THREE.PlaneGeometry(60, 50);
//   const texture = new THREE.TextureLoader().load(texturePath);
//   const material = new THREE.MeshStandardMaterial({
//       map: texture,
//       side: THREE.DoubleSide,
//       transparent: true
//   });

//   const plane = new THREE.Mesh(geometry, material);
//   plane.position.set(x, y, z);
//   scene.add(plane);
//   return plane;
// };

// // Posiciones definidas manualmente
// const positions = [
//   { x: 0, y: 8.5, z: 0 },
//   { x: 70, y: 8.5, z: 0 },
//   { x: -70, y: 8.5, z: 0 },
//   { x: 0, y: 8.5, z: 70 },
//   { x: 0, y: 8.5, z: -70 },
//   // Agrega más posiciones si es necesario
// ];

// const textures = [
//   'texturas arbol/ArbolFINALCOPIA.png',
  
// ];

// // Crear los planos con las posiciones y texturas definidas
// for (let i = 0; i < positions.length; i++) {
//   const pos = positions[i];
//   const texturePath = textures[i % textures.length]; // Alterna las texturas
//   createPlane(pos.x, pos.y, pos.z, texturePath);
// }





// // Crear GLTFLoader
// const loader = new GLTFLoader();

// // Cargar el modelo GLB
// loader.load(
//   'cabana.glb', // Ruta al modelo
//   (gltf) => {
//     // El modelo está disponible en gltf.scene
//     const model = gltf.scene;
//     model.position.set(0, 5, -180); // Ajustar posición
//     model.scale.set(5, 7, 5); // Ajustar escala
//     scene.add(model); // Agregar modelo a la escena
//   },
//   (xhr) => {
//     console.log(`Modelo cargado al ${(xhr.loaded / xhr.total) * 100}%`); // Progreso opcional
//   },
//   (error) => {
//     console.error('Error al cargar el modelo:', error);
//   }
// );

// const textureLoader = new THREE.TextureLoader();


// camera.position.z = 300;

// function animate() {

//     controls.update();
//     renderer.render(scene, camera);
// }
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
    this.createPlanes();

    // Configuración de la cámara
    this.camera.position.z = 300;
  }

  addLights() {
    // Luz ambiental suave
    const lighta = new THREE.AmbientLight(0x404040); // luz suave
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
      const geometry = new THREE.BoxGeometry(500, 7, 500);
      const textureN = new THREE.TextureLoader().load('Texturas terror/pisonormal.png');
      const material = new THREE.MeshPhongMaterial({ map: texture, normalMap: textureN });
      const cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
      cube.position.y = -14;
    });
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

    loader.load('arbol_texture.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 145);
      model.scale.set(5, 5, 5);
      this.scene.add(model);
    }, (xhr) => {
      console.log(`Modelo cargado al ${(xhr.loaded / xhr.total) * 100}%`);
    }, (error) => {
      console.error('Error al cargar el modelo:', error);
    });

    loader.load('arbol_texture.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(-70, 0, 60);
      model.scale.set(5, 5, 5);
      this.scene.add(model);
    }, (xhr) => {
      console.log(`Modelo cargado al ${(xhr.loaded / xhr.total) * 100}%`);
    }, (error) => {
      console.error('Error al cargar el modelo:', error);
    });

    loader.load('arbol_texture.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(50, 0, 60);
      model.scale.set(5, 5, 5);
      this.scene.add(model);
    }, (xhr) => {
      console.log(`Modelo cargado al ${(xhr.loaded / xhr.total) * 100}%`);
    }, (error) => {
      console.error('Error al cargar el modelo:', error);
    });

    loader.load('arbol_texture.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(10, 0, 40);
      model.scale.set(5, 5, 5);
      this.scene.add(model);
    }, (xhr) => {
      console.log(`Modelo cargado al ${(xhr.loaded / xhr.total) * 100}%`);
    }, (error) => {
      console.error('Error al cargar el modelo:', error);
    });
  }

  createPlanes() {
    const positions = [
      { x: -200, y: 8.5, z: -150 },
      { x: -230, y: 8.5, z: 0 },
      { x: -150, y: 8.5, z: 130 },
      { x: -40, y: 8.5, z: -220 },
      { x: -95, y: 8.5, z: -80 },
      { x: 60, y: 8.5, z: -200 },
      { x: 130, y: 8.5, z: -230 },
      { x: 230, y: 8.5, z: -60 },
      { x: 110, y: 8.5, z: -30 },
      { x: -190, y: 8.5, z: -190 },
      { x: -210, y: 8.5, z: -230 },
      { x: -120, y: 8.5, z: -30 },
      { x: -80, y: 8.5, z: -10 },
      { x: -135, y: 8.5, z: 80 },
      { x: -135, y: 8.5, z: -55 },
      { x: 135, y: 8.5, z: 55 },
      { x: -90, y: 8.5, z: -180 },
      { x: 110, y: 8.5, z: 75 },
      { x: 90, y: 8.5, z: 140 },
      { x: 125, y: 8.5, z: 30 },
      { x: 200, y: 8.5, z: 220 },
      { x: 230, y: 8.5, z: 90 },
      { x: -130, y: 8.5, z: 90 },
      { x: -100, y: 8.5, z: 10 },
      { x: -125, y: 8.5, z: 60 },
      { x: -195, y: 8.5, z: 220 },
      { x: -135, y: 8.5, z: 50 },
      { x: -185, y: 8.5, z: -100 },
      { x: -60, y: 8.5, z: -50 },
      { x: 105, y: 8.5, z: -80 },
      { x: 25, y: 8.5, z: 30 },
      { x: -75, y: 8.5, z: 30 },
      { x: -50, y: 8.5, z: 60 },
      { x: -230, y: 8.5, z: 50 },
      { x: 160, y: 8.5, z: 150 },
      { x: 60, y: 8.5, z: 120 },
      { x: -60, y: 8.5, z: 120 },
      { x: -60, y: 8.5, z: 100 },
      { x: -10, y: 8.5, z: 230 },
      { x: 30, y: 8.5, z: 120 },
      { x: -20, y: 8.5, z: 180 },
      { x: 165, y: 8.5, z: 190 },
      { x: 80, y: 8.5, z: 225 },
      { x: 190, y: 8.5, z: 120 },
      { x: -120, y: 8.5, z: 190 },
      { x: 100, y: 8.5, z: 200 },
      { x: 180, y: 8.5, z: -100 },
      { x: 190, y: 8.5, z: 10 },


    ];

    const textures = [
      'texturas arbol/ArbolFINALCOPIA.png',
      'Texturas terror/spritearbolpngcopia.png',
      'Texturas terror/arbolterrorokcopia.png'
    ];

    // Crear los planos con las posiciones y texturas definidas
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const texturePath = textures[i % textures.length]; // Alterna las texturas
      this.createPlane(pos.x, pos.y, pos.z, texturePath);
    }
  }

  createPlane(x, y, z, texturePath) {
    const geometry = new THREE.PlaneGeometry(60, 50);
    const texture = new THREE.TextureLoader().load(texturePath);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(x, y, z);
    this.scene.add(plane);
    return plane;
  }

  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Crear la escena VR
const vrScene = new VRScene();
