import "./Home.css";
import { animated, easings, useSpring } from "react-spring";

import logo from "../img/logo.svg";
import playerVsCpu from "../img/player-vs-cpu.svg";
import playerVsPlayer from "../img/player-vs-player.svg";

import buttonCheck from "../img/button-check.svg";
import buttonCheckHover from "../img/button-check-hover.svg";

import { useState } from "react";
import ReactModal from "react-modal";
import clsx from "clsx";
import { Link } from "react-router-dom";

ReactModal.setAppElement("#root");

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
    setIsHoveringButton(false);
  };

  const contentAnimation = useSpring({
    transform: modalIsOpen ? "translateY(-150%)" : "translateY(0%)",
    config: {
      easing: easings.easeOutSine,
    },
  });

  const modalAnimation = useSpring({
    transform: modalIsOpen ? "translateY(0%)" : "translateY(200%)",
  });

  return (
    <div
      className={clsx(
        "w-[100vw] h-[100vh] flex flex-col justify-center items-center transition-colors",
        {
          "bg-background-0": !modalIsOpen,
          "bg-background-1": modalIsOpen,
        }
      )}
    >
      <animated.div style={contentAnimation}>
        <div className="flex flex-col w-[450px] h-[550px] bg-background-1 border-[3px] border-black shadow-layout rounded-3xl items-center justify-center">
          <div className="flex flex-col h-full w-full py-10 items-center justify-around">
            <img src={logo} alt="logo" className="w-20" />
            <div className="flex flex-col w-full items-center gap-5">
              <Link
                className="flex w-[85%] h-24 items-center justify-between bg-pink p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                to="/game/cpu"
              >
                <p className="uppercase text-white font-space text-2xl font-bold">
                  Play vs CPU
                </p>
                <img src={playerVsCpu} alt="playerVsCpu" />
              </Link>
              <Link
                className="flex w-[85%] h-24 items-center justify-between bg-yellow p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                to="/game/player"
              >
                <p className="uppercase text-black font-space text-2xl font-bold">
                  Play vs Player
                </p>
                <img src={playerVsPlayer} alt="playerVsCpu" />
              </Link>
              <button
                className="flex w-[85%] h-24 items-center justify-between bg-white p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                onClick={toggleModal}
              >
                <p className="uppercase text-black font-space text-2xl font-bold">
                  GAMERULES
                </p>
              </button>
            </div>
          </div>
        </div>
      </animated.div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        className="modal"
        closeTimeoutMS={200}
        style={{ overlay: { backgroundColor: "transparent" } }}
        id="modal"
        shouldCloseOnOverlayClick={false}
      >
        <animated.div style={modalAnimation}>
          <div className="flex flex-col w-[500px] h-[500px] p-8 pb-16 bg-white border-[3px] border-black rounded-3xl shadow-layout items-center justify-center">
            <h1 className="font-space text-[4rem] uppercase font-bold">
              Rules
            </h1>
            <div className="flex flex-col gap-2">
              <p className="uppercase font-space text-background-1 font-bold">
                Objective
              </p>
              <p className="font-space font-medium">
                Be the first player to connect 4 of the same colored discs in a
                row (either vertically, horizontally, or diagonally).
              </p>
              <p className="uppercase font-space text-background-1 font-bold">
                How to play
              </p>
              <ol className="flex flex-col gap-2">
                <li className="font-space font-medium">
                  Red goes first in the first game.
                </li>
                <li className="font-space font-medium">
                  Players must alternate turns, and only one disc can be dropped
                  in each turn.
                </li>
                <li className="font-space font-medium">
                  The game ends when there is a 4-in-a-row or a stalemate.
                </li>
                <li className="font-space font-medium">
                  The starter of the previous game goes second on the next game.
                </li>
              </ol>
            </div>
            <img
              src={isHoveringButton ? buttonCheckHover : buttonCheck}
              alt="buttonCheck"
              onClick={toggleModal}
              className="absolute -bottom-8 cursor-pointer"
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
            />
          </div>
        </animated.div>
      </ReactModal>
    </div>
  );
}
