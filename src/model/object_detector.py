from transformers import DetrImageProcessor, DetrForObjectDetection
import torch


class ObjectDetector:
    def __init__(self):
        self.processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50")
        self.model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50")

    def process(self, image):
        results = self._detect_objects(image)
        objects = self._postprocess(image, results)

        return objects

    def _detect_objects(self, image, n_max=5):
        inputs = self.processor(images=image, return_tensors="pt")
        outputs = self.model(**inputs)

        target_sizes = torch.Tensor([image.shape[:2]])
        results = self.processor.post_process_object_detection(
            outputs, target_sizes=target_sizes, threshold=0.8
        )[0]

        results = zip(results["scores"], results["labels"], results["boxes"])
        results = sorted(results, reverse=True)[:n_max]

        return results

    def _postprocess(self, image, results):
        objects = [("original", (0, 0, *image.shape[:2]), image.copy().reshape(-1, 3))]
        for _, label, box in results:
            box = [round(i) for i in box.tolist()]
            cropped = image.copy()[box[1] : box[3], box[0] : box[2]].reshape(-1, 3)
            label = self.model.config.id2label[label.item()]

            objects.append((label, box, cropped))

        return objects
