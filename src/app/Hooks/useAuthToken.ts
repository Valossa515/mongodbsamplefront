import { useState, useEffect } from 'react';

const useAuthToken = () => {
    const getToken = () => localStorage.getItem('authToken');
  
    const [token, setToken] = useState(getToken());
  
    const updateToken = (newToken: string) => {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
    };
  
    const removeToken = () => {
      localStorage.removeItem('authToken');
      setToken(null);
    };
  
    useEffect(() => {
      const handleStorageChange = () => {
        const updatedToken = getToken();
        if (updatedToken !== token) {
          setToken(updatedToken);
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, [token]);
  
    return { token, updateToken, removeToken };
};

export default useAuthToken;
