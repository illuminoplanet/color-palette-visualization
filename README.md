# Color Palette Visualization

## Project Description

![cpv_1](images/cpv_1.gif)
Color Palette Visualization is a flask project for visualizing extracted color palettes to 3D space. 


![cpv_2](images/cpv_2.gif)
The project uses a pre-trained object detection model to detect objects in the uploaded image, allowing the user to plot the color palette for each object individually.

## Getting Started

### Prerequisites

Prerequisite libraries can be installed using pip command on requirements.txt.
* pip
  ```sh
  pip install -r /path/to/requirements.txt
  ```
It is recommended to use virtual environment for project isolation.
* venv 
 ```sh
  python -m venv .venv
  source .venv/bin/activate
  pip install -r /path/to/requirements.txt
```

### Running

1. Clone the repository
   ```sh
   git clone https://github.com/illuminoplanet/color-palette-visualization.git
   ```
2. Run src/main.py
   ```sh
   python src/main.py
   ```

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

