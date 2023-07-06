import { motion } from "framer-motion";

import clsx from "clsx";
import turnBackgroundRed from "../../img/turn-background-red.svg";
import turnBackgroundYellow from "../../img/turn-background-yellow.svg";
import { useGame } from "../../contexts/gameContext";

export default function TurnBackground() {
  const { timer, currentPlayer, room } = useGame();

  const ownerName = room?.owner?.name?.split(" ")[0];
  const guestName = room?.guest?.name?.split(" ")[0];

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
          {room?.owner || room?.guest
            ? room.owner?.boardId === currentPlayer
              ? `${ownerName}'s turn`
              : `${guestName}'s turn`
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
