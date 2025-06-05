
import React from 'react';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Languages, FileSearch } from 'lucide-react';

export type ProcessingMode = 'digitize' | 'translate' | 'summarize';

interface ProcessingModeSelectorProps {
  selectedMode: ProcessingMode;
  onModeChange: (mode: ProcessingMode) => void;
  disabled?: boolean;
}

const ProcessingModeSelector = ({ selectedMode, onModeChange, disabled = false }: ProcessingModeSelectorProps) => {
  const modes = [
    {
      id: 'digitize' as ProcessingMode,
      title: 'Digitize Text',
      description: 'Extract and convert Telugu text to digital format',
      icon: FileText
    },
    {
      id: 'translate' as ProcessingMode,
      title: 'Translate to English',
      description: 'Convert Telugu text to English using external translation service',
      icon: Languages
    },
    {
      id: 'summarize' as ProcessingMode,
      title: 'Summarize Text',
      description: 'Generate concise summaries in both Telugu and English',
      icon: FileSearch
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle>Select Processing Mode</CardTitle>
          <CardDescription>
            Choose how you want to process your Telugu text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedMode}
            onValueChange={onModeChange}
            disabled={disabled}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div key={mode.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={mode.id} id={mode.id} />
                  <Label
                    htmlFor={mode.id}
                    className={`flex-1 cursor-pointer p-4 rounded-lg border transition-all
                      ${selectedMode === mode.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-primary/50'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 mt-1 text-primary" />
                      <div>
                        <div className="font-medium text-sm">{mode.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{mode.description}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProcessingModeSelector;
