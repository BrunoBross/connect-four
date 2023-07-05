import { motion } from "framer-motion";
import logo from "../../img/logo.svg";
import Modal from "../utils/Modal";
import { useGame } from "../../contexts/gameContext";
import RoomCode from "./RoomCode";
import MenuButton from "../utils/MenuButton";
import SimpleButton from "../utils/SimpleButton";

interface GameHeaderProps {
  handleGoHome: () => void;
}

export default function GameHeader(props: GameHeaderProps) {
  const { handleGoHome } = props;
  const { isModalMenuOpen, setIsModalMenuOpen, resetGame } = useGame();

  const handleResetGame = () => {
    resetGame();
    setIsModalMenuOpen(false);
  };

  const handleQuitGame = () => {
    handleGoHome();
    setIsModalMenuOpen(false);
  };

  return (
    <>
      <RoomCode />

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

        <SimpleButton title="Menu" onClick={() => setIsModalMenuOpen(true)} />
        <div className="hidden xs:flex flex-col justify-center items-center w-16 h-16">
          <img src={logo} alt="logo" />
        </div>
        <SimpleButton title="Restart" onClick={resetGame} />
      </motion.div>

      <Modal isModalOpen={isModalMenuOpen} setIsModalOpen={setIsModalMenuOpen}>
        <h1
          className="font-space text-[4rem] text-white uppercase font-bold
              "
        >
          Pause
        </h1>
        <div className="flex flex-col w-[85%] items-center gap-5">
          <MenuButton
            title="Continue Game"
            onClick={() => setIsModalMenuOpen(false)}
          />
          <MenuButton title="Restart" onClick={handleResetGame} />
          <MenuButton
            title="Quit Game"
            onClick={handleQuitGame}
            bgcolor="bg-pink"
          />
        </div>
      </Modal>
    </>
  );
}
