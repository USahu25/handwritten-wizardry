import React from 'react';
import { motion } from 'framer-motion';

const ProcessingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-4 p-8"
    >
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-primary/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="text-gray-600 font-medium">Processing your image...</p>
    </motion.div>
  );
};

export default ProcessingIndicator;