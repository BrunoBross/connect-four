import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import ReactModal from "react-modal";
import GameProvider from "./contexts/gameContext";
import AuthProvider from "./contexts/authContext";

ReactModal.setAppElement("#root");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <GameProvider>
        <Router>
          <App />
        </Router>
      </GameProvider>
    </AuthProvider>
  </React.StrictMode>
);
