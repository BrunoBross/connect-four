import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { copyTextToClipboard } from "../utils/utils";
import { useGame } from "../../contexts/gameContext";

export default function RoomCode() {
  const { roomId, room } = useGame();

  const [isCopied, setIsCopied] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleCopyClick = (copyText: string) => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (roomId && room && !room.guest) {
      // Component is entering
      setShouldRender(true);
      setIsExiting(false);
    } else {
      // Component is exiting
      setIsExiting(true);
    }
  }, [roomId, room]);

  const animationVariants = {
    initial: {
      opacity: 0,
      x: -500,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -500,
    },
  };

  const animationTransition = {
    type: "spring",
    duration: 1,
  };

  if (!roomId) {
    return <></>;
  }

  return shouldRender ? (
    <motion.div
      className="absolute right-5 bottom-5 z-[1000]"
      initial="initial"
      animate={isExiting ? "exit" : "animate"}
      exit="exit"
      variants={animationVariants}
      transition={animationTransition}
      onClick={() => handleCopyClick(roomId)}
      title="Copy to clipboard"
    >
      <button className="flex h-[10vh] sm:h-20 w-[50vw] xs:w-full items-center justify-center xs:justify-between gap-2 bg-white p-3 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2 transition-all">
        <div className="flex flex-2 flex-col">
          <p className="hidden xs:flex uppercase text-black font-space text-2xl font-bold">
            Room Code
          </p>
          <p className="uppercase text-black font-space text-4xl font-bold">
            {roomId}
          </p>
        </div>
        <div className="hidden xs:flex">
          {isCopied ? <LuCopyCheck size={40} /> : <LuCopy size={40} />}
        </div>
      </button>
    </motion.div>
  ) : (
    <></>
  );
}
