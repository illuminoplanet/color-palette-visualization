export class SideBar {
    constructor(mediator) {
        $("#upload-modal-button").click(this.show_upload_modal.bind(this))
        $("#select-modal-button").click(this.show_select_modal.bind(this))

        window.addEventListener("mousemove", this.mouse_move.bind(this))
        this.mediator = mediator
    }
    mouse_move(event) {
        event = event || window.event
        if (event.pageX >= window.innerWidth - 64 && event.pageX <= window.innerWidth) {
            if ($("#upload-modal").is(":hidden") && $("#select-modal").is(":hidden")) 
                $("#sidebar").addClass("is_open")
        }
		else 
            $("#sidebar").removeClass("is_open")
	}
    show_upload_modal() {
        this.mediator.notify("show_upload_modal", null)
    }
    show_select_modal() {
        this.mediator.notify("show_select_modal", null)
    }
}