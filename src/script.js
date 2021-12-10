import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import GUI from 'lil-gui'

import boilerVertexShader from './shaders/vertex.glsl'
import boilerFragmentShader from './shaders/fragment.glsl'

//Postprocessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

//Import PixelShader.js
import { PixelShader } from './PixelShader.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff) //0x132020

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 1.5
camera.position.z = 2.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Sphere
 */

/* const geometry = new THREE.BoxBufferGeometry(1,1,1)

let shaderMaterial = null

shaderMaterial= new THREE.ShaderMaterial({
    vertexShader:boilerVertexShader,
    fragmentShader:boilerFragmentShader,
    wireframe:false,
    uniforms:{
        uTime:{value:0}
    }


})

const Sphere = new THREE.Mesh(geometry,shaderMaterial)

scene.add(Sphere) */



/**
 * Textures
 */
 const textureLoader = new THREE.TextureLoader()
 const matcapTexture = textureLoader.load('/textures/matcaps/12.png')
 const matcapTexture2 = textureLoader.load('/textures/matcaps/3.png')
 const matcapTexture3 = textureLoader.load('/textures/matcaps/10.png')
 const matcapTexture4 = textureLoader.load('/textures/matcaps/11.png')

 const material = new THREE.MeshMatcapMaterial()
 const material2 = new THREE.MeshMatcapMaterial()
 const material3 = new THREE.MeshMatcapMaterial()
 const material4 = new THREE.MeshMatcapMaterial()

 material.matcap = matcapTexture
 material2.matcap = matcapTexture2
 material3.matcap = matcapTexture3
 material4.matcap = matcapTexture4

/**
 * Object
 */

const loader = new OBJLoader()

 loader.load(
	// resource URL
	'models/hand.obj',
	// called when resource is loaded
	function ( object ) {

		scene.add( object );
        object.children[0].material = material
        object.position.x=-20
        object.position.z = -5
        object.scale.set(0.5,0.5,0.5)

        const object2 = object.clone()
        object2.position.x = -10
        object.position.z = -5
        object2.scale.set(0.5,0.5,0.5)
        object2.children[0].material = material2
        scene.add(object2)

        const object3 = object.clone()
        object3.position.x = 0
        object.position.z = -5
        object3.scale.set(0.5,0.5,0.5)
        object3.children[0].material = material3
        scene.add(object3)

        const object4 = object.clone()
        object4.position.x = 10
        object.position.z = -5
        object4.scale.set(0.5,0.5,0.5)
        object4.children[0].material = material4
        scene.add(object4)


	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Init Postprocessing

const composer = new EffectComposer( renderer )
composer.addPass( new RenderPass( scene, camera ) )

let effect = new ShaderPass( PixelShader )

composer.addPass( effect )

//GUI
const gui = new GUI()
gui.add(effect.uniforms.pixelSize,'value').min(1.0).max(10.0).step(0.01).name('PixelSize')


/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const animateScene = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    //Update shader with time
    //shaderMaterial.uniforms.uTime.value = elapsedTime

    //Effect
    //  effect.uniforms[ 'time' ].value = elapsedTime * 0.3
    //  effect.uniforms[ 'progress' ].value = 0.5
    //effect.uniforms[ 'pixelSize' ].value = 3

    // Render
    //renderer.render(scene, camera)

    composer.render()

    // Call animateScene again on the next frame
    window.requestAnimationFrame(animateScene)
}

animateScene()