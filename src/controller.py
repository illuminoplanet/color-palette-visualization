from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin


class Controller:
    def __init__(self, model):
        self.model = model

    def run(self):
        self.app = self._get_flask_app()
        cors = CORS(self.app)

        return self.app

    def _get_flask_app(self):
        app = Flask(__name__, template_folder="./view", static_folder="./view")

        @app.route("/")
        @cross_origin()
        def index():
            return render_template("index.html")

        @app.route("/process_image", methods=["POST"])
        @cross_origin()
        def process_image():
            image = request.files["image"]
            result = self.model.process_image(image)
            return jsonify(result)

        return app
