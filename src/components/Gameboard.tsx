import { useState } from "react";

import markerRed from "../img/marker-red.svg";
import markerYellow from "../img/marker-yellow.svg";
import TurnBackground from "./TurnBackground";
import ReadyBackground from "./ReadyBackground";

import whiteBoard from "../img/board-layer-white-large.svg";
import boardShadow from "../img/board-layer-black-large.svg";

import clsx from "clsx";
import GameboardPieces from "./GameboardPieces";

interface GameboardProps {
  gameMatrix: number[][];
  isGameRunning: boolean;
  makePlay: (columnIdx: number) => void;
  currentPlayer: number;
  switchPlayer: () => void;
  randomPlay: () => void;
  handleStartGame: () => void;
  isModalOpen: boolean;
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
    isModalOpen,
  } = props;

  const [columnHoveringIdx, setColumnHoveringIdx] = useState(0);

  return (
    <div className="flex justify-center">
      <div className="flex justify-center relative w-[90%]">
        <img src={whiteBoard} alt="" className="absolute z-20" />
        <img src={boardShadow} alt="" className="z-10" />
        <div className="flex absolute z-30 w-full h-full p-4 pb-[4.12rem] gap-4">
          {gameMatrix.map((_, columnIdx) => {
            return (
              <div
                className={clsx("flex flex-1 flex-col items-center gap-3", {
                  "cursor-pointer": isGameRunning,
                  "cursor-not-allowed": !isGameRunning,
                })}
                onMouseEnter={() => setColumnHoveringIdx(columnIdx)}
                onClick={() => makePlay(columnIdx)}
                key={columnIdx}
              >
                {isGameRunning && columnHoveringIdx === columnIdx && (
                  <img
                    src={currentPlayer === 1 ? markerRed : markerYellow}
                    alt="marker"
                    className="absolute -top-5 animate-bounce"
                  />
                )}
              </div>
            );
          })}
        </div>

        <GameboardPieces gameMatrix={gameMatrix} makePlay={makePlay} />

        <div className="absolute -bottom-[9rem] sm:-bottom-[7rem] z-30">
          {isGameRunning ? (
            <TurnBackground
              currentPlayer={currentPlayer}
              isGameRunning={isGameRunning}
              switchPlayer={switchPlayer}
              randomPlay={randomPlay}
              isModalOpen={isModalOpen}
            />
          ) : (
            <ReadyBackground
              currentPlayer={currentPlayer}
              handleStartGame={handleStartGame}
            />
          )}
        </div>
      </div>
    </div>
  );
}
