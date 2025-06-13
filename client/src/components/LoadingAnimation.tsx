import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

interface LoadingAnimationProps {
  onComplete: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Nation Auth");
  const [isVisible, setIsVisible] = useState(true);

  const loadingSteps = [
    "Initializing Nation Auth",
    "Loading Security Protocols",
    "Establishing Secure Connection",
    "Authenticating Systems",
    "Finalizing Setup"
  ];

  useEffect(() => {
    const duration = 2800; // Faster, more dynamic
    const steps = 100;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      // Smooth easing curve for progress
      const easeProgress = 1 - Math.pow(1 - (currentStep / steps), 3);
      const newProgress = easeProgress * 100;
      setProgress(newProgress);

      // Update loading text based on progress with better timing
      const textIndex = Math.min(
        Math.floor((newProgress / 100) * loadingSteps.length),
        loadingSteps.length - 1
      );
      setLoadingText(loadingSteps[textIndex]);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 300);
        }, 300);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/98 to-background backdrop-blur-md">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/20 to-primary/5 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Sparkle particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-primary rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Enhanced logo with multiple animation layers */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '1s', animationDelay: '1s' }} />
          </div>
          <div className="relative flex items-center justify-center animate-spin-slow">
            <Shield className="w-20 h-20 text-primary drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.5))' }} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
          Nation Auth
        </h1>
        
        {/* Subtitle */}
        <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Enterprise Authentication Platform
        </p>

        {/* Enhanced progress bar */}
        <div className="mb-6">
          <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden border border-border/30 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-500 ease-out relative shadow-lg"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 15px rgba(220, 38, 38, 0.6)'
              }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse opacity-75" 
                   style={{ 
                     animation: 'shimmer 1.5s infinite',
                     transform: `translateX(-100%)`,
                     animationFillMode: 'forwards'
                   }} />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 rounded-full blur-sm" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium">
            <span className="text-primary/70">0%</span>
            <span className="font-bold text-primary animate-pulse">{Math.round(progress)}%</span>
            <span className="text-primary/70">100%</span>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-sm text-muted-foreground animate-pulse">
          {loadingText}
        </p>

        {/* Floating dots */}
        <div className="flex justify-center space-x-1 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
