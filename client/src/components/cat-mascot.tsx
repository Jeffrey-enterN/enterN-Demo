import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Heart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMascot } from '@/contexts/mascot-context';
import { useAuth } from '@/contexts/auth-context';

// Import cat images
// Note: We'll use relative paths to the images in client/src/assets/mascot
import happyCat from '../assets/mascot/670b1b66-f345-4aec-8f28-5de5fe39afb4.png';
import sadCat from '../assets/mascot/29dbf67b-ac39-4647-ba29-e6f484564529.png';
import cryingCat from '../assets/mascot/42.png';
import peekingCat from '../assets/mascot/40.png';
import angryCat from '../assets/mascot/43.png';
import loveCat from '../assets/mascot/44.png';

// Emotional support messages
const supportMessages = [
  {
    trigger: 'rejected',
    message: "Don't worry about that rejection! It just means that wasn't the right fit for you. There are many more opportunities to explore!",
    image: sadCat,
  },
  {
    trigger: 'matched',
    message: "Congratulations on your match! That's fantastic news! Remember to prepare well before you reach out.",
    image: happyCat,
  },
  {
    trigger: 'nervous',
    message: "It's completely normal to feel nervous during your job search. Take it one step at a time, and remember that each interaction is a learning opportunity.",
    image: cryingCat,
  },
  {
    trigger: 'interview',
    message: "Got an interview coming up? You've got this! Remember to research the company, prepare examples of your work, and be yourself.",
    image: peekingCat,
  },
  {
    trigger: 'frustration',
    message: "Job searching can be frustrating, but don't give up! Take a short break, do something you enjoy, and come back with fresh energy.",
    image: angryCat,
  },
  {
    trigger: 'excited',
    message: "Your enthusiasm is contagious! Keep that positive energy as you continue your job search journey!",
    image: loveCat,
  },
  {
    trigger: 'default',
    message: "I'm your emotional support cat during your job search! Let me know how you're feeling, and I'll be here for you.",
    image: peekingCat,
  },
];

// Random encouragement messages for periodic display
const randomMessages = [
  "Keep going! You're doing great in your job search!",
  "Remember to take breaks during your job search. Self-care is important!",
  "Each application brings you one step closer to your dream job!",
  "You have unique skills and talents that the right employer will value!",
  "Don't compare your job search journey to others. Your path is unique!",
  "Rejection is just redirection to something better suited for you.",
  "Your efforts today are building your success tomorrow!",
];

interface CatMascotProps {
  className?: string;
  triggerType?: string;
  user?: any;
}

export function CatMascot({ className, triggerType = 'default', user }: CatMascotProps) {
  const { mood, isVisible, currentMessage: contextMessage } = useMascot();
  const { user: authUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [mascotImage, setMascotImage] = useState(peekingCat);

  // Select user from props or auth context
  const userData = user || authUser;

  // Find the appropriate message based on mood or trigger type
  useEffect(() => {
    const effectiveTrigger = mood !== 'default' ? mood : triggerType;
    const support = supportMessages.find(msg => msg.trigger === effectiveTrigger) || 
                    supportMessages.find(msg => msg.trigger === 'default');
    
    if (support) {
      setCurrentMessage(contextMessage || support.message);
      setMascotImage(support.image);
    }
  }, [mood, triggerType, contextMessage]);

  // Random encouragement every 10 minutes if the component is mounted
  useEffect(() => {
    const encouragementTimer = setInterval(() => {
      if (!isOpen && Math.random() > 0.7) { // 30% chance to show a random message
        const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        setCurrentMessage(randomMsg);
        setIsOpen(true);
        
        // Auto-close after 7 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 7000);
      }
    }, 600000); // 10 minutes

    return () => clearInterval(encouragementTimer);
  }, [isOpen]);

  // Handle chat interaction
  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // When opening chat, show default message
      const defaultSupport = supportMessages.find(msg => msg.trigger === 'default');
      if (defaultSupport) {
        setCurrentMessage(defaultSupport.message);
      }
    }
  };

  // Access emotional support message
  const handleEmotionalSupport = (feeling: string) => {
    const support = supportMessages.find(msg => msg.trigger === feeling) || 
                    supportMessages.find(msg => msg.trigger === 'default');
    
    if (support) {
      setCurrentMessage(support.message);
      setMascotImage(support.image);
    }
  };

  // User greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userData?.firstName || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Mascot chat bubble */}
      {isOpen && !isChatOpen && (
        <div className="mb-3 max-w-xs animate-fade-in transform transition-all duration-300">
          <Card className="border-[#5ce1e6] shadow-md">
            <CardContent className="p-3 pt-3 flex items-start gap-2">
              <img src={mascotImage} alt="Cat mascot" className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <p className="text-sm">{currentMessage}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 -mt-1 -mr-1" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat interface */}
      {isChatOpen && (
        <div className="mb-3 w-80 animate-fade-in transform transition-all duration-300">
          <Card className="border-[#5ce1e6] shadow-md">
            <div className="p-3 border-b bg-[#e3fcfd] rounded-t-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={peekingCat} alt="Cat mascot" className="w-8 h-8 object-contain" />
                <h3 className="font-medium">Job Search Buddy</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setIsChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-3 h-80 flex flex-col gap-3 overflow-y-auto">
              <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                <p className="text-sm">{getGreeting()} I'm your emotional support cat during your job search! How are you feeling today?</p>
              </div>
              
              {currentMessage && (
                <div className="flex items-start gap-2 self-end">
                  <div className="bg-[#5ce1e6] text-white rounded-lg p-2 max-w-[80%]">
                    <p className="text-sm">{currentMessage}</p>
                  </div>
                  <img src={mascotImage} alt="Cat mascot" className="w-8 h-8 object-contain" />
                </div>
              )}
            </CardContent>
            <div className="p-3 border-t">
              <div className="flex flex-wrap gap-2 mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleEmotionalSupport('nervous')}
                >
                  I'm nervous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleEmotionalSupport('frustrated')}
                >
                  Feeling frustrated
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleEmotionalSupport('excited')}
                >
                  I'm excited!
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleEmotionalSupport('interview')}
                >
                  Interview tips
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Mascot toggle button */}
      <div className="flex gap-2">
        <Button 
          size="icon" 
          className={cn(
            "h-12 w-12 rounded-full shadow-md transition-all hover:scale-110", 
            isOpen || isChatOpen ? "bg-[#ff66c4] hover:bg-[#ff50bb]" : "bg-[#5ce1e6] hover:bg-[#4ad7dc]"
          )}
          onClick={() => {
            if (isChatOpen) {
              setIsChatOpen(false);
            } else {
              setIsOpen(!isOpen);
            }
          }}
        >
          {isChatOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <img 
              src={peekingCat} 
              alt="Cat mascot" 
              className="h-10 w-10 object-contain" 
            />
          )}
        </Button>
        
        {!isChatOpen && (
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-md transition-all hover:scale-110 bg-[#ff66c4] hover:bg-[#ff50bb]"
            onClick={handleChatToggle}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}