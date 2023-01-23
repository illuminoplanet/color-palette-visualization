from PIL import Image
import numpy as np
from multiprocessing import Pool

from .object_detector import ObjectDetector
from .color_palette_extractor import ColorPaletteExtractor


class Model:
    def __init__(self):
        self.object_detector = ObjectDetector()
        self.color_palette_extractor = ColorPaletteExtractor()

    def process_image(self, blob):
        image = self._blob_to_image(blob)
        results = []

        object_detected = self.object_detector.detect(image)
        with Pool() as p:
            for object in object_detected:
                # Extract color palette & Count unique rgb color
                result = p.apply(self._get_result, (*object,))
                results.append(result)

        return results

    def _get_result(self, label, box, image):
        color_palette = self.color_palette_extractor.extract(image)
        unique_rgb, unique_count = self._count_unique(image)

        # Normalize RGB values
        color_palette /= 255
        unique_rgb /= 255

        result = {
            "label": label,
            "box": box,
            "color_palette": color_palette.tolist(),
            "unique_rgb": unique_rgb.tolist(),
            "unique_count": unique_count.tolist(),
        }
        return result

    def _blob_to_image(self, blob):
        image = Image.open(blob)
        image = image.convert("RGB")
        image = np.asarray(image, dtype=np.float32)

        return image

    def _count_unique(self, image, bin_size=20):
        image = image.copy()
        image = (image // bin_size) * bin_size

        unique_rgb, unique_count = np.unique(image, axis=0, return_counts=True)
        return unique_rgb, unique_count
