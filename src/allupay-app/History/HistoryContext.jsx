import React, { createContext, useState, useContext, useEffect } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState(() => {
        try {
            const localData = localStorage.getItem('allupay_history');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('allupay_history', JSON.stringify(history));
    }, [history]);

    const addTransaction = (transaction) => {
        const newTransaction = { 
            ...transaction, 
            id: transaction.transactionId ? transaction.transactionId.toString() : crypto.randomUUID(), // Use txId if available, otherwise a UUID
            date: new Date().toISOString(), 
            status: 'Completed' 
        };
        setHistory(prevHistory => [newTransaction, ...prevHistory]);
    };

    return (
        <HistoryContext.Provider value={{ history, setHistory, addTransaction }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => useContext(HistoryContext);