import { motion } from "framer-motion";

import clsx from "clsx";
import turnBackgroundRed from "../../img/turn-background-red.svg";
import turnBackgroundYellow from "../../img/turn-background-yellow.svg";
import { useEffect, useState } from "react";
import { RoomInterface } from "../../hooks/useRoom";

interface TurnBackgroundProps {
  currentPlayer: number;
  isGameRunning: boolean;
  switchPlayer: () => void;
  randomPlay: () => void;
  isModalOpen: boolean;
  owner?: RoomInterface["owner"];
  guest?: RoomInterface["guest"];
}

const defaultTime = 30;

export default function TurnBackground(props: TurnBackgroundProps) {
  const {
    currentPlayer,
    isGameRunning,
    switchPlayer,
    randomPlay,
    isModalOpen,
    owner,
    guest,
  } = props;
  const [timer, setTimer] = useState(defaultTime);

  useEffect(() => {
    setTimer(defaultTime);
  }, [currentPlayer]);

  useEffect(() => {
    if (isGameRunning) {
      const interval = setInterval(() => {
        if (timer - 1 < 0) {
          setTimer(defaultTime);
          randomPlay();
          return switchPlayer();
        }

        if (!isModalOpen) {
          setTimer((prevState) => prevState - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isGameRunning, timer, switchPlayer, randomPlay, isModalOpen]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      animate={{ y: 0 }}
      transition={{
        from: 1500,
        duration: 1,
        type: "spring",
      }}
    >
      <div className="absolute z-[3] text-center">
        <p
          className={clsx("font-space font-bold uppercase transition-colors", {
            "text-white": currentPlayer === 1,
            "text-black": currentPlayer === 2,
          })}
        >
          {owner || guest
            ? owner?.boardId === currentPlayer
              ? `${owner.name}'s turn`
              : `${guest?.name}'s turn`
            : `Player ${currentPlayer}'s turn`}
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
      <img
        src={currentPlayer === 1 ? turnBackgroundRed : turnBackgroundYellow}
        alt="turnBackground"
        width={200}
      />
    </motion.div>
  );
}
