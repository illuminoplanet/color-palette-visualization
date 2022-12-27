export class InputInterface {
    constructor(mediator) {
        this.mediator = mediator

        this.upload_window = new UploadWindow(mediator)
        this.upload_window_button = new Button("upload-window-button", this.upload_window.toggle)

        this.image_slider = new ImageSelector(mediator)
    }
    set_image(image) {
        this.image = image
    }
    update_selector(data) {
        this.image_slider.update_selector(this.image, data)
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

class ImageSelector {
    constructor(mediator) {
        let $selector = $("<div>", { "id": "selector" })
        $("#wrapper").append($selector)

    }
    update_selector(file, data) {
        this.data = data
        this.read_image(file).then((image) => {
            for (let [i, key] of Object.keys(data).entries()) {
                let $element = $("<div>", { "class": "element" })
                let $canvas = this.crop_image(image, data[key]["box"])

                $element.append($canvas)
                $("#selector").append($element)
            }
        })
    }
    crop_image(image, box) {
        const [x1, x2, y1, y2] = box

        let $canvas = $("<canvas>", { "class": "element-canvas" })
        let ctx = $canvas.get(0).getContext("2d")
        console.log(box)
        ctx.drawImage(image, x1, y1, x2 - x1, y2 - y1, 0, 0, x2 - x1, y2 - y1)

        return $canvas
    }
    async read_image(file) {
        let image = await new Promise((resolve) => {
            let file_reader = new FileReader()
            file_reader.onload = (e) => {
                let image = new Image()
                image.src = e.target.result
                resolve(image)
            }
            file_reader.readAsDataURL(file)
        })
        return image
    }
} 