import App from "@/App";
import { store } from "@/app/store";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);
