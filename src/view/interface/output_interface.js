import * as THREE from "three"
import { ArcballControls } from "three/addons/controls/ArcballControls.js"


export class OutputInterface {
    constructor(mediator) {
        this.mediator = mediator
        window.addEventListener("resize", this.resize.bind(this))

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
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)

        this.render()
    }
    render() {
        requestAnimationFrame(this.render.bind(this))

        this.renderer.render(this.scene, this.camera)
        this.controller.update()
    }
    resize() {
        const [w, h] = [window.innerWidth, window.innerHeight]

        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(w, h)
    }
    reset() {
        this.scene.remove.apply(this.scene, this.scene.children)

        this.scene.add(this.ambient_light)
        this.scene.add(this.point_light)
        this.scene.add(this.cube)
    }
    plot_point(data) {
        this.reset()

        for (let i = 0; i < data["unique_color"].length; i++) {
            const [r, g, b] = data["unique_color"][i]
            const scale = Math.pow(data["count"][i], 0.15) * 0.02

            const color = new THREE.Color(r, g, b)
            const [x, y, z] = [(r - 0.5) * 2, (g - 0.5) * 2, (b - 0.5) * 2]
            const material = new THREE.SpriteMaterial({ color: color })

            const sprite = new THREE.Sprite(material)
            sprite.material.rotation = Math.PI / 4
            sprite.position.set(x, y, z)
            sprite.scale.set(scale, scale, scale)

            this.scene.add(sprite)
        }
        for (let i = 0; i < data["color_palette"].length; i++) {
            const [r, g, b] = data["color_palette"][i]

            const color = new THREE.Color(r, g, b)
            const [x, y, z] = [(r - 0.5) * 2, (g - 0.5) * 2, (b - 0.5) * 2]
            const material = new THREE.SpriteMaterial({ color: color })

            const outline = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x333333 }))
            outline.material.rotation = Math.PI / 4
            outline.position.set(x, y, z)
            outline.scale.set(0.1, 0.1, 0.1)
            this.scene.add(outline)

            const sprite = new THREE.Sprite(material)
            sprite.material.rotation = Math.PI / 4
            sprite.position.set(x, y, z)
            sprite.scale.set(0.07, 0.07, 0.07)
            this.scene.add(sprite)
        }
    }

}