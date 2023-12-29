const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const request = require('request');
const fs = require('fs').promises;
const { join } = require('path');
async function query(features) {


const {nose , eyes,eyebrows,skintone ,lips, gender,age} = features
   prompt =  `Generate an image of a realistic ${age} ${gender} human face with the following features:
- Nose: ${nose}
- Eyes: ${eyes}
- Eyebrows: ${eyebrows}
- Skin Tone: ${skintone}
- Lips: ${lips}
- Gender: ${gender} `
    const response = await fetch(
        "https://api-inference.huggingface.co/models/DoctorDiffusion/doctor-diffusion-s-stylized-silhouette-photography-xl-lora",
        {
            headers: { Authorization: process.env.AUTHORIZATION },
            method: "POST",
            body: JSON.stringify(prompt),
        }
    );
    const result = await response.buffer(); 
    return result;
}

// query({ "inputs": "Astronaut riding a horse" }).then(async (response) => {
//     // Save the buffer as an image file
//     const fs = require('fs');
//     fs.writeFileSync('stylized_image.png', response);
//     console.log('Image saved successfully!');
// });





const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));



app.get('/', (req, res) => {
  res.render('index', { image_path: null });
});

app.post('/', async (req, res) => {
  const features = req.body
  query(features).then(async (response) => {
    const fs = require('fs');
    imageFileName = "Generatedimage.png";
    fs.writeFileSync( join(__dirname, 'static/'+ imageFileName) , response);
    res.render('index', { image_path: imageFileName });

    console.log('Image saved successfully!');
});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});