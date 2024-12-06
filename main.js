import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/FBXLoader.js";
import { FontLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.158.0/examples/jsm/geometries/TextGeometry.js";

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

// Ajouter après l'import des modules nécessaires
function addText(scene, position = { x: 0, y: 3, z: 0 }) {
  const loader = new FontLoader();

  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const textGeometry = new TextGeometry("Click moi dessus!", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5,
      });

      const textMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6347,
        roughness: 0.3,
        metalness: 0.5,
      });

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(position.x, position.y, position.z);
      textMesh.castShadow = true;
      scene.add(textMesh);
    }
  );
}

addText(scene, { x: 0, y: 18, z: 0 });

modelLoader.load("models3D/character.fbx", (object) => {
  model = object;

  model.traverse((child) => {
    if (child.isMesh) {
      const beigeColor = new THREE.Color(0xf5f5dc);
      child.material = new THREE.MeshStandardMaterial({
        color: beigeColor,
        roughness: 0.5,
        metalness: 0.2,
      });
    }
  });

  model.position.set(0, 0, 0);
  model.scale.set(0.1, 0.1, 0.1);
  scene.add(model);

  // Calculer les limites et ajuster la caméra
  const box = new THREE.Box3().setFromObject(model);
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
  head: "index.php?controller=corps&methode=cerveau",
  torsoUp: "index.php?controller=corps&methode=coeur",
  torsoDown: "index.php?controller=corps&methode=estomac",
  llegs: "index.php?controller=corps&methode=jambe",
  rlegs: "index.php?controller=corps&methode=jambe",
  larms: "index.php?controller=corps&methode=bras",
  rarms: "index.php?controller=corps&methode=bras",
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
