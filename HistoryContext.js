import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  /* LOAD FROM STORAGE */
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem("history");
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.log("Load error", e);
      }
    };
    loadData();
  }, []);

  /* SAVE TO STORAGE */
  useEffect(() => {
    AsyncStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const addHistory = (entry) => {
    setHistory(prev => [entry, ...prev]);
  };

  return (
    <HistoryContext.Provider value={{ history, addHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};