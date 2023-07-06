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

interface GameboardProps {
  gameMatrix: number[][];
  isGameRunning: boolean;
  makePlay: (columnIdx: number) => void;
  currentPlayer: number;
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
    type,
    canPlayCondition,
    owner,
    guest,
  } = props;

  const [columnHoveringIdx, setColumnHoveringIdx] = useState(0);

  const cursorPointerCondition =
    isGameRunning && (type !== TypeEnum.public || canPlayCondition);

  const cursorNotAllowedCondition =
    !isGameRunning || (type === TypeEnum.public && !canPlayCondition);

  const sizes =
    "w-[90vw] h-[85vw] sm:w-[60vw] sm:h-[56.5vw] lg:w-[50vw] lg:h-[47vw] xl:w-[35vw] xl:h-[33vw]";

  return (
    <div className="flex w-full h-full justify-center items-start z-20">
      <div className={`flex justify-center relative ${sizes}`}>
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

          <div className="flex absolute w-full h-full p-[2.7%] gap-[3%] pb-[10.9%] z-30">
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

        <div className="absolute -bottom-[25%] lg:-bottom-[15%] w-[50%] h-[30%] lg:w-[40%] lg:h-[25%]  z-30">
          {isGameRunning ? (
            <TurnBackground />
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
