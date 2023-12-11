const apiKey = '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';

const maxImages = 2;
let selectedImageNumber = null;
const imageUrls = [];

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function disableGenerateButton() {
  document.getElementById('generate').disabled = true;
}

function enableGenerateButton() {
  document.getElementById('generate').disabled = false;
}

function clearImageGrid() {
  const imageGrid = document.getElementById('image-grid');
  imageGrid.innerHTML = '';
}

const userPromptInput = document.getElementById('user-prompt');
userPromptInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const input = userPromptInput.value;
    generateImages(input);
  }
});

async function generateImages(input) {
  // Define an array of negative keywords
  const negativeKeywords = ['nude', 'explicit', 'inappropriate', 'boobs', 'boob', 'breast', 'nipples', 'blood', 'kill', 'murdered', 'murder', 'sex', 'penis', 'cock', 'tits', 'clit', 'vagina'];

  // Check if the input contains any negative keywords
  const containsNegativeKeyword = negativeKeywords.some(keyword =>
    input.toLowerCase().includes(keyword)
  );

  if (containsNegativeKeyword) {
    // Display a message to the user indicating that the input is not allowed
    alert('Sorry, this input contains inappropriate content and cannot be processed.');
    return;
  }

  // Define the negative prompt here
  const negativePrompt = "low resolution, bad anatomy, bad hands, text, errors, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, jpeg artifacts, signature, watermark, username, blurry";

  disableGenerateButton();
  clearImageGrid();

  const loading = document.getElementById('loading');
  loading.style.display = 'block';

  for (let i = 0; i < maxImages; i++) {
    const randomNumber = getRandomNumber(1, 1000);
    const prompt = `${input} ${randomNumber}`;

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/akmalinn/surabaya_monument_3',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ inputs: prompt, negative_prompt: negativePrompt }), // Include the negative prompt here
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate image puny human!');
      }

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      imageUrls.push(imgUrl);

      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = `art-${i + 1}`;
      img.onclick = () => downloadImage(imgUrl, i);
      document.getElementById('image-grid').appendChild(img);
    } catch (error) {
      console.error(error.message);
      alert('Failed to generate image!');
    }
  }

  loading.style.display = 'none';
  enableGenerateButton();

  selectedImageNumber = null;
}

document.getElementById('generate').addEventListener('click', () => {
  const input = document.getElementById('user-prompt').value;
  clearImageGrid();
  imageUrls.length = 0;
  generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
  const link = document.createElement('a');
  link.href = imgUrl;
  link.download = `image-${imageNumber + 1}.jpg`;
  link.click();
}

// Add this code after your existing JavaScript code
document.getElementById('reset').addEventListener('click', function() {
  // Reload the current page to reset it
  location.reload();
});