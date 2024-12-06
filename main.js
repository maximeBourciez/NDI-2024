import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/FBXLoader.js";

// Scène, caméra, rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Lumière ambiante
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10); // Position de la lumière
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Chargement d'un fond panoramique
const textureLoader = new THREE.TextureLoader();
const skyboxTexture = textureLoader.load("images/shutterstock_2285640349.jpg");
const skybox = createSkybox(skyboxTexture);
scene.add(skybox);

// Contrôles de caméra
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 10); // Position initiale de la caméra
controls.update();

// Raycaster pour détecter les clics
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const modelLoader = new FBXLoader();
let model;

modelLoader.load("models3D/character.fbx", (object) => {
  model = object;

  // Appliquer un matériau avec une couleur beige
  const beigeColor = new THREE.Color(0xf5f5dc); // Code couleur hexadécimal pour beige

  model.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: beigeColor,
        roughness: 0.5,
        metalness: 0.2,
      });
      child.material.needsUpdate = true;
    }
  });

  // Centrer et ajuster le modèle
  model.position.set(0, 0, 0); // Ajustez en fonction de votre modèle
  model.scale.set(0.1, 0.1, 0.1);
  scene.add(model);

  // Assurer que tous les maillages sont visibles des deux côtés
  model.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.DoubleSide;
    }
  });

  // Log bounding box pour comprendre la taille/position du modèle
  const box = new THREE.Box3().setFromObject(model);
  console.log("Model Bounding Box:", box);

  // Ajuster la position et le zoom de la caméra en fonction du modèle
  adjustCameraToFitModel(camera, controls, box);
});

// Gérer le clic de la souris
window.addEventListener("click", (event) => {
  // Calculer la position de la souris
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Intersection avec le modèle
  const intersects = raycaster.intersectObject(model, true);
  if (intersects.length > 0) {
    const object = intersects[0].object;
    console.log("Objet cliqué: ", object.name);

    // Liste des objets qui doivent entraîner une redirection
    const objectsToRedirect = [
      "head",
      "torsoUp",
      "torsoDown",
      "llegs",
      "rlegs",
      "larms",
      "rarms",
    ];

    // Vérifier si l'objet cliqué doit entraîner une redirection
    if (objectsToRedirect.includes(object.name)) {
      zoomTransition(object);
    }
  }
});

// Objectes de correspondance entre le nom de l'objet et les URLs
const redirectLinks = {
  head: "http://localhost/NDI/NDI-2024/index?controleur=corps&methode=cerveau",
  torsoUp: "https://www.example.com/torsoUp",
  torsoDown: "https://www.example.com/torsoDown",
  llegs: "https://www.example.com/llegs",
  rlegs: "https://www.example.com/rlegs",
  larms: "https://www.example.com/larms",
  rarms: "https://www.example.com/rarms",
};

function zoomTransition(object) {
  const zoomDuration = 3000; // Durée de l'animation pour un effet plus dynamique
  const initialPosition = camera.position.clone();

  // Position de l'objet dans le monde
  const targetPosition = object.getWorldPosition(new THREE.Vector3());

  // Calculer un léger recul sur l'axe Z pour mieux voir l'objet
  targetPosition.z += 2; // Ajuste cette valeur pour un bon zoom

  const startTime = Date.now();

  // Créer une animation avec des rotations rapides, zooms et dézooms
  function animateZoom() {
    const elapsedTime = Date.now() - startTime;
    const t = elapsedTime / zoomDuration;

    if (elapsedTime < zoomDuration) {
      // Calculer un effet de rebond exagéré sur l'axe Z
      const bounceFactor = Math.sin(t * Math.PI * 10); // Rebond très accentué
      const adjustedPosition = targetPosition.clone();
      adjustedPosition.z += Math.sin(t * Math.PI * 5) * 10; // Oscillation sur Z

      // Effectuer l'interpolation entre la position initiale et la position cible
      camera.position.lerpVectors(
        initialPosition,
        adjustedPosition,
        bounceFactor
      );

      // Rotation ultra-rapide autour de l'objet
      const rotationSpeed = t * Math.PI; // Rotation ultra-rapide
      camera.position.x = targetPosition.x + Math.cos(rotationSpeed);
      camera.position.y = targetPosition.y + Math.sin(rotationSpeed);

      // Rotation folle sur l'axe Z
      camera.rotation.z += Math.sin(t * Math.PI) * 0.5; // Rotation rapide sur Z

      // Zoom et dézoom extrêmes avec oscillation
      const zoomFactor = Math.sin(t * Math.PI) * 5; // Zoom et dézoom fous
      camera.position.z += zoomFactor; // Appliquer l'effet de zoom/dézoom

      // Toujours regarder l'objet
      camera.lookAt(targetPosition);

      // Effectuer des rotations rapides sur tous les axes de la caméra
      camera.rotation.x += Math.sin(t * Math.PI) * 0.2; // Rotation folle sur X
      camera.rotation.y += Math.cos(t * Math.PI) * 0.2; // Rotation folle sur Y
      camera.rotation.z += Math.sin(t * Math.PI) * 0.2; // Rotation folle sur Z

      controls.update();
      requestAnimationFrame(animateZoom);
    } else {
      // Si l'animation est terminée, positionner la caméra exactement à la position de l'objet
      camera.position.copy(targetPosition);
      camera.rotation.set(0, 0, 0); // Réinitialiser la rotation de la caméra

      controls.update();

      // Vérifier si l'objet a une URL associée et rediriger
      const link = redirectLinks[object.name];
      if (link) {
        window.location.href = link; // Rediriger vers le lien correspondant
      }
    }
  }

  animateZoom();
}

// Fonction pour ajuster la caméra en fonction de la taille du modèle
function adjustCameraToFitModel(camera, controls, boundingBox) {
  // Calculer le centre et la taille du modèle
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());

  // Positionner la caméra pour inclure tout le modèle
  const maxDim = Math.max(size.x, size.y, size.z); // Dimension maximale
  const fov = (camera.fov * Math.PI) / 180; // Convertir FOV en radians
  const cameraDistance = maxDim / (2 * Math.tan(fov / 2)); // Distance requise pour tout voir

  // Positionner la caméra
  camera.position.set(center.x, center.y, center.z + cameraDistance * 1.5); // Ajouter un facteur pour le dézoom
  camera.lookAt(center); // Orienter la caméra vers le modèle

  // Mettre à jour les contrôles
  controls.target.set(center.x, center.y, center.z);
  controls.update();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function createSkybox(texture) {
  const geometry = new THREE.SphereGeometry(500, 60, 40);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  return new THREE.Mesh(geometry, material);
}
