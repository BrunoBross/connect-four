import clsx from "clsx";
import { useState } from "react";

import markerRed from "../img/marker-red.svg";
import markerYellow from "../img/marker-yellow.svg";
import TurnBackground from "./TurnBackground";
import ReadyBackground from "./ReadyBackground";

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

interface RenderColumnProps {
  column: number[];
  columnIdx: number;
}

const circleSize = "4.5rem";

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

  const RenderBoard = () => {
    return (
      <div className="flex w-full h-[95%] py-4 px-2 justify-between z-[20]">
        {gameMatrix.map((column, columnIdx) => {
          return (
            <RenderColumns
              column={column}
              columnIdx={columnIdx}
              key={columnIdx}
            />
          );
        })}
      </div>
    );
  };

  const RenderColumns = (props: RenderColumnProps) => {
    const { column, columnIdx } = props;
    const [isHovering, setIsHovering] = useState(false);

    return (
      <div
        className={clsx(
          "flex flex-col w-full relative justify-between items-center",
          {
            "cursor-pointer": isGameRunning,
          }
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => makePlay(columnIdx)}
      >
        {isGameRunning && isHovering && (
          <img
            src={currentPlayer === 1 ? markerRed : markerYellow}
            alt="marker"
            className="absolute -top-14 animate-bounce"
          />
        )}
        {column.map((element, columnIdx) => {
          return (
            <div
              className={clsx("border-[3px] border-black rounded-full", {
                "bg-background-1 border-t-[14px]": element === 0,
                "bg-pink border-t-8": element === 1,
                "bg-yellow border-t-8": element === 2,
              })}
              style={{ width: circleSize, height: circleSize }}
              key={columnIdx}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-[40rem] h-[35rem] z-10 border-[3px] bg-white shadow-layout border-black rounded-3xl">
      <div className="flex relative justify-center">
        <div className="absolute -bottom-[43rem]">
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

      <RenderBoard />
    </div>
  );
}
