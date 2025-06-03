
import React from 'react';
import { motion } from 'framer-motion';

const ProcessingIndicator = () => {
  const steps = [
    'Analyzing image content...',
    'Extracting Telugu text...',
    'Translating to English...',
    'Creating summaries...'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-6 p-8"
    >
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-primary/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-gray-600 font-medium">Processing your Telugu text...</p>
        <div className="space-y-1">
          {steps.map((step, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: index * 0.3 
              }}
              className="text-sm text-gray-500"
            >
              {step}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessingIndicator;
