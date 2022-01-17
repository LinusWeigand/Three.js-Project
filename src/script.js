import './style.css'
import * as THREE from 'three'
import { Clock, MeshBasicMaterial, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WebGLBindingStates } from 'three/src/renderers/webgl/WebGLBindingStates'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

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
        material.color.set(parameters.color)
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
const box = new THREE.BoxGeometry(1, 1, 1, 1, 1, 2)
const material = new THREE.MeshBasicMaterial(
    {
        color: parameters.color,
        wireframe: true
    })

const mesh = new THREE.Mesh(box, material)
const mesh2 = new THREE.Mesh(geometry, material)

/** 
 * * Position 
*/
mesh.position.set(2, -0.1, -2)

/** 
 * * Scale 
*/
mesh.scale.set(2, 0.5, 1.5)

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
    .add(material, 'wireframe')

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

