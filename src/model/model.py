from PIL import Image
import numpy as np
import cv2

from .cp_extractor import CPExtractor


class Model:
    def __init__(self):
        self.cp_extractor = CPExtractor()

    def process(self, blob):
        array = self._blob_to_array(blob)

        color_palette = self.cp_extractor.process(array)
        unique, count = self._count_unique(array)

        result = {
            "color_palette": color_palette.tolist(),
            "unique": unique.tolist(),
            "count": count.tolist(),
        }
        return result

    def _blob_to_array(self, image):
        image = Image.open(image)
        image = image.convert("RGB")

        array = np.asarray(image, dtype=np.float32)
        array = cv2.resize(array, (1024, 1024)).reshape(-1, 3)

        return array

    def _count_unique(self, image, bin_size=15):
        image = image.copy()
        image = (image // bin_size) * bin_size

        unique, count = np.unique(image, axis=0, return_counts=True)
        unique /= 255

        return unique, count
