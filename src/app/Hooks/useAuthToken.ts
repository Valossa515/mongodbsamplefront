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
  const [roles, setRoles] = useState<string[]>([]);
  const [isTokenDecoded, setIsTokenDecoded] = useState(false);

  const updateToken = (newToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setIsTokenDecoded(false);
    }
  };

  const removeToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      setToken(null);
      setUserName(null);
      setRoles([]);
      setIsTokenDecoded(false);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<{ [key: string]: any }>(token);
        const nameClaimKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        const roleClaimKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        setUserName(decodedToken[nameClaimKey] || decodedToken.sub || null);
        setRoles(Array.isArray(decodedToken[roleClaimKey]) ? decodedToken[roleClaimKey] : [decodedToken[roleClaimKey]]);
      } catch (error) {
        console.error("Failed to decode token:", error);
      } finally {
        setIsTokenDecoded(true); // Certifique-se de definir isto mesmo em caso de erro
      }
    } else {
      setIsTokenDecoded(true); // Caso não haja token
    }
  }, [token]);

  return {
    token,
    roles,
    userName,
    isTokenDecoded,
    updateToken,
    removeToken
  };
};

export default useAuthToken;
