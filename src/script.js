import './style.css'
import * as THREE from 'three'
import { Clock, MeshBasicMaterial, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WebGLBindingStates } from 'three/src/renderers/webgl/WebGLBindingStates'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/** 
 * * Textures
*/
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () =>
{
    console.log('Start')
}

loadingManager.onLoaded = () =>
{
    console.log('Loaded')
}

loadingManager.onProgress = () =>
{
    console.log('Progress')
}

loadingManager.onError = () =>
{
    console.log('Error')
}

const textureLoader = new THREE.TextureLoader(loadingManager) 
const colorTexture = textureLoader.load('./textures/door/color.jpg')
const alphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const heightTexture = textureLoader.load('./textures/door/height.jpg')
const normalTexture = textureLoader.load('./textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('./textures/door/roughness.jpg')

colorTexture.repeat.x = 2
colorTexture.repeat.y = 3

colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping

colorTexture.offset.x = 0.5
colorTexture.offset.y = 0.5

colorTexture.rotation = Math.PI / 4


/** 
 * * GUI 
*/
const gui = new dat.GUI()
//gui.close() 
// gui.hide()
const parameters = {
    color: 0xffd977,
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, x: mesh.rotation.x + Math.PI * 2 })
    }
}
gui
    .addColor(parameters, 'color')
    .onChange(() => {
        materialTriangles.color.set(parameters.color)
    })
gui
    .add(parameters, 'spin')

/** 
 * * Cursor 
*/
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

/** 
 * * Canvas 
*/ 
const canvas = document.querySelector('canvas.webgl')

/** 
 * * Scene 
*/
const scene = new THREE.Scene()

/** 
 * * Objects 
*/
//Triangles
const geometry = new THREE.BufferGeometry()
const count = 1000
const positionsArray = new Float32Array(count * 3 * 3)

for (let i = 0; i < positionsArray.length; i++) {
    positionsArray[i] = Math.random() - 0.5
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

//Box
const box = new THREE.BoxBufferGeometry(1, 1, 1)
const materialBox = new THREE.MeshBasicMaterial(
    {
        wireframe: false,
        map: colorTexture
    })
const materialTriangles = new THREE.MeshBasicMaterial (
    {
        color: parameters.color,
        wireframe: true
    }
)
const mesh = new THREE.Mesh(box, materialBox)
const mesh2 = new THREE.Mesh(geometry, materialTriangles)

/** 
 * * Position 
*/
mesh.position.set(2, -0.1, -2)

/** 
 * * Scale 
*/
mesh.scale.set(1, 1, 1)

/** 
 * * Rotation 
*/ 
mesh.rotation.reorder('XYZ')
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
scene.add(mesh, mesh2)
/** 
 * * GUI 
*/
gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('y-Position')
gui
    .add(mesh, 'visible')
gui
    .add(materialTriangles, 'wireframe') 

/** 
 * * Axes Helper 
*/
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/** 
* Window Sizes; 
*/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/** 
 * * Window Resizing 
*/
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
/** 
 * * Toggle Fullscreen 
*/
// window.addEventListener('keypress', () => {
//     key
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
//     if (!fullscreenElement) {
//         if (canvas.requestFullscreen) {
//             canvas.requestFullscreen()
//         }
//         else if (canvas.webkitRequestFullscreen) {
//             canvas.webkitRequestFullscreen()
//         }
//     }

//     else {
//         if (document.exitFullscreen) {
//             document.exitFullscreen()
//         }
//         else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen()
//         }
//         console.log('leave fullscreen')
//     }
// })

/** 
* Camera 
*/
const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100) 
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 2, 5)
camera.lookAt(mesh.position)
scene.add(camera)

/** 
 * * Controls
*/
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/** 
* Renderer 
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/** 
 * * Clock
*/

//Movement after at a certained time
// gsap.to(mesh.position, {duration: 3, delay: 1, x: 4}) 
// gsap.to(mesh.position, {duration: 1, delay: 2, x: 2}) 

const clock = new Clock()

/** 
 * * Animations 
*/
const tick = () => {
    //Clock 
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y = elapsedTime
    mesh.position.z = Math.tan(elapsedTime) 
    // Update camera 
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5 
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5 
    // camera.position.y = cursor.y * 5 
    // camera.lookAt(new THREE.Vector3()) 
    // controls.update()

    //Renderer 
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

