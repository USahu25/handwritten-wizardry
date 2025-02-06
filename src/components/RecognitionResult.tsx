import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface RecognitionResultProps {
  text: string;
}

const RecognitionResult = ({ text }: RecognitionResultProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The recognized text has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recognition Result</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="transition-all duration-300"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>
      </div>
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
      </div>
    </motion.div>
  );
};

export default RecognitionResult;