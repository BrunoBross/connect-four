import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}
