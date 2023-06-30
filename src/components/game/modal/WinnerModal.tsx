import clsx from "clsx";
import { useGame } from "../../../contexts/gameContext";
import Modal from "../../utils/Modal";
import { TypeEnum } from "../../../hooks/useGameNavigate";

export default function WinnerModal() {
  const { isModalWinnerOpen, setIsModalWinnerOpen, winner, type } = useGame();

  return (
    <Modal
      isModalOpen={isModalWinnerOpen}
      setIsModalOpen={setIsModalWinnerOpen}
      bgcolor={winner === 1 ? "bg-pink" : "bg-yellow"}
    >
      <div>
        <h1
          className={clsx(
            "font-space text-[4rem] uppercase font-bold text-center",
            {
              "text-white": winner === 1,
              "text-black": winner === 2,
            }
          )}
        >
          {type !== TypeEnum.cpu || winner === 1 ? `Player ${winner}` : "CPU"}
        </h1>
        <h1
          className={clsx(
            "font-space text-[4rem] uppercase font-bold text-center",
            {
              "text-white": winner === 1,
              "text-black": winner === 2,
            }
          )}
        >
          Win
        </h1>
      </div>

      <div className="flex flex-col w-full items-center gap-5">
        <button
          className="flex w-[85%] h-24 items-center justify-center bg-white p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2"
          onClick={() => setIsModalWinnerOpen(false)}
        >
          <p className="uppercase text-black font-space text-2xl font-bold">
            Continue Game
          </p>
        </button>
      </div>
    </Modal>
  );
}
