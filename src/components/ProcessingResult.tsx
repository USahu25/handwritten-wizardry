
import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ProcessingResult as ProcessingResultType, ProcessingMode } from '@/utils/textRecognition';

interface ProcessingResultProps {
  result: ProcessingResultType;
  mode: ProcessingMode;
}

const ProcessingResult = ({ result, mode }: ProcessingResultProps) => {
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = React.useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [section]: true }));
      toast({
        title: "Copied to clipboard",
        description: `${section} has been copied to your clipboard.`,
      });
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [section]: false }));
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openExternalTranslation = () => {
    if (result.externalTranslationUrl) {
      window.open(result.externalTranslationUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Original Text - Always shown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Original Telugu Text</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(result.originalText, 'Original text')}
              className="transition-all duration-300"
            >
              {copiedStates['original'] ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copiedStates['original'] ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap font-telugu text-lg leading-relaxed">
            {result.originalText}
          </p>
        </CardContent>
      </Card>

      {/* Translation Results - Show for translate and summarize modes */}
      {(mode === 'translate' || mode === 'summarize') && result.translatedText && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>English Translation</CardTitle>
                {mode === 'translate' && (
                  <CardDescription>
                    Internal translation with option for external service
                  </CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.translatedText!, 'Translation')}
                  className="transition-all duration-300"
                >
                  {copiedStates['translation'] ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copiedStates['translation'] ? 'Copied!' : 'Copy'}
                </Button>
                {mode === 'translate' && result.externalTranslationUrl && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={openExternalTranslation}
                    className="transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    External Translation
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {result.translatedText}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summaries - Only for summarize mode */}
      {mode === 'summarize' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.englishSummary && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>English Summary</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.englishSummary!, 'English summary')}
                    className="transition-all duration-300"
                  >
                    {copiedStates['englishSummary'] ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedStates['englishSummary'] ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {result.englishSummary}
                </p>
              </CardContent>
            </Card>
          )}

          {result.teluguSummary && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Telugu Summary</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.teluguSummary!, 'Telugu summary')}
                    className="transition-all duration-300"
                  >
                    {copiedStates['teluguSummary'] ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedStates['teluguSummary'] ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap font-telugu text-lg leading-relaxed">
                  {result.teluguSummary}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProcessingResult;
