import clsx from "clsx";
import turnBackgroundRed from "../img/turn-background-red.svg";
import turnBackgroundYellow from "../img/turn-background-yellow.svg";
import { useEffect, useState } from "react";

interface TurnBackgroundProps {
  currentPlayer: number;
  isGameRunning: boolean;
  switchPlayer: () => void;
}

const defaultTime = 30;

export default function TurnBackground(props: TurnBackgroundProps) {
  const { currentPlayer, isGameRunning, switchPlayer } = props;
  const [timer, setTimer] = useState(defaultTime);

  useEffect(() => {
    setTimer(defaultTime);
  }, [currentPlayer]);

  useEffect(() => {
    if (isGameRunning) {
      const interval = setInterval(() => {
        if (timer - 1 < 0) {
          setTimer(defaultTime);
          return switchPlayer();
        }

        setTimer((prevState) => prevState - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isGameRunning, timer, switchPlayer]);

  return (
    <div className="absolute flex flex-col items-center justify-center">
      <img
        src={currentPlayer === 1 ? turnBackgroundRed : turnBackgroundYellow}
        alt="turnBackground"
        className="items-center justify-center"
        width={170}
      />
      <div className="flex flex-col absolute items-center justify-center">
        <p
          className={clsx("font-space font-bold uppercase transition-colors", {
            "text-white": currentPlayer === 1,
            "text-black": currentPlayer === 2,
          })}
        >
          Player {currentPlayer}'s turn
        </p>
        <h1
          className={clsx("font-space font-bold text-6xl transition-colors", {
            "text-white": currentPlayer === 1,
            "text-black": currentPlayer === 2,
          })}
        >
          {timer}s
        </h1>
      </div>
    </div>
  );
}
