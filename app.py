from flask import Flask, render_template, request
import requests
import io
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

app = Flask(__name__)

API_URL = "https://api-inference.huggingface.co/models/digiplay/Photon_v1"
headers = {"Authorization": "Bearer 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"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        prompt = request.form['prompt']
        image_bytes = query({"inputs": prompt})
        image = Image.open(io.BytesIO(image_bytes))

        # Convert PIL Image to NumPy array
        image_np = np.array(image)

        # Display the image using Matplotlib
        plt.imshow(image_np)
        plt.axis('off')
        plt.savefig('static/generated_image.png', bbox_inches='tight', pad_inches=0)
        plt.close()

        return render_template('index.html', image_path='static/generated_image.png')
    return render_template('index.html', image_path=None)

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
