// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222); // Dark gallery background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5); // Eye-level view

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Controls for navigation (mouse to orbit/zoom)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;

// Create a simple room (walls, floor)
const roomGeometry = new THREE.BoxGeometry(10, 5, 10);
const roomMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.BackSide });
const room = new THREE.Mesh(roomGeometry, roomMaterial);
scene.add(room);

// Floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.5;
scene.add(floor);

// Load designs as 3D planes (like framed art)
const loader = new THREE.TextureLoader();
const designs = [
    { image: 'assets/3d Model 1.png', title: 'Logo Design', position: [-3, 0, -4] },
    { image: 'assets/3d Model 2.png', title: 'Poster Art', position: [3, 0, -4] },
    { image: 'assets/3d Model 4.png', title: 'Illustration', position: [0, 0, -4] },
    // Add more as needed
];

designs.forEach(design => {
    const geometry = new THREE.PlaneGeometry(2, 1.5);
    const material = new THREE.MeshBasicMaterial({ map: loader.load(design.image) });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(...design.position);
    plane.userData = { title: design.title, image: design.image };
    scene.add(plane);
});

// Raycaster for clicking on designs
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.title) {
            selectedObject = obj;
            document.getElementById('details').innerHTML = `<h3>${obj.userData.title}</h3><img src="${obj.userData.image}" width="200">`;
        }
    }
}
window.addEventListener('click', onMouseClick);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});