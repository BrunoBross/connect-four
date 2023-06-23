import "./Modal.css";
import logo from "../img/logo.svg";
import ReactModal from "react-modal";
import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { Link } from "react-router-dom";

interface GameHeaderProps {
  resetGame: () => void;
}

export default function GameHeader(props: GameHeaderProps) {
  const { resetGame } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalAnimation = useSpring({
    transform: isModalOpen ? "translateY(0%)" : "translateY(200%)",
  });

  const handleResetGame = () => {
    resetGame();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex w-[40rem] justify-between items-center">
        <button
          className="flex items-center uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          Menu
        </button>
        <img src={logo} alt="logo" />
        <button
          className="uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink  transition-colors"
          onClick={resetGame}
        >
          Restart
        </button>
      </div>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        closeTimeoutMS={200}
        style={{
          overlay: { backgroundColor: "#00000099", zIndex: 1000 },
        }}
        id="modal"
      >
        <animated.div style={modalAnimation}>
          <div className="flex flex-col w-[450px] h-[550px] gap-6 bg-background-1 border-[3px] shadow-layout border-black rounded-[2rem] items-center justify-center">
            <div className="flex flex-col h-full w-full py-10 items-center justify-around">
              <h1 className="font-space text-[4rem] text-white uppercase font-bold">
                Pause
              </h1>
              <div className="flex flex-col w-full items-center gap-5">
                <button
                  className="flex w-[85%] h-24 items-center justify-between bg-white p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                  onClick={() => setIsModalOpen(false)}
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
                <Link
                  className="flex w-[85%] h-24 items-center justify-between bg-pink p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                  to="/"
                >
                  <p className="uppercase text-black font-space text-2xl font-bold">
                    Quit Game
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </animated.div>
      </ReactModal>
    </>
  );
}
