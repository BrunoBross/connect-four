import { motion } from "framer-motion";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import logo from "../../img/logo.svg";
import { useState } from "react";
import Modal from "../utils/Modal";
import { copyTextToClipboard } from "../utils/utils";
import { useGame } from "../../contexts/gameContext";

interface GameHeaderProps {
  resetGame: () => void;
  handleGoHome: () => void;
  roomId: string | undefined;
}

export default function GameHeader(props: GameHeaderProps) {
  const { resetGame, handleGoHome, roomId } = props;

  const { isModalMenuOpen, setIsModalMenuOpen } = useGame();

  const [isCopied, setIsCopied] = useState(false);

  const handleResetGame = () => {
    resetGame();
    setIsModalMenuOpen(false);
  };

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

  const handleQuitGame = () => {
    handleGoHome();
    setIsModalMenuOpen(false);
  };

  return (
    <>
      {roomId && (
        <motion.div
          className="absolute left-5 top-5 z-[1000]"
          animate={{ x: 0 }}
          transition={{
            from: -500,
            delay: 0.3,
            duration: 1,
            type: "spring",
          }}
          onClick={() => handleCopyClick(roomId)}
          title="Copy to clipboard"
        >
          <button className="flex h-24 items-center justify-between gap-2 bg-white p-3 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2">
            <div className="flex flex-2 flex-col">
              <p className="uppercase text-black font-space text-2xl font-bold">
                Room Code
              </p>
              <p className="uppercase text-black font-space text-4xl font-bold">
                {roomId}
              </p>
            </div>
            {isCopied ? <LuCopyCheck size={40} /> : <LuCopy size={40} />}
          </button>
        </motion.div>
      )}

      <motion.div
        className="flex flex-col xs:flex-row w-[90%] md:w-[40rem] justify-between items-center gap-3 xs:gap-0 z-[100]"
        animate={{ y: 0 }}
        transition={{
          from: -500,
          delay: 0.3,
          duration: 1,
          type: "spring",
        }}
      >
        <div
          className="flex xs:hidden w-16 h-16 justify-center"
          onClick={() => setIsModalMenuOpen(true)}
        >
          <img src={logo} alt="logo" />
        </div>

        <button
          className="hidden xs:flex w-full xs:w-44 items-center justify-center uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink transition-colors"
          onClick={() => setIsModalMenuOpen(true)}
        >
          Menu
        </button>
        <div className="hidden xs:flex flex-col justify-center items-center w-16 h-16">
          <img src={logo} alt="logo" />
        </div>
        <button
          className="hidden xs:flex w-full xs:w-44 items-center justify-center uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink transition-colors"
          onClick={resetGame}
        >
          Restart
        </button>
      </motion.div>
      <Modal isModalOpen={isModalMenuOpen} setIsModalOpen={setIsModalMenuOpen}>
        <h1
          className="font-space text-[4rem] text-white uppercase font-bold
              "
        >
          Pause
        </h1>
        <div className="flex flex-col w-full items-center gap-5">
          <button
            className="flex w-[85%] h-24 items-center justify-between bg-white p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
            onClick={() => setIsModalMenuOpen(false)}
          >
            <p className="uppercase text-black font-space text-2xl font-bold">
              Continue Game
            </p>
          </button>
          <button
            className="flex w-[85%] h-24 items-center justify-between bg-white p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
            onClick={handleResetGame}
          >
            <p className="uppercase text-black font-space text-2xl font-bold">
              Restart
            </p>
          </button>
          <button
            className="flex w-[85%] h-24 items-center justify-between bg-pink p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
            onClick={handleQuitGame}
          >
            <p className="uppercase text-black font-space text-2xl font-bold">
              Quit Game
            </p>
          </button>
        </div>
      </Modal>
    </>
  );
}
