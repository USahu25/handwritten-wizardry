
import { pipeline } from '@huggingface/transformers';

let recognizer: any = null;
let translator: any = null;
let indicTranslator: any = null;

// Your Hugging Face token
const HF_TOKEN = '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';

export const initializeRecognizer = async () => {
  if (!recognizer) {
    try {
      console.log('Initializing text recognizer with HF token...');
      
      // Use the microsoft/trocr-base-handwritten model with proper auth
      recognizer = await pipeline(
        'image-to-text',
        'microsoft/trocr-base-handwritten',
        { 
          device: 'wasm',
          token: HF_TOKEN
        }
      );
      console.log('Successfully initialized trocr-base-handwritten model');
    } catch (error) {
      console.error('Failed to initialize with trocr-base-handwritten:', error);
      throw new Error('Unable to initialize handwritten text recognition model. Please check your Hugging Face token.');
    }
  }
  return recognizer;
};

export const initializeTranslator = async () => {
  if (!translator) {
    try {
      console.log('Initializing IndicBART translator...');
      
      translator = await pipeline(
        'text2text-generation',
        'ai4bharat/indicbart',
        { 
          device: 'wasm',
          token: HF_TOKEN
        }
      );
      console.log('Successfully initialized IndicBART model');
    } catch (error) {
      console.error('Failed to initialize IndicBART translator:', error);
      throw new Error('Unable to initialize IndicBART translation model.');
    }
  }
  return translator;
};

export const initializeIndicTranslator = async () => {
  if (!indicTranslator) {
    try {
      console.log('Initializing IndicTrans2 translator...');
      
      indicTranslator = await pipeline(
        'translation',
        'ai4bharat/indictrans2-indic-en-1B',
        { 
          device: 'wasm',
          token: HF_TOKEN
        }
      );
      console.log('Successfully initialized IndicTrans2 model');
    } catch (error) {
      console.error('Failed to initialize IndicTrans2 translator:', error);
      throw new Error('Unable to initialize IndicTrans2 translation model.');
    }
  }
  return indicTranslator;
};

export const recognizeText = async (imageFile: File): Promise<string> => {
  try {
    console.log('Starting text recognition...');
    const recognizer = await initializeRecognizer();
    const result = await recognizer(imageFile);
    console.log('Recognition result:', result);
    return result[0]?.generated_text || 'No text detected';
  } catch (error) {
    console.error('Error during text recognition:', error);
    throw new Error('Failed to process image for text recognition');
  }
};

export const translateWithIndicBART = async (text: string, targetLanguage: string = 'en'): Promise<string> => {
  try {
    console.log('Starting IndicBART translation...');
    const translator = await initializeTranslator();
    const result = await translator(`Translate to ${targetLanguage}: ${text}`);
    console.log('Translation result:', result);
    return result[0]?.generated_text || 'Translation failed';
  } catch (error) {
    console.error('Error during IndicBART translation:', error);
    throw new Error('Failed to translate text with IndicBART');
  }
};

export const translateWithIndicTrans2 = async (text: string): Promise<string> => {
  try {
    console.log('Starting IndicTrans2 translation...');
    const translator = await initializeIndicTranslator();
    const result = await translator(text);
    console.log('IndicTrans2 result:', result);
    return result[0]?.translation_text || 'Translation failed';
  } catch (error) {
    console.error('Error during IndicTrans2 translation:', error);
    throw new Error('Failed to translate text with IndicTrans2');
  }
};
