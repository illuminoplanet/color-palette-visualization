from PIL import Image
import numpy as np

from .cp_extractor import CPExtractor


class Model:
    def __init__(self):
        self.cp_extractor = CPExtractor()

    def process(self, blob):
        array = self._blob_to_array(blob)

        color_palette = self.cp_extractor.process(array)
        return color_palette

    def _blob_to_array(self, blob):
        image = Image.open(blob.stream)
        image = image.convert("RGB")

        array = np.asarray(image, dtype=np.float32).reshape(-1, 3)
        return array
