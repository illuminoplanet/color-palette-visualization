import numpy as np


class CPExtractor:
    def __init__(self):
        pass

    def process(self, srgb):
        xyz_array = self._srgb_to_xyz(srgb)

    def _srgb_to_xyz(srgb):
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
