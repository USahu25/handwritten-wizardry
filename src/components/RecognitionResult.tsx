
import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface RecognitionResultProps {
  text: string;
  confidence?: number;
  onRetry?: () => void;
  isProcessing?: boolean;
}

const RecognitionResult = ({ text, confidence, onRetry, isProcessing = false }: RecognitionResultProps) => {
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

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (conf: number) => {
    if (conf >= 0.8) return 'High';
    if (conf >= 0.6) return 'Medium';
    return 'Low';
  };

  const improveAccuracy = () => {
    window.open('https://www.easyhindityping.com/telugu-to-english-translation', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Telugu Text Recognition
                {confidence !== undefined && (
                  <span className={`text-sm font-normal ${getConfidenceColor(confidence)}`}>
                    ({getConfidenceText(confidence)} Confidence)
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Digitized Telugu text from your image
                {confidence !== undefined && (
                  <span className="ml-2">
                    • Accuracy: {Math.round(confidence * 100)}%
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  disabled={isProcessing}
                  className="transition-all duration-300"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? 'Processing...' : 'Retry'}
                </Button>
              )}
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
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap font-telugu text-lg leading-relaxed">
                {text || 'No text recognized. Please try with a clearer image.'}
              </p>
            </div>
            
            {/* Accuracy improvement suggestions */}
            {(confidence === undefined || confidence < 0.8) && text && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Improve Recognition Accuracy
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  For better results, try these tips:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 mb-3">
                  <li>• Ensure good lighting and clear image quality</li>
                  <li>• Use images with high contrast text</li>
                  <li>• Avoid blurry or skewed text</li>
                  <li>• Try cropping to focus on the text area</li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={improveAccuracy}
                  className="transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Verify with External Tool
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecognitionResult;
