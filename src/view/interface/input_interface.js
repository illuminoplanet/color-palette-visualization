export class InputInterface {
    constructor(mediator) {
        this.mediator = mediator

        this.upload_window = new UploadWindow(mediator)
        this.upload_window_button = new Button("upload-window-button", this.upload_window.toggle)
        // let image = this.load_image()
    }
    load_image() {
        let image = new Image()
        image.onload = () => { image.src = "view/image.jpg" }

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        ctx.drawImage(image, 0, 0)

        return ctx
    }
}

class Button {
    constructor(id, onclick) {
        let $button = $("<button>", { "id": id })
        $button.click(onclick)
        $("#wrapper").append($button)
    }
}

class UploadWindow {
    constructor(mediator) {
        let $div = $("<div>", { "id": "upload-window", "is_open": false })
        let $form = $("<form>", { "id": "upload-zone" })
        $div.append($form)
        $("#wrapper").append($div)

        this.init_event_listener($form, mediator)
    }
    init_event_listener($form, mediator) {
        $form.on("drag dragstart dragend dragover dragenter dragleave drop", (e) => {
            e.preventDefault()
            e.stopPropagation()
        })
        $form.on("drop", (e) => {
            let is_open = ($("#upload-window").attr("is_open") === "true")
            if (is_open) {
                let form_data = new FormData()
                form_data.append("image", e.originalEvent.dataTransfer.files[0])

                mediator.notify("image_upload", form_data)

                $("#upload-window").attr("is_open", false)
                $("#upload-window").hide()
            }
        })
    }
    toggle() {
        let is_open = ($("#upload-window").attr("is_open") === "true")
        if (!is_open) { $("#upload-window").show() } else { $("#upload-window").hide() }
        $("#upload-window").attr("is_open", !is_open)
    }
} 