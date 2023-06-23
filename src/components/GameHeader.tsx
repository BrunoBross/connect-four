import { Link } from "react-router-dom";
import logo from "../img/logo.svg";

interface GameHeaderProps {
  resetGame: () => void;
}

export default function GameHeader(props: GameHeaderProps) {
  const { resetGame } = props;

  return (
    <div className="flex w-[40rem] justify-between items-center">
      <Link
        className="flex items-center uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink transition-colors"
        to="/"
      >
        Menu
      </Link>
      <img src={logo} alt="logo" />
      <button
        className="uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink  transition-colors"
        onClick={resetGame}
      >
        Restart
      </button>
    </div>
  );
}
