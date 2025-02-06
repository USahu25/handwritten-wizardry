import { pipeline } from '@huggingface/transformers';

let recognizer: any = null;

export const initializeRecognizer = async () => {
  if (!recognizer) {
    recognizer = await pipeline(
      'image-to-text',
      'microsoft/trocr-base-handwritten',
      { device: 'cpu' }
    );
  }
  return recognizer;
};

export const recognizeText = async (imageFile: File): Promise<string> => {
  try {
    const recognizer = await initializeRecognizer();
    const result = await recognizer(imageFile);
    return result[0].generated_text || 'No text detected';
  } catch (error) {
    console.error('Error during text recognition:', error);
    throw new Error('Failed to process image');
  }
};