import { InputInterface, OutputInterface } from "./interface/index.js"
import { Mediator, RequestHandler } from "./functional/index.js"


class View {
    constructor() {
        this.mediator = new Mediator()
        this.request_handler = new RequestHandler(this.mediator)

        this.input_interface = new InputInterface(this.mediator)
        this.output_interface = new OutputInterface(this.mediator)

        this.mediator.register({
            "request_handler": this.request_handler,
            "input_interface": this.input_interface,
            "output_interface": this.output_interface
        })
    }
}

window.onload = () => {
    new View()
}
