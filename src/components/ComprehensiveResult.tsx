
import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileText, Globe, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ProcessingResult } from '@/utils/textRecognition';

interface ComprehensiveResultProps {
  result: ProcessingResult;
}

const ComprehensiveResult = ({ result }: ComprehensiveResultProps) => {
  const { toast } = useToast();
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast({
        title: "Copied to clipboard",
        description: `${section} has been copied to your clipboard.`,
      });
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const ResultSection = ({ 
    title, 
    content, 
    icon: Icon, 
    sectionKey 
  }: { 
    title: string; 
    content: string; 
    icon: React.ElementType; 
    sectionKey: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(content, title)}
          className="transition-all duration-300"
        >
          {copiedSection === sectionKey ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copiedSection === sectionKey ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Complete Analysis Results</h2>
        <p className="text-gray-600 mt-2">Text recognition, translation, and summarization</p>
      </div>

      <div className="grid gap-6">
        <ResultSection
          title="Digitized Text (Original)"
          content={result.originalText}
          icon={FileText}
          sectionKey="original"
        />
        
        <ResultSection
          title="English Translation"
          content={result.translatedText}
          icon={Globe}
          sectionKey="translation"
        />
        
        <ResultSection
          title="English Summary"
          content={result.englishSummary}
          icon={BookOpen}
          sectionKey="englishSummary"
        />
        
        <ResultSection
          title="Telugu Summary"
          content={result.teluguSummary}
          icon={BookOpen}
          sectionKey="teluguSummary"
        />
      </div>
    </motion.div>
  );
};

export default ComprehensiveResult;
