import { motion } from "framer-motion";

import playerOne from "../../img/player-one.svg";
import playerTwo from "../../img/player-two.svg";
import cpu from "../../img/cpu.svg";
import { useAuth } from "../../contexts/authContext";
import clsx from "clsx";
import { RoomInterface } from "../../hooks/useRoom";
import { NavigateProps } from "../../hooks/useGameNavigate";
import { useGame } from "../../contexts/gameContext";

interface ScoreboardProps {
  playerOnePoints: number;
  playerTwoPoints: number;
  isGameRunning: boolean;
  type: NavigateProps["type"];
  owner?: RoomInterface["owner"];
  guest?: RoomInterface["guest"];
}

export default function Scoreboard(props: ScoreboardProps) {
  const { type, owner, guest } = props;

  const { isGuest, playerOnePoints, playerTwoPoints } = useGame();
  const { user } = useAuth();

  console.log(isGuest);

  return (
    <div className="flex absolute bottom-0 h-screen w-full justify-center items-end lg:items-center">
      <div className="flex relative lg:w-[85%] xl:w-[70%] 2xl:w-[60vw] w-full justify-around lg:justify-between gap-2 pb-4 z-10">
        <motion.div
          className={clsx(
            "flex flex-col gap-1 items-center w-36 pb-5 pt-10 border-[3px] shadow-layout border-black rounded-3xl",
            {
              "bg-white text-black": !owner && !guest,
              "bg-pink text-white": owner || guest,
            }
          )}
          animate={{ x: 0 }}
          transition={{
            from: -1000,
            duration: 0.7,
            type: "spring",
          }}
        >
          <div className="flex absolute -top-8 w-16 h-16 justify-center">
            <img
              src={
                isGuest && owner?.photoURL
                  ? owner.photoURL
                  : user?.photoURL
                  ? user.photoURL
                  : playerOne
              }
              referrerPolicy="no-referrer"
              alt="playerImg"
              className={clsx("", {
                "rounded-full border-4 border-black": user?.photoURL,
              })}
            />
          </div>

          <p
            className={
              "font-space font-bold text-xl uppercase transition-colors text-center"
            }
          >
            {type === "cpu"
              ? "You"
              : type !== "private" && isGuest && owner?.name
              ? owner.name
              : user?.displayName
              ? user.displayName
              : "Player 1"}
          </p>
          <h1 className={"font-space font-bold text-6xl transition-colors"}>
            {owner ? owner.points : playerOnePoints}
          </h1>
        </motion.div>

        <motion.div
          className={clsx(
            "flex flex-col gap-1 items-center w-36 pb-5 pt-10 border-[3px] shadow-layout border-black rounded-3xl ",
            {
              "bg-white text-black": !owner && !guest,
              "bg-yellow text-black": owner || guest,
            }
          )}
          animate={{ x: type === "public" && !guest ? 1000 : 0 }}
          transition={{
            from: 1000,
            duration: 0.7,
            type: "spring",
          }}
        >
          <div className="flex absolute -top-8 w-16 h-16 justify-center">
            <img
              src={
                type === "cpu"
                  ? cpu
                  : guest?.photoURL
                  ? guest.photoURL
                  : playerTwo
              }
              className={clsx("", {
                "rounded-full border-4 border-black": guest?.photoURL,
              })}
              referrerPolicy="no-referrer"
              alt="playerImg"
            />
          </div>
          <p
            className={
              "font-space font-bold text-xl uppercase transition-colors text-center"
            }
          >
            {type === "cpu" ? "CPU" : guest?.name ? guest.name : "Player 2"}
          </p>
          <h1 className={"font-space font-bold text-6xl transition-colors"}>
            {guest ? guest.points : playerTwoPoints}
          </h1>
        </motion.div>
      </div>
    </div>
  );
}
