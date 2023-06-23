import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../img/logo.svg";
import turnBackgroundRed from "../img/turn-background-red.svg";
import turnBackgroundYellow from "../img/turn-background-yellow.svg";
import markerRed from "../img/marker-red.svg";
import markerYellow from "../img/marker-yellow.svg";

interface RenderColumnProps {
  row: number[];
  columnIdx: number;
}

const circleSize = "4.5rem";
const defaultGameMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

export default function Game() {
  const [gameMatrix, setGameMatrix] = useState(defaultGameMatrix);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const notifyWinner = useCallback(() => {
    const winner = currentPlayer === 1 ? 2 : 1;
    alert(`player ${winner} ganhou`);
    resetGame();
  }, [currentPlayer]);

  const verifyColumns = useCallback(() => {
    gameMatrix.forEach((column) => {
      let prev = 0;
      let count = 1;
      for (let index = column.length - 1; index >= 0; index--) {
        const item = column[index];
        if (item !== 0 && item === prev) {
          count++;
          if (count >= 4) {
            return notifyWinner();
          }
        } else {
          count = 1;
        }
        prev = item;
      }
    });
  }, [gameMatrix, notifyWinner]);

  const verifyWinner = useCallback(() => {
    verifyColumns();
  }, [verifyColumns]);

  useEffect(() => {
    verifyWinner();
  }, [verifyWinner, gameMatrix]);

  const makePlay = (columnIdx: number) => {
    const newGameMatrix = gameMatrix.map((row) => [...row]);
    for (let index = newGameMatrix.length - 1; index >= 0; index--) {
      if (newGameMatrix[columnIdx][index] === 0) {
        newGameMatrix[columnIdx][index] = currentPlayer;
        setGameMatrix(newGameMatrix);
        currentPlayer === 1 ? setCurrentPlayer(2) : setCurrentPlayer(1);
        return;
      }
    }
  };

  const resetGame = () => {
    setGameMatrix(defaultGameMatrix);
    setCurrentPlayer(1);
  };

  const RenderColumn = (props: RenderColumnProps) => {
    const { row, columnIdx } = props;
    const [isHovering, setIsHovering] = useState(false);

    return (
      <div
        className="flex flex-col relative gap-3 w-full items-center cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => makePlay(columnIdx)}
      >
        {isHovering && (
          <img
            src={currentPlayer === 1 ? markerRed : markerYellow}
            alt="marker"
            className="absolute -top-14 animate-bounce"
          />
        )}
        {row.map((element, rowIdx) => {
          return (
            <div
              className={clsx(
                "border-[3px] border-black rounded-full cursor-pointer",
                {
                  "bg-background-0 border-t-[14px]": element === 0,
                  "bg-pink border-t-8": element === 1,
                  "bg-yellow border-t-8": element === 2,
                }
              )}
              style={{ width: circleSize, height: circleSize }}
              key={rowIdx}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-[100vw] h-[100vh] gap-12 flex flex-col bg-background-1 pt-[6rem] items-center">
      <div className="flex w-[40rem] justify-between items-center">
        <Link
          className="flex items-center uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink transition-colors"
          to="/"
        >
          Menu
        </Link>
        <img src={logo} alt="logo" />
        <button
          className="uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink  transition-colors"
          onClick={resetGame}
        >
          Restart
        </button>
      </div>

      <div className="w-[40rem] h-[35rem] z-10 bg-white border-[3px] border-b-8 border-black rounded-[2rem]">
        <div className="flex w-full p-3">
          {gameMatrix.map((row, columnIdx) => {
            return (
              <RenderColumn row={row} columnIdx={columnIdx} key={columnIdx} />
            );
          })}
        </div>

        <div className="flex relative justify-center h-full">
          <div className="absolute flex flex-col items-center justify-center">
            <img
              src={
                currentPlayer === 1 ? turnBackgroundRed : turnBackgroundYellow
              }
              alt="turnBackground"
              className="items-center justify-center"
              width={170}
            />
            <div className="flex flex-col absolute items-center justify-center">
              <p
                className={clsx(
                  "font-space font-bold uppercase transition-colors",
                  {
                    "text-white": currentPlayer === 1,
                    "text-black": currentPlayer === 2,
                  }
                )}
              >
                Player {currentPlayer}'s turn
              </p>
              <h1
                className={clsx(
                  "font-space font-bold text-6xl transition-colors",
                  {
                    "text-white": currentPlayer === 1,
                    "text-black": currentPlayer === 2,
                  }
                )}
              >
                29s
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-[100vw] h-[30vh] bg-background-0 bottom-0 rounded-t-[4rem] " />
    </div>
  );
}
