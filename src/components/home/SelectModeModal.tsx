import Modal, { ModalBasicProps } from "../utils/Modal";
import { useAuth } from "../../contexts/authContext";
import { useState } from "react";
import { useRoom } from "../../hooks/useRoom";

import logo from "../../img/logo.svg";
import { useGameNavigate } from "../../hooks/useGameNavigate";

interface SelectModeModalProps extends ModalBasicProps {}

export default function SelectModeModal(props: SelectModeModalProps) {
  const { isModalOpen, setIsModalOpen } = props;

  const [roomId, setRoomId] = useState<string>("");

  const { createRoom, joinRoom } = useRoom();
  const { signed, logout, loginWithGoogle } = useAuth();
  const { handleNavigateGame } = useGameNavigate();

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
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
        <button
          className="flex w-[85%] h-24 items-center bg-yellow p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
          onClick={() => handleNavigateGame({ type: "private" })}
        >
          <p className="uppercase text-black font-space text-2xl font-bold">
            Create Local Match
          </p>
        </button>
        <div className="flex w-[85%] gap-3">
          <button
            className="flex flex-1 h-24 items-center bg-white p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
            onClick={() => setIsModalOpen(false)}
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
  );
}
