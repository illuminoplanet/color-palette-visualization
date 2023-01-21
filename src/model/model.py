from PIL import Image
import numpy as np
from multiprocessing import Pool

from .object_detector import ObjectDetector
from .cp_extractor import CPExtractor


class Model:
    def __init__(self):
        self.object_detector = ObjectDetector()
        self.cp_extractor = CPExtractor()

    def process(self, blob):
        array = self._blob_to_array(blob)
        results = []    

        object_detected = self.object_detector.process(array)
        with Pool() as p:
            for entry in object_detected:
                result = p.apply(self._get_result, (*entry,))
                results.append(result)
        return results

    def _get_result(self, label, box, image):
        color_palette = self.cp_extractor.process(image)
        unique, count = self._count_unique(image)

        result = {
            "label": label,
            "box": box,
            "color_palette": color_palette.tolist(),
            "unique": unique.tolist(),
            "count": count.tolist(),
        }
        return result

    def _blob_to_array(self, image):
        image = Image.open(image)
        image = image.convert("RGB")

        array = np.asarray(image, dtype=np.float32)
        return array

    def _count_unique(self, image, bin_size=20):
        image = image.copy()
        image = (image // bin_size) * bin_size

        unique, count = np.unique(image, axis=0, return_counts=True)
        unique /= 255

        return unique, count
