export class Mediator {
    constructor() {
        this.components = {}
    }
    register(components) {
        this.components = { ...this.components, ...components }
    }
    notify(event, data) {
        if (event === "preprocess_image") {
            let input_interface = this.components["input_interface"]
            input_interface.preprocess_image(data)
        }
        if (event === "process_image") {
            let request_handler = this.components["request_handler"]
            request_handler.process_image(data)
        }
        if (event === "process_result") {
            let input_interface = this.components["input_interface"]
            input_interface.select_modal.process_result(input_interface.image, data)
        }
        if (event === "plot_point") {
            let output_interface = this.components["output_interface"]
            output_interface.plot_point(data)
        }
        if (event === "show_upload_modal") {
            let input_interface = this.components["input_interface"]
            input_interface.upload_modal.show()
        }
        if (event === "show_select_modal") {
            let input_interface = this.components["input_interface"]
            input_interface.select_modal.show()
        }
    }
}