import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import markerRed from "../img/marker-red.svg";
import markerYellow from "../img/marker-yellow.svg";
import ReadyBackground from "../components/ReadyBackground";
import TurnBackground from "../components/TurnBackground";
import Scoreboard from "../components/Scoreboard";
import GameHeader from "../components/GameHeader";

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
  const location = useLocation();
  const { type } = location.state;

  const [gameMatrix, setGameMatrix] = useState(defaultGameMatrix);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [playerOnePoints, setPlayerOnePoints] = useState(0);
  const [playerTwoPoints, setPlayerTwoPoints] = useState(0);
  const [isVsPlayer, setIsVsPlayer] = useState(false);

  useEffect(() => {
    type === "player" && setIsVsPlayer(true);
  }, [type]);

  const notifyWinner = useCallback(() => {
    const winner = currentPlayer === 1 ? 2 : 1;
    winner === 1
      ? setPlayerOnePoints((prevState) => prevState + 1)
      : setPlayerTwoPoints((prevState) => prevState + 1);
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
    if (!isGameRunning) {
      return;
    }

    const newGameMatrix = gameMatrix.map((row) => [...row]);
    for (let index = newGameMatrix.length - 1; index >= 0; index--) {
      if (newGameMatrix[columnIdx][index] === 0) {
        newGameMatrix[columnIdx][index] = currentPlayer;
        currentPlayer === 1 ? setCurrentPlayer(2) : setCurrentPlayer(1);
        return setGameMatrix(newGameMatrix);
      }
    }
  };

  const switchPlayer = () => {
    currentPlayer === 1 ? setCurrentPlayer(2) : setCurrentPlayer(1);
  };

  const handleStartGame = () => {
    setIsGameRunning(true);
  };

  const resetGame = () => {
    setGameMatrix(defaultGameMatrix);
    setCurrentPlayer(1);
    setIsGameRunning(false);
    setPlayerOnePoints(0);
    setPlayerTwoPoints(0);
  };

  const RenderColumn = (props: RenderColumnProps) => {
    const { row, columnIdx } = props;
    const [isHovering, setIsHovering] = useState(false);

    return (
      <div
        className={clsx("flex flex-col relative gap-3 w-full items-center", {
          "cursor-pointer": isGameRunning,
        })}
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
        {row.map((element, rowIdx) => {
          return (
            <div
              className={clsx("border-[3px] border-black rounded-full", {
                "bg-background-0 border-t-[14px]": element === 0,
                "bg-pink border-t-8": element === 1,
                "bg-yellow border-t-8": element === 2,
              })}
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
      <GameHeader resetGame={resetGame} />

      <Scoreboard
        playerOnePoints={playerOnePoints}
        playerTwoPoints={playerTwoPoints}
        isVsPlayer={isVsPlayer}
      />

      <div className="w-[40rem] h-[35rem] z-10 bg-white border-[3px] border-b-8 border-black rounded-[2rem]">
        <div className="flex w-full p-3">
          {gameMatrix.map((row, columnIdx) => {
            return (
              <RenderColumn row={row} columnIdx={columnIdx} key={columnIdx} />
            );
          })}
        </div>

        <div className="flex relative justify-center">
          {isGameRunning ? (
            <TurnBackground
              currentPlayer={currentPlayer}
              isGameRunning={isGameRunning}
              switchPlayer={switchPlayer}
            />
          ) : (
            <ReadyBackground
              currentPlayer={currentPlayer}
              handleStartGame={handleStartGame}
            />
          )}
        </div>
      </div>

      <div className="absolute w-[100vw] h-[30vh] bg-background-0 bottom-0 rounded-t-[4rem] " />
    </div>
  );
}
