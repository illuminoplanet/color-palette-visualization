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
            let input_interface = this.components["input_interface"]
            input_interface.store_image(data)
        }
        if (event === "image_send") {
            let request_handler = this.components["request_handler"]
            request_handler.send_image(data)
        }
        if (event === "process_result") {
            let input_interface = this.components["input_interface"]
            input_interface.update_carousel(data["results"])
        }
        if (event === "plot_point") {
            let output_interface = this.components["output_interface"]
            output_interface.plot(data)
        }
        if (event === "show_upload_window") {
            let input_interface = this.components["input_interface"]
            input_interface.upload_window.show()
        }
    }
}

class RequestHandler {
    constructor(mediator) {
        this.mediator = mediator
    }
    send_image(image) {
        console.log(image)
        let form_data = new FormData()
        form_data.append("image", image)

        let response = $.ajax({
            url: "http://localhost:5000/send_image",
            type: "POST",
            data: form_data,
            processData: false,
            contentType: false,
            cache: false,
        }).then((response) => { this.mediator.notify("process_result", response) })
    }
}

window.onload = () => {
    new View()
}

// 쉐브론 
// 옥시덴탈 페트롤룸
// 애플 
// 