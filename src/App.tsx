import "./App.css";

import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import AuthProvider from "./contexts/authContext";

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/game/public/:roomId" element={<Game />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}
