import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/components/ImageUpload';
import RecognitionResult from '@/components/RecognitionResult';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import { recognizeText } from '@/utils/textRecognition';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = async (file: File) => {
    try {
      setIsProcessing(true);
      setPreviewUrl(URL.createObjectURL(file));
      
      const text = await recognizeText(file);
      setRecognizedText(text);
      
      toast({
        title: "Success",
        description: "Text recognition completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
      setRecognizedText(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full"
          >
            AI-Powered
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Handwritten Text Recognition
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Upload an image of handwritten text and let AI convert it to digital text
          </p>
        </motion.div>

        <div className="space-y-8">
          <ImageUpload onImageSelect={handleImageSelect} isProcessing={isProcessing} />
          
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-lg overflow-hidden shadow-sm border border-gray-200"
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto max-h-[400px] object-contain bg-white"
              />
            </motion.div>
          )}

          <AnimatePresence>
            {isProcessing && <ProcessingIndicator />}
          </AnimatePresence>

          {recognizedText && !isProcessing && (
            <RecognitionResult text={recognizedText} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;