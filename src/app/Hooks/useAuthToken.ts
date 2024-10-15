import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

const useAuthToken = () => {
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  const [token, setToken] = useState<string | null>(getToken());
  const [userName, setUserName] = useState<string | null>(null);

  const updateToken = (newToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
    }
  };

  const removeToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      setToken(null);
      setUserName(null); // Clear userName when token is removed
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<{ 
          [key: string]: any;
          sub?: string;  
          ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]: string;
          jti?: string; 
          exp?: number; 
          iss?: string; 
          aud?: string; 
        }>(token);

        // Access the name using the specific claim key
        const nameClaimKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        setUserName(decodedToken[nameClaimKey] || decodedToken.sub || null);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, [token]);

  return { token, userName, updateToken, removeToken };
};

export default useAuthToken;
