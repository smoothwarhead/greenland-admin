import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.scss";
// import { BrowserRouter } from "react-router-dom";
// import Providers from "./app/Providers";
import App from "./App";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    
        <App />
      
  </StrictMode>
);
