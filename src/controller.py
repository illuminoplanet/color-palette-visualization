from flask import Flask, render_template, request


class Controller:
    def __init__(self, model):
        self.model = model

    def run(self, **kwargs):
        self.app = self._get_flask_app()
        self.app.run(**kwargs)

    def _get_flask_app(self):
        app = Flask(__name__, template_folder="./view", static_folder="./view")

        @app.route("/")
        def index():
            return render_template("index.html")

        @app.route("/send_image", methods=["POST"])
        def send_image():
            image = request.files["image"]
            result = self.model.process(image)
            return result

        return app
