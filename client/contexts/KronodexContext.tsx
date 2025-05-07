import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

// Define the shape of a Kronodex entry (similar to artifact data)
interface KronodexEntry {
  id: string; // Use artifact title or a unique identifier
  title: string;
  period: string;
  description: string;
  significance: string;
  location: string; // Added location field
  imageUrl?: string; // Store the image URI used during  scan
  scanDate: Date;
}

// Define the context shape
interface KronodexContextType {
  kronodexItems: KronodexEntry[];
  addItemToKronodex: (itemData: Omit<KronodexEntry, 'scanDate'>) => { success: boolean; message: string; xpEarned?: number };
  isItemInKronodex: (itemId: string) => boolean;
}

// Create the context with a default value
const KronodexContext = createContext<KronodexContextType | undefined>(undefined);

// Create the provider component
export const KronodexProvider = ({ children }: { children: ReactNode }) => {
  const [kronodexItems, setKronodexItems] = useState<KronodexEntry[]>([]);
  const KRONODEX_SAVE_XP = 25; // XP earned for saving a new item

  const isItemInKronodex = useCallback((itemId: string): boolean => {
    return kronodexItems.some(item => item.id === itemId);
  }, [kronodexItems]);

  const addItemToKronodex = useCallback((itemData: Omit<KronodexEntry, 'scanDate'>): { success: boolean; message: string; xpEarned?: number } => {
    if (isItemInKronodex(itemData.id)) {
      return { success: false, message: `${itemData.title} is already in your Kronodex.` };
    }

    const newItem: KronodexEntry = {
      ...itemData,
      scanDate: new Date(),
    };

    setKronodexItems(prevItems => [...prevItems, newItem].sort((a, b) => a.title.localeCompare(b.title))); // Keep sorted
    console.log('Item added to Kronodex:', newItem);
    // TODO: Persist kronodexItems to AsyncStorage or backend

    // TODO: Update user's total XP globally (e.g., in a UserContext)

    return {
      success: true,
      message: `${itemData.title} added to Kronodex! +${KRONODEX_SAVE_XP} XP Earned!`,
      xpEarned: KRONODEX_SAVE_XP
    };
  }, [kronodexItems, isItemInKronodex]);

  return (
    <KronodexContext.Provider value={{ kronodexItems, addItemToKronodex, isItemInKronodex }}>
      {children}
    </KronodexContext.Provider>
  );
};

// Create a hook for easy consumption
export const useKronodex = () => {
  const context = useContext(KronodexContext);
  if (context === undefined) {
    throw new Error('useKronodex must be used within a KronodexProvider');
  }
  return context;
};
