import React, { useState, useEffect } from 'react';
import { Database, Server, Coffee, Zap, Clock, CheckCircle, FileText } from 'lucide-react';

const loadingMessages = [
  { icon: Coffee, message: "Pour yourself a coffee ☕, this might take a moment..." },
  { icon: Database, message: "Fetching table schemas… breathe deeply…" },
  { icon: Zap, message: "Almost there… lightning fast processing!" },
  { icon: Server, message: "Talking to Confluence… stay tuned!" },
  { icon: Coffee, message: "Almost done! Grab a snack if you like…" },
  { icon: Clock, message: "Counting rows… hope you have good posture!" },
  { icon: CheckCircle, message: "Data elves are working their magic…" },
  { icon: Database, message: "Polishing your tables… shine incoming!" },
  { icon: Zap, message: "In Linux, it wouldn't take so long!" }
];

export const LoadingState: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Rotate messages every 8 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 8000);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 3;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentMessage = loadingMessages[currentMessageIndex];
  const IconComponent = currentMessage.icon;

  return (
    <div className="glass-card rounded-2xl p-8 text-center slide-in-up">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center pulse-glow">
            <IconComponent className="w-10 h-10 text-primary" />
          </div>
          
          {/* Rotating rings around icon */}
          <div className="absolute inset-0 w-20 h-20 border-2 border-primary/30 rounded-full animate-spin" 
               style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute inset-[-8px] w-24 h-24 border border-secondary/20 rounded-full animate-spin" 
               style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-secondary rounded-full"></div>
          </div>
        </div>

        {/* Loading Title */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Syncing Database</h3>
          <p className="text-lg text-primary font-medium">Processing your schemas...</p>
        </div>

        {/* Rotating Message */}
        <div className="min-h-[3rem] flex items-center justify-center">
          <p 
            key={currentMessageIndex}
            className="text-muted-foreground italic max-w-md text-center slide-in-up"
          >
            {currentMessage.message}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full smooth-transition glow-effect"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Processing Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
          <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Connected</div>
              <div className="text-xs text-muted-foreground">Database connected</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center pulse-glow">
              <Database className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Analyzing</div>
              <div className="text-xs text-muted-foreground">Reading schemas</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
            <div className="w-8 h-8 bg-muted/40 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-muted-foreground">Documenting</div>
              <div className="text-xs text-muted-foreground">Updating Confluence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};