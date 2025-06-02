
import { pipeline } from '@huggingface/transformers';

let recognizer: any = null;

// You'll need to set your Hugging Face token here
const HF_TOKEN = 'your_hugging_face_token_here'; // Replace with your actual token

export const initializeRecognizer = async () => {
  if (!recognizer) {
    try {
      // Use the microsoft/trocr-base-handwritten model with your HF token
      recognizer = await pipeline(
        'image-to-text',
        'microsoft/trocr-base-handwritten',
        { 
          device: 'wasm',
          token: HF_TOKEN
        }
      );
    } catch (error) {
      console.error('Failed to initialize with trocr-base-handwritten, trying fallback model:', error);
      // Fallback to a simpler but more reliable model
      try {
        recognizer = await pipeline(
          'image-to-text',
          'Xenova/vit-gpt2-image-captioning',
          { device: 'wasm' }
        );
      } catch (fallbackError) {
        console.error('Fallback model also failed:', fallbackError);
        throw new Error('Unable to initialize text recognition model');
      }
    }
  }
  return recognizer;
};

export const recognizeText = async (imageFile: File): Promise<string> => {
  try {
    const recognizer = await initializeRecognizer();
    const result = await recognizer(imageFile);
    return result[0]?.generated_text || 'No text detected';
  } catch (error) {
    console.error('Error during text recognition:', error);
    throw new Error('Failed to process image');
  }
};
