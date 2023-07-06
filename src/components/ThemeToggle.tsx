import { useTheme } from "@/contexts/ThemeContext";
import { IonToggle } from "@ionic/react";
import React from "react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IonToggle checked={theme === "dark"} onIonChange={toggleTheme}>
      Dark Mode
    </IonToggle>
  );
};

export default ThemeToggle;
