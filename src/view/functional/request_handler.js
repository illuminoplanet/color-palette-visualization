export class RequestHandler {
    constructor(mediator) {
        this.mediator = mediator
        this.port = process.env.PORT
    }
    process_image(image) {
        let form_data = new FormData()
        form_data.append("image", image)

        let response = $.ajax({
            url: "https://color-palette-visualization.herokuapp.com/process_image",
            type: "POST",
            data: form_data,
            processData: false,
            contentType: false,
            cache: false,
        }).then((response) => { 
            this.mediator.notify("process_result", response) 
            $("#processing-screen").hide()
            this.mediator.notify("set_control", true)
        })
    }
}