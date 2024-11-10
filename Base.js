import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.background = new THREE.Color(0xccfffb);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
renderer.xr.enabled = true;
document.body.appendChild( VRButton.createButton( renderer ) );

//Texturas
const texturePasto = new THREE.TextureLoader().load('Assets/Pasto1.jpg'); 
const textureArbol = new THREE.TextureLoader().load('Assets/Arbol1.jpg'); 


// Materiales
const materialPasto1 = new THREE.MeshBasicMaterial( { map:texturePasto } );
const materialArbol1 = new THREE.MeshBasicMaterial( { map:textureArbol } );



const geometry = new THREE.BoxGeometry( 30, 1, 30 );
const cube = new THREE.Mesh( geometry, materialPasto1 );
cube.position.set(0, -1, 0);
scene.add( cube );


const geometry1 = new THREE.BoxGeometry( 2, 10, 2 );
const arbol = new THREE.Mesh( geometry1, materialArbol1 );
arbol.position.set(5, 5, 5);
scene.add( arbol );


camera.position.z = 5;

function animate() {



	renderer.render( scene, camera );

}