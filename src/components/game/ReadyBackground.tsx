import { motion } from "framer-motion";
import { RoomInterface } from "../../hooks/useRoom";
import { useGame } from "../../contexts/gameContext";
import { NavigateProps, TypeEnum } from "../../hooks/useGameNavigate";
import SimpleButton from "../utils/SimpleButton";

interface ReadyBackgroundProps {
  currentPlayer: number;
  handleStartGame: () => void;
  type: NavigateProps["type"];
  owner?: RoomInterface["owner"];
  guest?: RoomInterface["guest"];
}

export default function ReadyBackground(props: ReadyBackgroundProps) {
  const { currentPlayer, handleStartGame, type, owner, guest } = props;
  const { isGuest } = useGame();

  const WaitingPlayer = () => {
    return (
      <>
        <p
          className={
            "font-space font-bold text-black uppercase transition-colors"
          }
        >
          Keep Calm
        </p>
        <h1
          className={
            "font-space font-bold text-black text-6xl uppercase transition-colors"
          }
        >
          Waiting
        </h1>
        <p
          className={
            "font-space font-bold text-black uppercase transition-colors"
          }
        >
          Other Player
        </p>
      </>
    );
  };

  const WaitingGameStart = () => {
    return (
      <>
        <p
          className={
            "font-space font-bold text-black uppercase transition-colors"
          }
        >
          Keep Calm
        </p>
        <h1
          className={
            "font-space font-bold text-black text-6xl uppercase transition-colors"
          }
        >
          Waiting
        </h1>
        <p
          className={
            "font-space font-bold text-black uppercase transition-colors"
          }
        >
          {owner?.name} starts
        </p>
      </>
    );
  };

  const ReadyToStart = () => {
    return (
      <>
        <p
          className={
            "font-space font-bold text-black uppercase transition-colors"
          }
        >
          Player {currentPlayer} starts
        </p>
        <h1
          className={
            "font-space font-bold text-black text-6xl uppercase transition-colors"
          }
        >
          Ready?
        </h1>
        <SimpleButton title="Play" onClick={handleStartGame} />
      </>
    );
  };

  return (
    <motion.div
      className="flex flex-col gap-1 items-center justify-center bg-white px-5 py-3 border-[3px] shadow-layout border-black rounded-[2rem]"
      animate={{ y: 0 }}
      transition={{
        from: 1500,
        duration: 1,
        type: "spring",
      }}
    >
      {type === TypeEnum.public && isGuest ? (
        <WaitingGameStart />
      ) : type === TypeEnum.public && !guest ? (
        <WaitingPlayer />
      ) : (
        <ReadyToStart />
      )}
    </motion.div>
  );
}
