import { InputInterface, OutputInterface } from "./interface/index.js"


class View {
    constructor() {
        this.mediator = new Mediator()
        this.input_interface = new InputInterface(this.mediator)
    }
}

class Mediator {
    notify(event, data) {
        console.log(data)
    }
}

window.onload = () => {
    new View()
}

