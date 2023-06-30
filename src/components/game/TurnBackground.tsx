import { motion } from "framer-motion";

import clsx from "clsx";
import turnBackgroundRed from "../../img/turn-background-red.svg";
import turnBackgroundYellow from "../../img/turn-background-yellow.svg";
import { useEffect, useState } from "react";
import { RoomInterface, useRoom } from "../../hooks/useRoom";
import { defaultTime, useGame } from "../../contexts/gameContext";
import { TypeEnum } from "../../hooks/useGameNavigate";
import { onValue, ref } from "firebase/database";
import { database } from "../../services/firebase";

interface TurnBackgroundProps {
  currentPlayer: number;
  isGameRunning: boolean;
  switchPlayer: () => void;
  randomPlay: () => void;
  isModalOpen: boolean;
  owner?: RoomInterface["owner"];
  guest?: RoomInterface["guest"];
}

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
  const { isGuest, roomId, type } = useGame();
  const { updateRoom } = useRoom();
  const [timer, setTimer] = useState(defaultTime);

  // Se for convidado, busca o tempo que falta
  useEffect(() => {
    if (type === TypeEnum.public && isGuest) {
      onValue(ref(database, `/room/${roomId}`), (snapshot) => {
        const data: RoomInterface = snapshot.val();

        setTimer(data.remainingTime);
      });
    }
  }, [isGuest, roomId, type]);

  // Se for o dono, atualiza no banco de dados o tempo que falta
  useEffect(() => {
    if (!isGuest && roomId) {
      updateRoom(roomId, {
        remainingTime: timer,
      });
    }
  }, [timer, isGuest, roomId, updateRoom]);

  // Zera o tempo quando muda o jogador (alguem venceu)
  useEffect(() => {
    setTimer(defaultTime);
  }, [currentPlayer]);

  // Se for o dono, cria/inicia o contador
  useEffect(() => {
    // if (!isGuest && isGameRunning) {
    //   const interval = setInterval(() => {
    //     if (timer - 1 < 0) {
    //       setTimer(defaultTime);
    //       randomPlay();
    //       return switchPlayer();
    //     }
    //     if (!isModalOpen) {
    //       setTimer((prevState) => prevState - 1);
    //     }
    //   }, 1000);
    //   return () => clearInterval(interval);
    // }
  }, [isGameRunning, timer, switchPlayer, randomPlay, isModalOpen, isGuest]);

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
