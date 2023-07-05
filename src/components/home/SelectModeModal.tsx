import Modal, { ModalBasicProps } from "../utils/Modal";
import { useAuth } from "../../contexts/authContext";
import { useState } from "react";
import { useRoom } from "../../hooks/useRoom";

import logo from "../../img/logo.svg";
import { TypeEnum, useGameNavigate } from "../../hooks/useGameNavigate";
import MenuButton from "../utils/MenuButton";

interface SelectModeModalProps extends ModalBasicProps {}

export default function SelectModeModal(props: SelectModeModalProps) {
  const { isModalOpen, setIsModalOpen } = props;

  const [roomId, setRoomId] = useState<string>("");

  const { createRoom, verifyRoomExists } = useRoom();
  const { user, signed, logout, loginWithGoogle } = useAuth();
  const { handleNavigateGame } = useGameNavigate();

  const handleCreateRoom = async () => {
    await createRoom().then((roomId) => {
      if (roomId) {
        handleNavigateGame({
          type: TypeEnum.public,
          roomId: roomId,
        });
      }
    });
  };

  const handleJoinRoom = async () => {
    await verifyRoomExists(roomId).then((exists) => {
      if (exists) {
        handleNavigateGame({
          type: TypeEnum.public,
          roomId: roomId,
        });
      }
    });
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      overlay={false}
    >
      <div className="flex flex-col w-full items-center gap-5 font-space">
        {user ? (
          <div className="flex items-center gap-4 bg-background-1 w-[85%] rounded-3xl justify-center p-2">
            <img
              src={user.photoURL!}
              alt="user img"
              className="w-20 rounded-full"
            />
            <div className="border-l-4 pl-4 border-white">
              <h1 className="text-white text-3xl font-bold">
                {user.displayName}
              </h1>
              <p className="text-white font-bold text-sm">{user.email}</p>
            </div>
          </div>
        ) : (
          <img src={logo} alt="logo img" className="w-20" />
        )}
        <div className="flex w-[85%] flex-col gap-5">
          {signed ? (
            <>
              <div className="flex uppercase text-black text-2xl font-bold h-24">
                <input
                  type="text"
                  placeholder="Room Code"
                  value={roomId}
                  maxLength={5}
                  onChange={(event) => setRoomId(event.target.value)}
                  className="w-full items-center justify-center px-6 bg-white border-[3px] border-r-2  rounded-l-3xl border-black shadow-layout focus:outline-none"
                />
                <div className="flex">
                  <button
                    className="w-full px-8 items-center justify-center bg-yellow border-[3px] border-l-2 rounded-r-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2 transition-all"
                    onClick={handleJoinRoom}
                  >
                    Join
                  </button>
                </div>
              </div>

              <MenuButton
                title="Create Online Match"
                onClick={handleCreateRoom}
                bgcolor="bg-pink"
              />
            </>
          ) : (
            <MenuButton
              title="Login With Google"
              onClick={loginWithGoogle}
              bgcolor="bg-pink"
            />
          )}
          <MenuButton
            title="Create Local Match"
            onClick={() => handleNavigateGame({ type: TypeEnum.private })}
            bgcolor="bg-yellow"
          />
          <div className="flex bg-red-600 gap-4">
            <MenuButton title="Go Back" onClick={() => setIsModalOpen(false)} />
            {signed && <MenuButton title="Logout" onClick={logout} />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
