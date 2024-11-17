import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

class Game {

    constructor()
    {
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        this.document.body.appendChild(this.renderer.domElement);
        this.document.body.appendChild(VRButton.createButton(this.renderer));
    }

    animate()
    {
        updateCharacterMovement();
        shootRay();
        updatePointer();
    }

}


class Ambiente {
    constructor(scene) {
        this.scene = scene; 

}

agregarObjetos({ geometria, textura, materialOptions = {}, posicion = [0, 0, 0], rotacion = [0, 0, 0] }){

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

// Crear la escena principal
const scene = new THREE.Scene();

// Instanciar la clase Ambiente
const ambiente = new Ambiente(scene);

// Crear geometrías
const geometriaCubo = new THREE.BoxGeometry(2, 2, 2);
const geometriaEsfera = new THREE.SphereGeometry(1, 32, 32);

// Agregar un cubo con textura
const cubo = ambiente.agregarObjetos({
  geometria: geometriaCubo,
  textura: 'Assets/Pasto1.jpg', // Ruta de la textura
  posicion: [0, 1, 0],
  rotacion: [0, 0, 0],
});

// Agregar una esfera sin textura
const esfera = ambiente.agregarObjetos({
  geometria: geometriaEsfera,
  materialOptions: { color: 0xff0000 }, // Color rojo
  posicion: [2, 2, 2],
  rotacion: [0, Math.PI / 4, 0],
});
