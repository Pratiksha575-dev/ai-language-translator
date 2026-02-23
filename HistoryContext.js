import React, { createContext, useState } from 'react';

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  const addToHistory = (source, translated, sourceLang, targetLang) => {
    const time = new Date().toLocaleString();
    setHistory(prev => [
      { id: Date.now(), source, translated, sourceLang, targetLang, time },
      ...prev
    ]);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};