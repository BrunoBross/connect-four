import { motion } from "framer-motion";

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
import Modal from "../components/Modal";
import { useAuth } from "../contexts/authContext";
import { useRoom } from "../hooks/useRoom";

ReactModal.setAppElement("#root");

export default function Home() {
  const { createRoom, joinRoom } = useRoom();
  const [roomId, setRoomId] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const { loginWithGoogle, signed, logout } = useAuth();

  const [isModalSelectModeOpen, setIsModalSelectModeOpen] = useState(false);

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
    setIsHoveringButton(false);
  };

  const contentAnimation = useSpring({
    transform:
      modalIsOpen || isModalSelectModeOpen
        ? "translateY(-150%)"
        : "translateY(0%)",
    config: {
      easing: easings.easeOutSine,
    },
  });

  return (
    <div
      className={clsx(
        "w-screen h-screen flex flex-col justify-center items-center transition-colors",
        {
          "bg-background-0": !modalIsOpen && !isModalSelectModeOpen,
          "bg-background-1": modalIsOpen || isModalSelectModeOpen,
        }
      )}
    >
      <animated.div style={contentAnimation}>
        <motion.div
          className="flex flex-col w-[90vw] sm:w-[450px] h-[550px] bg-background-1 border-[3px] border-black shadow-layout rounded-3xl items-center justify-center"
          animate={{ y: 1 }}
          transition={{
            from: -1000,
            duration: 1,
            type: "spring",
          }}
        >
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
                <img
                  src={playerVsCpu}
                  alt="playerVsCpu"
                  className="hidden xs:block"
                />
              </Link>
              <button
                className="flex w-[85%] h-24 items-center justify-between bg-yellow p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                onClick={() => setIsModalSelectModeOpen(true)}
              >
                <p className="uppercase text-black font-space text-2xl font-bold">
                  Play vs Player
                </p>
                <img
                  src={playerVsPlayer}
                  alt="playerVsCpu"
                  className="hidden xs:block"
                />
              </button>
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
        </motion.div>
      </animated.div>

      <Modal
        isModalOpen={isModalSelectModeOpen}
        setIsModalOpen={setIsModalSelectModeOpen}
        overlay={false}
      >
        <div className="flex flex-col w-full items-center gap-5">
          {signed ? (
            <>
              <div className="flex w-[85%] h-24 uppercase text-black font-space text-2xl font-bold">
                <input
                  type="text"
                  placeholder="Room Code"
                  value={roomId}
                  maxLength={5}
                  onChange={(event) => setRoomId(event.target.value)}
                  className="w-full items-center justify-center px-6 bg-white border-[3px] border-r-2  rounded-l-3xl border-black shadow-layout focus:outline-none"
                />
                <button
                  className="w-[50%] items-center justify-center bg-yellow border-[3px] border-l-2 rounded-r-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                  onClick={() => joinRoom(roomId)}
                >
                  Join
                </button>
              </div>
              <button
                className="flex w-[85%] h-24 items-center bg-pink p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                onClick={createRoom}
              >
                <p className="uppercase text-white font-space text-2xl font-bold">
                  Create Online Match
                </p>
              </button>
            </>
          ) : (
            <>
              <img src={logo} alt="logo" className="w-20" />
              <button
                className="flex w-[85%] h-24 items-center bg-pink p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                onClick={loginWithGoogle}
              >
                <p className="uppercase text-white font-space text-2xl font-bold">
                  Login With Google
                </p>
              </button>
            </>
          )}
          <Link
            className="flex w-[85%] h-24 items-center bg-yellow p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
            to="/game/player"
          >
            <p className="uppercase text-black font-space text-2xl font-bold">
              Create Local Match
            </p>
          </Link>
          <div className="flex w-[85%] gap-3">
            <button
              className="flex flex-1 h-24 items-center bg-white p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
              onClick={() => setIsModalSelectModeOpen(false)}
            >
              <p className="uppercase text-black font-space text-2xl font-bold">
                Go Back
              </p>
            </button>
            {signed && (
              <button
                className="flex flex-1 h-24 items-center bg-white p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
                onClick={logout}
              >
                <p className="uppercase text-black font-space text-2xl font-bold">
                  Logout
                </p>
              </button>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isModalOpen={modalIsOpen}
        setIsModalOpen={setModalIsOpen}
        fullChildren
        overlay={false}
      >
        <div className="flex flex-col w-[90vw] h-[80vh] xs:w-[500px] xs:h-[500px] p-8 pb-16 bg-white border-[3px] border-black rounded-3xl shadow-layout items-center justify-center">
          <h1 className="font-space text-[4rem] uppercase font-bold">Rules</h1>
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
      </Modal>
    </div>
  );
}
