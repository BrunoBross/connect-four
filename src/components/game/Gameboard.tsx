import { motion } from "framer-motion";

import { useState } from "react";

import markerRed from "../../img/marker-red.svg";
import markerYellow from "../../img/marker-yellow.svg";
import TurnBackground from "./TurnBackground";
import ReadyBackground from "./ReadyBackground";

import whiteBoard from "../../img/board-layer-white-large.svg";
import boardShadow from "../../img/board-layer-black-large.svg";

import clsx from "clsx";
import GameboardPieces from "./GameboardPieces";
import { RoomInterface } from "../../hooks/useRoom";
import { NavigateProps, TypeEnum } from "../../hooks/useGameNavigate";
import { useGame } from "../../contexts/gameContext";

interface GameboardProps {
  gameMatrix: number[][];
  isGameRunning: boolean;
  makePlay: (columnIdx: number) => void;
  currentPlayer: number;
  switchPlayer: () => void;
  randomPlay: () => void;
  handleStartGame: () => void;
  type: NavigateProps["type"];
  canPlayCondition: boolean;
  owner?: RoomInterface["owner"];
  guest?: RoomInterface["guest"];
}

export default function Gameboard(props: GameboardProps) {
  const {
    gameMatrix,
    isGameRunning,
    makePlay,
    currentPlayer,
    handleStartGame,
    randomPlay,
    switchPlayer,
    type,
    canPlayCondition,
    owner,
    guest,
  } = props;

  const { isModalMenuOpen, isModalWinnerOpen } = useGame();

  const [columnHoveringIdx, setColumnHoveringIdx] = useState(0);

  const isAnyModalOpen = isModalMenuOpen || isModalWinnerOpen;

  const cursorPointerCondition =
    isGameRunning && (type !== TypeEnum.public || canPlayCondition);

  const cursorNotAllowedCondition =
    !isGameRunning || (type === TypeEnum.public && !canPlayCondition);

  return (
    <div className="flex w-full justify-center z-20">
      <div className="flex justify-center relative w-[35vw] h-[32.9vw]">
        <motion.div
          className="flex flex-1 w-full h-full"
          animate={{ y: 1 }}
          transition={{
            from: -1000,
            duration: 1,
            type: "spring",
          }}
        >
          <div className="flex flex-1 w-full h-full">
            <img src={whiteBoard} alt="" className="absolute w-full z-20" />
            <img src={boardShadow} alt="" className="absolute w-full z-10" />
          </div>

          <div className="flex absolute z-30 w-full h-full p-4 pb-[4.12rem] gap-4">
            {gameMatrix.map((_, columnIdx) => {
              return (
                <div
                  className={clsx("flex flex-1 flex-col items-center gap-3", {
                    "cursor-pointer": cursorPointerCondition,
                    "cursor-not-allowed": cursorNotAllowedCondition,
                  })}
                  onMouseEnter={() => setColumnHoveringIdx(columnIdx)}
                  onClick={() => makePlay(columnIdx)}
                  key={columnIdx}
                >
                  {isGameRunning &&
                    columnHoveringIdx === columnIdx &&
                    (canPlayCondition || type !== TypeEnum.public) && (
                      <img
                        src={currentPlayer === 1 ? markerRed : markerYellow}
                        alt="marker"
                        className="absolute -top-6 animate-bounce z-20"
                      />
                    )}
                </div>
              );
            })}
          </div>
          <GameboardPieces gameMatrix={gameMatrix} makePlay={makePlay} />
        </motion.div>

        <div className="absolute -bottom-[9rem] sm:-bottom-[7rem] z-30">
          {isGameRunning ? (
            <TurnBackground
              currentPlayer={currentPlayer}
              isGameRunning={isGameRunning}
              switchPlayer={switchPlayer}
              randomPlay={randomPlay}
              isModalOpen={isAnyModalOpen}
              owner={owner}
              guest={guest}
            />
          ) : (
            <ReadyBackground
              currentPlayer={currentPlayer}
              handleStartGame={handleStartGame}
              type={type}
              owner={owner}
              guest={guest}
            />
          )}
        </div>
      </div>
    </div>
  );
}