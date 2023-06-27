import { motion } from "framer-motion";

import playerOne from "../img/player-one.svg";
import playerTwo from "../img/player-two.svg";
import cpu from "../img/cpu.svg";

interface ScoreboardProps {
  playerOnePoints: number;
  playerTwoPoints: number;
  isVsPlayer: boolean;
  isGameRunning: boolean;
}

export default function Scoreboard(props: ScoreboardProps) {
  const { playerOnePoints, playerTwoPoints, isVsPlayer, isGameRunning } = props;

  if (!isGameRunning) {
    return <></>;
  }

  return (
    <div className="flex absolute bottom-0 h-screen w-full justify-center items-end lg:items-center">
      <div className="flex relative lg:w-[85%] xl:w-[70%] 2xl:w-[60vw] w-full justify-around lg:justify-between gap-2 pb-4 z-10">
        <motion.div
          className="flex flex-col gap-1 items-center bg-white w-36 pb-5 pt-10 border-[3px] shadow-layout border-black rounded-3xl"
          animate={{ x: 0 }}
          transition={{
            from: -1000,
            duration: 0.7,
            type: "spring",
          }}
        >
          <div className="flex absolute -top-8 w-16 h-16 justify-center">
            <img src={playerOne} alt="playerImg" />
          </div>

          <p
            className={
              "font-space font-bold text-xl uppercase transition-colors"
            }
          >
            {isVsPlayer ? "Player 1" : "You"}
          </p>
          <h1 className={"font-space font-bold text-6xl transition-colors"}>
            {playerOnePoints}
          </h1>
        </motion.div>

        <motion.div
          className="flex flex-col gap-1 items-center bg-white w-36 pb-5 pt-10 border-[3px] shadow-layout border-black rounded-3xl "
          animate={{ x: 0 }}
          transition={{
            from: 1000,
            duration: 0.7,
            type: "spring",
          }}
        >
          <div className="flex absolute -top-8 w-16 h-16 justify-center">
            <img src={isVsPlayer ? playerTwo : cpu} alt="playerImg" />
          </div>
          <p
            className={
              "font-space font-bold text-xl uppercase transition-colors"
            }
          >
            {isVsPlayer ? "Player 2" : "Cpu"}
          </p>
          <h1 className={"font-space font-bold text-6xl transition-colors"}>
            {playerTwoPoints}
          </h1>
        </motion.div>
      </div>
    </div>
  );
}
