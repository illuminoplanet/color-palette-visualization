import * as THREE from "three"
import { ArcballControls } from "three/addons/controls/ArcballControls.js"


export class OutputInterface {
    constructor(mediator) {
        this.mediator = mediator

        const [w, h] = [window.innerWidth, window.innerHeight]

        // Scene
        this.scene = new THREE.Scene()

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
        this.camera.position.set(0, 0, 2)

        // Renderer
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(w, h)
        document.body.appendChild(this.renderer.domElement)

        // Controller
        this.controller = new ArcballControls(this.camera, document.querySelector("body"), this.scene)
        this.controller.enablePan = false
        this.controller.enableZoom = false
        this.controller.enableAnimations = true
        this.controller.dampingFactor = 1
        this.controller.wMax = 1
        this.controller.setGizmosVisible(false)

        // Light
        this.ambient_light = new THREE.AmbientLight(0xACACAC)
        this.scene.add(this.ambient_light)

        this.point_light = new THREE.PointLight(0xFFFFFF, 0.4)
        this.point_light.castShadow = true
        this.scene.add(this.point_light)

        // Background
        const geometry = new THREE.BoxGeometry(4, 4, 4)
        const material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF, side: THREE.BackSide
        })

        const cube = new THREE.Mesh(geometry, material)
        this.scene.add(cube)

        this.render()
    }
    render() {
        requestAnimationFrame(this.render.bind(this))

        this.renderer.render(this.scene, this.camera)
        this.controller.update()
    }
}