import "./App.css";

import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/game/:type" element={<Game />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
