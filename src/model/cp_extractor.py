import numpy as np

from .kmeans import KMeans


class CPExtractor:
    def __init__(self):
        self.cp_algorithm = KMeans()

    def process(self, srgb):
        lab_array = self._srgb_to_lab(srgb)
        color_palette = self.cp_algorithm(
            lab_array, 8, params={"n_iter": 100, "batch_size": 1024}
        )
        color_palette = self._lab_to_srgb(color_palette) / 255
        return color_palette

    def _srgb_to_lab(self, srgb):
        # sRGB to linear RGB
        rgb = np.zeros_like(srgb, dtype=np.float32)
        srgb = srgb / 255
        mask = srgb <= 0.04045

        rgb[mask] = srgb[mask] / 12.92
        rgb[~mask] = ((srgb[~mask] + 0.055) / 1.055) ** 2.4

        # linear RGB to XYZ
        m = np.array(
            [
                [0.4124, 0.3576, 0.1805],
                [0.2126, 0.7152, 0.0722],
                [0.0193, 0.1192, 0.9505],
            ]
        )
        xyz = np.dot(m, rgb.T).T * 100

        # XYZ to L*a*b
        delta = 6 / 29

        def f(t):
            mask = t > delta**3
            new = np.zeros_like(t)

            new[mask] = np.cbrt(t[mask])
            new[~mask] = t[~mask] / (3 * delta**2) + (4 / 29)
            return new

        lab = np.zeros_like(xyz, dtype=np.float32)
        temp = f(xyz / np.array([95.0489, 100.0, 108.8840]))

        lab[:, 0] = 116 * temp[:, 1] - 16
        lab[:, 1] = 500 * (temp[:, 0] - temp[:, 1])
        lab[:, 2] = 200 * (temp[:, 1] - temp[:, 2])

        return lab

    def _lab_to_srgb(self, lab):
        # L*a*b to XYZ
        delta = 6 / 29

        def f_inverse(t):
            mask = t > delta
            new = np.zeros_like(t)

            new[mask] = t[mask] ** 3
            new[~mask] = 3 * (delta**2) * (t[~mask] - (4 / 29))
            return new

        xyz = np.zeros_like(lab, dtype=np.float32)
        temp = (lab + np.array([16.0, 0.0, 0.0])) / np.array([116.0, 500.0, 200.0])

        xyz[:, 0] = f_inverse(temp[:, 0] + temp[:, 1])
        xyz[:, 1] = f_inverse(temp[:, 0])
        xyz[:, 2] = f_inverse(temp[:, 0] - temp[:, 2])
        xyz *= np.array([95.0489, 100.0, 108.8840])

        # XYZ to linear RGB
        m = np.array(
            [
                [3.2406, -1.5372, -0.4986],
                [-0.9689, 1.8758, 0.0415],
                [0.0557, -0.2040, 1.0570],
            ]
        )
        rgb = np.dot(m, xyz.T).T / 100

        # linear RGB to sRGB
        srgb = np.zeros_like(rgb, dtype=np.float32)
        mask = rgb <= 0.0031308

        srgb[mask] = rgb[mask] * 12.92
        srgb[~mask] = (rgb[~mask] ** (1 / 2.4)) * 1.055 - 0.055
        srgb *= 255

        return srgb
