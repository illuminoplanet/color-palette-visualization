export class InputInterface {
    constructor(mediator) {
        this.mediator = mediator

        this.upload_window = new UploadWindow(mediator)
        this.instance_carousel = new InstanceCarousel(mediator)
        this.sidebar = new SideBar(mediator)
    }
    store_image(file) {
        this.to_image(file).then((image) => {
            this.image = this.resize_image(image, 512)
            console.log(this.image)
            this.to_DataURL(this.image).then(
                (file) => this.mediator.notify("image_send", file)
            )
        })
    }
    async to_image(file) {
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
    async to_DataURL(image) {
        let file = await new Promise((resolve) => {
            image.toBlob((blob) => {
                resolve(blob)
            }), 'image/jpeg'
        })
        return file
    }
    resize_image(image, max_size) {
        const ratio = max_size / Math.max(image.width, image.height)

        let canvas = document.createElement("canvas")
        canvas.width = image.width * ratio
        canvas.height = image.height * ratio

        let ctx = canvas.getContext("2d")
        ctx.drawImage(image, 0, 0)

        return canvas
    }
    update_carousel(entries) {
        this.instance_carousel.update_carousel(this.image, entries)
    }
}

class Button {
    constructor(id, onclick) {
        let $button = $("<button>", { "id": id })
        $button.click(onclick)
    }
}

class UploadWindow {
    constructor(mediator) {
        let $modal = $("<div>", { "class": "modal", "id": "upload-window", "is_open": false })
        let $modal_content = $("<div>", { "class": "modal-content" })
        let $modal_header = $("<div>", { "class": "modal-header" })
        let $modal_seperator = $("<hr>", { "class": "modal-seperator" })
        let $modal_body = $("<div>", { "class": "modal-body" })
        let $modal_close = $("<span>", { "class": "modal-close" })
        $modal_close.text("\u2715")
        $modal_close.click(this.hide)
        $modal_header.text("Upload Image")

        let $upload_zone = $("<form>", { "id": "upload-zone" })
        let $upload_icon = $("<span>", { "id": "upload-icon", "class": "material-symbols-outlined" })
        let $upload_text = $("<span>", { "id": "upload-text" })
        $upload_icon.text("upload")
        $upload_text.text("Drag & Drop to Upload")
        $upload_zone.append($upload_icon)
        $upload_zone.append($upload_text)


        $modal_body.append($upload_zone)
        $modal_header.append($modal_close)
        $modal_content.append($modal_header)
        $modal_content.append($modal_seperator)
        $modal_content.append($modal_body)
        $modal.append($modal_content)
        $("#wrapper").append($modal)

        this.init_event_listener($upload_zone, mediator)
    }
    init_event_listener($form, mediator) {
        $form.on("drag dragstart dragend dragover dragenter dragleave drop", (e) => {
            e.preventDefault()
            e.stopPropagation()
        })
        $form.on("drop", (e) => {
            let is_open = ($("#upload-window").attr("is_open") === "true")
            if (is_open) {
                mediator.notify("image_upload", e.originalEvent.dataTransfer.files[0])

                $("#upload-window").attr("is_open", false)
                $("#upload-window").hide()
            }
        })
        $form.on("dragover dragenter", () => {
            $form.addClass("drag-enter")
            $("#upload-text").addClass("drag-enter")
            $("#upload-icon").addClass("drag-enter")
        })
        $form.on("dragleave dragend drop", () => {
            $form.removeClass("drag-enter")
            $("#upload-text").removeClass("drag-enter")
            $("#upload-icon").removeClass("drag-enter")
        })
    }
    show() {
        $("#upload-window").attr("is_open", true)
        $("#upload-window").show()
        $("#sidebar").removeClass("open")
    }
    hide() {
        $("#upload-window").attr("is_open", false)
        $("#upload-window").hide()
    }
}

class InstanceCarousel {
    constructor(mediator) {
        this.$carousel = $("<div>", { "id": "carousel" })
        $("#wrapper").append(this.$carousel)

    }
    update_carousel(image, entries) {
        this.image = image
        for (let i = 0; i < entries.length; i++) {
            this.$carousel.append(this.create_card(entries[i]))
        }
    }
    crop_image(box) {
        const [x1, y1, x2, y2] = box

        let $canvas = $("<canvas>", { "class": "carousel-image" })

        $canvas.get(0).width = this.image.width * 0.1
        $canvas.get(0).height = this.image.height * 0.1

        let ctx = $canvas.get(0).getContext("2d")
        ctx.drawImage(this.image, x1, y1, x2 - x1, y2 - y1, 0, 0, x2 - x1, y2 - y1)

        return $canvas
    }
    create_card(data) {
        let $card = $("<div>", { "class": "carousel-card" })

        let $image = this.crop_image(data["box"])
        let $label = $("<span>", { "class": "carousel-label" })
        $label.text(data["label"])

        $card.append($image)
        $card.append($label)

        return $card
    }
} 

class SideBar {
    constructor(mediator) {
        this.mediator = mediator

        let $sidebar = $("<nav>", { "id" : "sidebar" })

        let $upload_button = $("<button>", { "id": "upload-window-button" })
        let $upload_icon = $("<span>", { "class": "material-symbols-outlined", "id": "upload-window-icon" })
        $upload_icon.text("upload")
        $upload_button.click(this.show_upload_window.bind(this))
        $upload_button.append($upload_icon)

        let $select_button = $("<button>", { "id": "select-window-button" })
        let $select_icon = $("<span>", { "class": "material-symbols-outlined", "id": "select-window-icon" })
        $select_icon.text("location_away")
        $select_button.click(this.show_select_window.bind(this))
        $select_button.append($select_icon)


        window.addEventListener("mousemove", this.mouse_move.bind(this))
        $sidebar.append($select_button)
        $sidebar.append($upload_button)
        $("#wrapper").append($sidebar)
    }
    mouse_move(event) {
        event = event || window.event
        if (event.pageX >= window.innerWidth - 64 && event.pageX <= window.innerWidth) {
            if ($("#upload-window").is(":hidden") && $("#select-window").is(":hidden")) 
                $("#sidebar").addClass("open")
        }
		else 
            $("#sidebar").removeClass("open")
	}
    show_upload_window() {
        this.mediator.notify("show_upload_window", null)
    }
    show_select_window() {
        this.mediator.notify("show_select_window", null)
    }
}