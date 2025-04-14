import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type MascotMood = 'default' | 'happy' | 'sad' | 'nervous' | 'excited' | 'frustrated' | 'matched' | 'rejected' | 'interview';

interface MascotContextType {
  mood: MascotMood;
  setMood: (mood: MascotMood) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  showMessage: (message: string, mood?: MascotMood, autoHide?: boolean) => void;
  currentMessage: string | null;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export function MascotProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<MascotMood>('default');
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  // Show a message from the mascot
  const showMessage = (message: string, newMood?: MascotMood, autoHide = true) => {
    if (newMood) {
      setMood(newMood);
    }
    
    setCurrentMessage(message);
    
    // Auto-hide after 7 seconds if autoHide is true
    if (autoHide) {
      setTimeout(() => {
        setCurrentMessage(null);
      }, 7000);
    }
  };

  // Store preferences in localStorage
  useEffect(() => {
    // Load visibility preference
    const storedVisibility = localStorage.getItem('mascotVisible');
    if (storedVisibility !== null) {
      setIsVisible(storedVisibility === 'true');
    }
  }, []);

  // Update localStorage when visibility changes
  useEffect(() => {
    localStorage.setItem('mascotVisible', isVisible.toString());
  }, [isVisible]);

  return (
    <MascotContext.Provider 
      value={{ 
        mood, 
        setMood, 
        isVisible, 
        setIsVisible, 
        showMessage,
        currentMessage 
      }}
    >
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error('useMascot must be used within a MascotProvider');
  }
  return context;
}