import {createContext} from 'react';
import { useState } from 'react';

// create auth context
export const AuthContext = createContext();


// create auth provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [Loading, setLoading] = useState(true);


    return (
        <AuthContext.Provider value={{ user, Loading, setUser, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}