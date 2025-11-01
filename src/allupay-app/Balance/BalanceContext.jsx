import React, { createContext, useState, useContext, useEffect } from 'react';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
    const [balance, setBalance] = useState(() => {
        try {
            const localData = localStorage.getItem('allupay_balance');
            // Set a default balance of 50,000 if none is found
            return localData ? JSON.parse(localData) : 50000;
        } catch (error) {
            return 50000;
        }
    });

    useEffect(() => {
        localStorage.setItem('allupay_balance', JSON.stringify(balance));
    }, [balance]);

    const deductBalance = (amount) => {
        setBalance(prevBalance => prevBalance - amount);
    };

    const addBalance = (amount) => {
        setBalance(prevBalance => prevBalance + amount);
    };

    return (
        <BalanceContext.Provider value={{ balance, addBalance, deductBalance }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalance = () => useContext(BalanceContext);