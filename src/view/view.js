import { InputInterface, OutputInterface } from "./interface/index.js"


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

class Mediator {
    constructor() {
        this.components = {}
    }
    register(components) {
        this.components = { ...this.components, ...components }
    }
    notify(event, data) {
        if (event === "image_upload") {
            let request_handler = this.components["request_handler"]
            request_handler.send_image(data)
        }
        if (event === "process_result") {
            let output_interface = this.components["output_interface"]
            output_interface.plot(data)
        }
    }
}

class RequestHandler {
    constructor(mediator) {
        this.mediator = mediator
    }
    send_image(form_data) {
        let response = $.ajax({
            url: "http://localhost:5000/send_image",
            type: "POST",
            data: form_data,
            processData: false,
            contentType: false,
            cache: false,
        }).then((respose) => { this.mediator.notify("process_result", respose) })
    }
}

window.onload = () => {
    new View()
}

