
import { pipeline } from '@huggingface/transformers';

let recognizer: any = null;

export const initializeRecognizer = async () => {
  if (!recognizer) {
    try {
      // Use 'wasm' instead of 'cpu' as it's supported in browser environments
      recognizer = await pipeline(
        'image-to-text',
        'microsoft/trocr-base-handwritten',
        { device: 'wasm' }
      );
    } catch (error) {
      console.error('Failed to initialize with trocr-base-handwritten, trying fallback model:', error);
      // Fallback to a more basic model if the handwritten one fails
      try {
        recognizer = await pipeline(
          'image-to-text',
          'nlpconnect/vit-gpt2-image-captioning',
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
