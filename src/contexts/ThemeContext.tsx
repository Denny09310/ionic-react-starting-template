import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useLocalStorage, useMedia, useUpdateEffect } from "react-use";

type Theme = "dark" | "light";
type EmptyFunction = () => void;

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: EmptyFunction;
}

const ThemeContext = createContext(undefined as unknown as ThemeContextProps);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  defaultTheme = "dark",
}) => {
  const prefersDark = useMedia("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useLocalStorage("theme", defaultTheme);

  useEffect(() => {
    const manifest = document.head.querySelector("link[rel='manifest']")!;

    manifest.setAttribute("href", `/manifest(${theme}).json`);
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useUpdateEffect(() => setThemeInternal(prefersDark), [prefersDark]);

  const toggleTheme = () => setThemeInternal(!(theme === "dark"));

  const setThemeInternal = (isDark: boolean) =>
    setTheme(isDark ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme: theme!, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
