import React, { createContext, useState } from 'react';

export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');

    return (
        <EmailContext.Provider value={{ email, setEmail, id, setId }}>
            {children}
        </EmailContext.Provider>
    );
};
