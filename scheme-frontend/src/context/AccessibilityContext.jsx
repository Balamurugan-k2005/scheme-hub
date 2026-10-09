import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext(undefined);

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseFloat(saved) : 1.0;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Apply font size factor dynamically to the HTML root element
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    // Set Bootstrap 5.3 & custom theme attributes on HTML root
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 0.15, 1.45));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 0.15, 0.85));
  const resetFontSize = () => setFontSize(1.0);
  
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDarkMode = theme === 'dark';

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        theme,
        isDarkMode,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
