import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Setup

let clock = new THREE.Clock();

const Loader = new GLTFLoader();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// Lights

const light = new THREE.PointLight(0xffffff, 5, 50, 1, 0.3);
light.position.set(-20,0, 5)
scene.add( light );
// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(10, 10, 5);
// 
// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const texturaEstrela = new THREE.TextureLoader().load('gas.png');
  const normalMapEstrela = new THREE.TextureLoader().load('normalmap_gaas.png');
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ map: texturaEstrela, normalMap: normalMapEstrela });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(400).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('espaço2.jpg');
scene.background = spaceTexture;

// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');


const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

// scene.add(moon);

// Lua quebrada
Loader.load( './models/estacao/space_station_4k.glb', function ( gltf ) {
  gltf.scene.position.z = 30;
  // gltf.scene.setX(-10)
  // gltf.scene.rotation.x = -20;
  gltf.scene.position.y = -2;
  gltf.scene.position.x = -5;
	scene.add( gltf.scene );
  
}, undefined, function ( error ) {

	console.error( error );

} );

let mixer
// Astronauta
Loader.load( './models/Astronauta/astronaut.glb', function ( gltf ) {
  gltf.scene.position.z = -4;
  // gltf.scene.setX(-10)
  gltf.scene.position.x = 2;
  gltf.scene.position.y = -2;
  mixer = new THREE.AnimationMixer(gltf.scene)
  let action = mixer.clipAction(gltf.animations[0])
  
  action.play();

	scene.add( gltf.scene );
  
}, undefined, function ( error ) {

	console.error( error );

});


Loader.load( './models/earth/earth.glb', function ( gltf ) {
  gltf.scene.position.z = 50;
  gltf.scene.position.x = 50;
  gltf.scene.position.y = 150

  // gltf.scene.setX(-10)
  
  

	scene.add( gltf.scene );
  
}, undefined, function ( error ) {

	console.error( error );

});

// brokemoon.position.z = 35;
// brokemoon.position.setX(-10);

moon.position.z = 30;
moon.position.setX(-10);

// jeff.position.z = -5;
// jeff.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;
  // jeff.rotation.y += 0.01;
  // jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);
  
  let delta = clock.getDelta();
	
  if ( mixer ) mixer.update( delta );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
