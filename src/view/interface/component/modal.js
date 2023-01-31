export class UploadModal {
    constructor(mediator) {
        $("#upload-modal .modal-close").click(this.hide)
        this.mediator = mediator
        this.init_event_listener()
    }
    init_event_listener() {
        $("#upload-zone").on("drag dragstart dragend dragover dragenter dragleave drop", (e) => {
            e.preventDefault()
            e.stopPropagation()
        })
        $("#upload-zone").on("drop", (e) => {
            this.mediator.notify("preprocess_image", e.originalEvent.dataTransfer.files[0])
            $("#processing-screen").css({ display: "flex" })
            $("#upload-modal").hide()
        })
        $("#upload-zone").on("dragover dragenter", () => {
            $("#upload-zone").addClass("drag-enter")
            $("#upload-text").addClass("drag-enter")
            $("#upload-icon").addClass("drag-enter")
        })
        $("#upload-zone").on("dragleave dragend drop", () => {
            $("#upload-zone").removeClass("drag-enter")
            $("#upload-text").removeClass("drag-enter")
            $("#upload-icon").removeClass("drag-enter")
        })
    }
    show() {
        $("#upload-modal").fadeIn(150)
        $("#sidebar").removeClass("is_open")
    }
    hide() {
        $("#upload-modal").fadeOut(75)
    }
}

export class SelectModal {
    constructor(mediator) {
        $("#select-modal .modal-close").click(this.hide)
        this.mediator = mediator
    }
    process_result(image, entries) {
        $("#select-zone").empty()
        for (let i = 0; i < entries.length; i++) {
            $("#select-zone").append(this.create_card(image, entries[i]))
        }
        this.mediator.notify("plot_point", entries[0])
    }
    create_card(image, data) {
        let $card = $("<div>", { "class": "select-card" })
        let $entry = $("<div>", { "class": "select-entry" })
        let $image = this.create_image(image, data["box"])
        let $label = $("<span>", { "class": "select-label" })
        let $button = $("<button>", { "class": "select-button"})

        $button.click(() => {
            this.mediator.notify("plot_point", data)
            this.hide()

            $(".select-button").removeClass("is_selected")
            $button.addClass("is_selected")
        })
            
        $label.text(data["label"])
        $entry.append([$image, $button])
        $card.append([$entry, $label])
        return $card
    }
    create_image(image, box) {
        const [x1, y1, x2, y2] = box
        const [cy, cx] = [Math.round((y2 + y1) / 2), Math.round((x2 + x1) / 2)]
        let r = Math.round(Math.max(y2 - y1, x2 - x1) / 2)
        r = Math.min(Math.min(image.width - cx, cx), Math.min(image.height - cy, cy), r)

        let $canvas = $("<canvas>", { "class": "select-image" })
        $canvas.get(0).width = 96
        $canvas.get(0).height = 96

        let ctx = $canvas.get(0).getContext("2d")
        ctx.drawImage(image, cx - r, cy - r, r * 2, r * 2, 0, 0, 96, 96)

        return $canvas
    }
    show() {
        $("#select-modal").fadeIn(150)
        $("#sidebar").removeClass("is_open")
    }
    hide() {
        $("#select-modal").fadeOut(75)
    }
}