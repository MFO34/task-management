import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Context oluştur
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Component mount olduğunda localStorage'dan user'ı yükle
  useEffect(() => {
    const loadUser = () => {
      const savedUser = authService.getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Login function
   * @param {string} email 
   * @param {string} password 
   */
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      
      // Token ve user'ı kaydet
      authService.saveAuth(data.token, {
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });

      // State'i güncelle
      setUser({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  /**
   * Register function
   * @param {string} email 
   * @param {string} password 
   * @param {string} fullName 
   */
  const register = async (email, password, fullName) => {
    try {
      const data = await authService.register({ email, password, fullName });
      
      // Token ve user'ı kaydet
      authService.saveAuth(data.token, {
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });

      // State'i güncelle
      setUser({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Context value
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook: useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;