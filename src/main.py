from .model import Model
from .controller import Controller


model = Model()
controller = Controller(model)

app = controller.run()