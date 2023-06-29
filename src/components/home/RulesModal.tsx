import { useState } from "react";
import Modal, { ModalBasicProps } from "../utils/Modal";

import buttonCheck from "../../img/button-check.svg";
import buttonCheckHover from "../../img/button-check-hover.svg";

interface RulesModalProps extends ModalBasicProps {}

export default function RulesModal(props: RulesModalProps) {
  const { isModalOpen, setIsModalOpen } = props;
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsHoveringButton(false);
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
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
            Be the first player to connect 4 of the same colored discs in a row
            (either vertically, horizontally, or diagonally).
          </p>
          <p className="uppercase font-space text-background-1 font-bold">
            How to play
          </p>
          <ol className="flex flex-col gap-2">
            <li className="font-space font-medium">
              Red goes first in the first game.
            </li>
            <li className="font-space font-medium">
              Players must alternate turns, and only one disc can be dropped in
              each turn.
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
  );
}
