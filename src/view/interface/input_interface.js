import { UploadModal, SelectModal, SideBar } from "./component/index.js"


export class InputInterface {
    constructor(mediator) {
        this.mediator = mediator

        this.upload_modal = new UploadModal(mediator)
        this.select_modal = new SelectModal(mediator)
        this.sidebar = new SideBar(mediator)
    }
    preprocess_image(file) {
        this.DataURL_to_image(file).then((image) => {
            this.image = this.resize_image(image, 384)
            this.image_to_DataURL(this.image).then(
                (file) => this.mediator.notify("process_image", file)
            )
        })
    }
    async DataURL_to_image(file) {
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
    async image_to_DataURL(image) {
        let file = await new Promise((resolve) => { 
            image.toBlob((blob) => { resolve(blob) }), "image/jpeg" 
        })
        return file
    }
    resize_image(image, max_size) {
        const ratio = max_size / Math.max(image.width, image.height)

        let canvas = document.createElement("canvas")
        canvas.width = image.width * ratio
        canvas.height = image.height * ratio

        let ctx = canvas.getContext("2d")
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        return canvas
    }
}