from transformers import DetrImageProcessor, DetrForObjectDetection
import torch


class ObjectDetector:
    def __init__(self):
        self.processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50")
        self.model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50")

    def process(self, image):
        objects = self._detect_objects(image)
        objects = self._postprocess(image, objects)

        return objects

    def _detect_objects(self, image, n_max=5):
        inputs = self.processor(images=image, return_tensors="pt")
        outputs = self.model(**inputs)

        target_sizes = torch.Tensor([image.shape[:2]])
        results = self.processor.post_process_object_detection(
            outputs, target_sizes=target_sizes, threshold=0.8
        )[0]

        results = zip(results["scores"], results["labels"], results["boxes"])
        results = sorted(results, reverse=True)[: n_max - 1]

        return results

    def _postprocess(self, image, objects):
        # Start with original whole image
        h, w = image.shape[:2]
        postprocessed = ["Whole", (0, 0, w, h), image.copy().reshape(-1, 3)]

        for _, label, box in objects:
            box = [round(i) for i in box.tolist()]
            cropped = image.copy()[box[1] : box[3], box[0] : box[2]].reshape(-1, 3)
            label = self.model.config.id2label[label.item()]

            postprocessed.append((label, box, cropped))

        return postprocessed
