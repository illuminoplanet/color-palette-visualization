import * as THREE from "https://cdn.skypack.dev/three@0.144.0"


export class OutputInterface {
    constructor(mediator) {
        this.mediator = mediator
    }
    plot(placeholder) {
        console.log("boom")
    }
}