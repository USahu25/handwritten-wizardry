
import { pipeline } from '@huggingface/transformers';

let recognizer: any = null;
let translator: any = null;
let summarizer: any = null;

export const initializeRecognizer = async () => {
  if (!recognizer) {
    try {
      console.log('Initializing text recognizer...');
      
      // Use the microsoft/trocr-base-printed model which has better browser support
      recognizer = await pipeline(
        'image-to-text',
        'microsoft/trocr-base-printed',
        { 
          device: 'wasm'
        }
      );
      console.log('Successfully initialized trocr-base-printed model');
    } catch (error) {
      console.error('Failed to initialize with trocr-base-printed:', error);
      // Fallback to a simpler model if the primary one fails
      try {
        console.log('Trying fallback model...');
        recognizer = await pipeline(
          'image-to-text',
          'Xenova/trocr-base-printed',
          { 
            device: 'wasm'
          }
        );
        console.log('Successfully initialized Xenova/trocr-base-printed model');
      } catch (fallbackError) {
        console.error('Fallback model also failed:', fallbackError);
        throw new Error('Unable to initialize any text recognition model.');
      }
    }
  }
  return recognizer;
};

export const initializeTranslator = async () => {
  if (!translator) {
    try {
      console.log('Initializing translator...');
      translator = await pipeline(
        'translation',
        'Xenova/nllb-200-distilled-600M',
        { 
          device: 'wasm'
        }
      );
      console.log('Successfully initialized translator model');
    } catch (error) {
      console.error('Failed to initialize translator:', error);
      throw new Error('Unable to initialize translation model.');
    }
  }
  return translator;
};

export const initializeSummarizer = async () => {
  if (!summarizer) {
    try {
      console.log('Initializing summarizer...');
      summarizer = await pipeline(
        'summarization',
        'Xenova/distilbart-cnn-6-6',
        { 
          device: 'wasm'
        }
      );
      console.log('Successfully initialized summarizer model');
    } catch (error) {
      console.error('Failed to initialize summarizer:', error);
      throw new Error('Unable to initialize summarization model.');
    }
  }
  return summarizer;
};

export const recognizeText = async (imageFile: File): Promise<string> => {
  try {
    console.log('Starting text recognition...');
    const recognizer = await initializeRecognizer();
    
    // Convert file to image URL for the model
    const imageUrl = URL.createObjectURL(imageFile);
    const result = await recognizer(imageUrl);
    
    // Clean up the object URL
    URL.revokeObjectURL(imageUrl);
    
    console.log('Recognition result:', result);
    return result[0]?.generated_text || 'No text detected';
  } catch (error) {
    console.error('Error during text recognition:', error);
    throw new Error('Failed to process image for text recognition');
  }
};

export const translateTeluguToEnglish = async (text: string): Promise<string> => {
  try {
    console.log('Starting Telugu to English translation...');
    const translator = await initializeTranslator();
    
    const result = await translator(text, {
      src_lang: 'tel_Telu',
      tgt_lang: 'eng_Latn'
    });
    
    console.log('Translation result:', result);
    return result[0]?.translation_text || text;
  } catch (error) {
    console.error('Error during translation:', error);
    // Fallback: Simple character-based translation for common Telugu words
    return translateTeluguFallback(text);
  }
};

export const summarizeText = async (text: string, language: 'english' | 'telugu' = 'english'): Promise<string> => {
  try {
    console.log(`Starting ${language} summarization...`);
    
    if (text.length < 50) {
      return text; // Too short to summarize
    }
    
    const summarizer = await initializeSummarizer();
    const result = await summarizer(text, {
      max_length: 100,
      min_length: 30,
      do_sample: false
    });
    
    console.log('Summarization result:', result);
    return result[0]?.summary_text || text;
  } catch (error) {
    console.error('Error during summarization:', error);
    // Fallback: Extract first few sentences
    return extractFirstSentences(text, 2);
  }
};

// Fallback translation function for basic Telugu words
const translateTeluguFallback = (text: string): string => {
  const teluguToEnglish: { [key: string]: string } = {
    'హలో': 'Hello',
    'నమస్కారం': 'Namaste',
    'ధన్యవాదాలు': 'Thank you',
    'క్షమించండి': 'Sorry',
    'అవును': 'Yes',
    'కాదు': 'No',
    'నీరు': 'Water',
    'అన్నం': 'Rice',
    'పేరు': 'Name',
    'ఇల్లు': 'House',
    'పని': 'Work',
    'సమయం': 'Time',
    'రోజు': 'Day',
    'రాత్రి': 'Night'
  };

  let translatedText = text;
  Object.entries(teluguToEnglish).forEach(([telugu, english]) => {
    translatedText = translatedText.replace(new RegExp(telugu, 'g'), english);
  });

  return translatedText || 'Translation not available';
};

// Fallback summarization function
const extractFirstSentences = (text: string, count: number): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.slice(0, count).join('. ') + '.';
};

export interface ProcessingResult {
  originalText: string;
  translatedText: string;
  englishSummary: string;
  teluguSummary: string;
}

export const processImageComplete = async (imageFile: File): Promise<ProcessingResult> => {
  try {
    // Step 1: Recognize text from image
    const originalText = await recognizeText(imageFile);
    
    // Step 2: Translate Telugu to English
    const translatedText = await translateTeluguToEnglish(originalText);
    
    // Step 3: Summarize in English
    const englishSummary = await summarizeText(translatedText, 'english');
    
    // Step 4: Create Telugu summary (using original text if it's in Telugu)
    const teluguSummary = await summarizeText(originalText, 'telugu');
    
    return {
      originalText,
      translatedText,
      englishSummary,
      teluguSummary
    };
  } catch (error) {
    console.error('Error in complete processing:', error);
    throw new Error('Failed to complete text processing pipeline');
  }
};
