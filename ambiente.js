import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

const light2 = new THREE.PointLight(0xffffff, 10000, 10000);
light2.position.set(0, 30, 10);
scene.add( light2);

const geometry = new THREE.BoxGeometry( 300, 0.3, 300 ); 
const material = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );
cube.position.y = -10

const textureLoader = new THREE.TextureLoader();

// Cargar la textura del sprite
textureLoader.load('Texturas terror/pngwing.com (1).png', (texture) => {
  // Crear el material del sprite
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });

  // Crear el sprite usando el material
  const sprite = new THREE.Sprite(spriteMaterial);

  // Ajustar la posición o escala del sprite
  sprite.position.set(-30, 30, -70); // X, Y, Z
  sprite.scale.set(150, 150, 1); // Ancho, Alto, Profundidad (profundidad generalmente no importa en sprites)

  // Añadir el sprite a la escena
  scene.add(sprite);
});

// Crear un cargador de texturas
//const textureLoader = new THREE.TextureLoader();

// Cargar la textura del sprite
textureLoader.load('Texturas terror/spritearbolpng.png', (texture) => {
  // Crear el material del sprite (puede ser reutilizado)
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });

  // Crear una función para generar sprites en posiciones aleatorias
  function crearSprite(x, y, z) {
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    sprite.scale.set(100, 100, 1); // Cambiar el tamaño si es necesario
    scene.add(sprite);
  }

  // Generar varios sprites en diferentes posiciones
  crearSprite(-120, 33, 105);
  crearSprite(-80, 33, 90);
  crearSprite(-40, 33, 70);
  crearSprite(-40, 33, 30);
  crearSprite(-100, 33, 20);
  crearSprite(100, 33, 20);
  crearSprite(50, 33, 120);
  crearSprite(30, 33, 30);

  crearSprite(-120, 33, -105);
  crearSprite(-80, 33, -90);
  crearSprite(-40, 33, -70);
  crearSprite(-40, 33, -30);
  crearSprite(-100, 33, -20);
  crearSprite(100, 33, -20);
  crearSprite(50, 33, -120);
  crearSprite(30, 33, -30);
});

textureLoader.load('Texturas terror/arbolterrorok.png', (texture) => {
    // Crear el material del sprite (puede ser reutilizado)
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  
    // Crear una función para generar sprites en posiciones aleatorias
    function crearSprite(x, y, z) {
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x, y, z);
      sprite.scale.set(100, 100, 1); // Cambiar el tamaño si es necesario
      scene.add(sprite);
    }
  
    // Generar varios sprites en diferentes posiciones
    crearSprite(-100, 33, -10);
    crearSprite( 28, 33, -5);
    crearSprite(122, 33, 120);
    crearSprite(-15, 33, -2);
    crearSprite(0, 33, 120);
    crearSprite(-80, 33, 120);
    crearSprite(100, 33, 80);
    crearSprite(-100, 33, -100);
    crearSprite( 28, 33, -50);
    crearSprite(122, 33, -120);
    crearSprite(-15, 33, -20);
    crearSprite(0, 33, -120);
    crearSprite(-80, 33, -120);
    crearSprite(100, 33, -80);
  });

  textureLoader.load('Texturas terror/pasto.png', (texture) => {
    // Crear el material del sprite (puede ser reutilizado)
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  
    // Crear una función para generar sprites en posiciones aleatorias
    function crearSprite(x, y, z) {
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x, y, z);
      sprite.scale.set(30, 30, 1); // Cambiar el tamaño si es necesario
      scene.add(sprite);
    }
  
    // Generar varios sprites en diferentes posiciones
    crearSprite(20, 0, -30);
    crearSprite(10, 0, -5);
    crearSprite(14, 0, -25);
    crearSprite(21, 0, 2);
    crearSprite(-120, 0, -30);
    crearSprite(-100, 0, -5);
    crearSprite(14, 0, -25);
    crearSprite(21, 0, 2);
    crearSprite(21, 0, 140);
    crearSprite(-120, 0, 120);
    crearSprite(-100, 0, 100);
    crearSprite(14, 0, 120);
    crearSprite(21, 0, 100);
    crearSprite(-121, 0, 140);
    crearSprite(0, 0, 120);
    crearSprite(-80, 0, 120);
    crearSprite(-50, 0, -50);
    crearSprite(-45, 0, 90);
    crearSprite(-80, 0, 90);
    crearSprite(80, 0, 120);
    crearSprite(120, 0, 120);
    crearSprite(120, 0, 60);
    crearSprite(100, 0, 60);
    crearSprite(50, 0, 60);
    crearSprite(50, 0, 20);
    crearSprite(10, 0, 20);
    crearSprite(-120, 0, 20);
    crearSprite(-120, 0, 80);
    crearSprite(-100, 0, 50);
    crearSprite(20, 0, -30);
    crearSprite(10, 0, -5);
    crearSprite(14, 0, -25);
    crearSprite(21, 0, -2);
    crearSprite(-120, 0, -30);
    crearSprite(-100, 0, -5);
    crearSprite(14, 0, -25);
    crearSprite(21, 0, -2);
    crearSprite(21, 0, -140);
    crearSprite(-120, 0, -120);
    crearSprite(-100, 0, -100);
    crearSprite(14, 0, -120);
    crearSprite(21, 0, -100);
    crearSprite(-121, 0, -140);
    crearSprite(0, 0, -120);
    crearSprite(-80, 0, -120);
    crearSprite(-50, 0, -50);
    crearSprite(-45, 0, -90);
    crearSprite(-80, 0, -90);
    crearSprite(80, 0, -120);
    crearSprite(120, 0, -120);
    crearSprite(120, 0, -60);
    crearSprite(100, 0, -60);
    crearSprite(50, 0, -60);
    crearSprite(50, 0, -20);
    crearSprite(10, 0, -20);
    crearSprite(-120, 0, -20);
    crearSprite(-120, 0, -80);
    crearSprite(-100, 0, -50);
  });

camera.position.z = 100;

















function animate() {
    //renderer.setAnimationLoop(() => {
        //updateCharacterMovement();
        renderer.render(scene, camera);
    //});
  }
  animate(); 