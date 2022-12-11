import { DataStorage, EventHandler, Clock } from "./functional/index.js"
import { InputInterface, OutputInterface } from "./interface/index.js"


class View {
    constructor() {
        this.data_storage = new DataStorage()
        this.event_handler = new EventHandler(this.data_storage)

        // Initialize backend, then frontend
        this.event_handler.initialized = this.initialize.bind(this)
        this.event_handler.handle("initialize")
    }
    initialize() {
        this.clock = new Clock(this.data_storage, this.event_handler, 200)

        this.input_interface = new InputInterface(this.event_handler)
        this.output_interface = new OutputInterface(this.data_storage)
    }
}

window.onload = () => {
    new View()
}