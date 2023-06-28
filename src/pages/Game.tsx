import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Scoreboard from "../components/Scoreboard";
import GameHeader from "../components/GameHeader";
import Gameboard from "../components/Gameboard";
import GameContainer from "../components/GameContainer";
import Modal from "../components/Modal";
import clsx from "clsx";
import { RoomInterface, useRoom } from "../hooks/useRoom";
import { onValue, ref } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "../contexts/authContext";

export const defaultGameMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

export default function Game() {
  const { type, roomId } = useParams();
  const { updateRoom, assignGuest } = useRoom();
  const { user } = useAuth();

  const [isGuest, setIsGuest] = useState(false);

  const [room, setRoom] = useState<RoomInterface>();
  const [gameMatrix, setGameMatrix] = useState(
    room?.gameMatrix || defaultGameMatrix
  );
  const [currentPlayer, setCurrentPlayer] = useState(room?.currentPlayer || 1);
  const [winner, setWinner] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [playerOnePoints, setPlayerOnePoints] = useState(0);
  const [playerTwoPoints, setPlayerTwoPoints] = useState(0);
  const [isVsPlayer, setIsVsPlayer] = useState(false);

  const [isModalWinnerOpen, setIsModalWinnerOpen] = useState(false);
  const [isModalMenuOpen, setIsModalMenuOpen] = useState(false);

  useEffect(() => {
    if (roomId && room && user && room?.owner.id !== user.uid && !room.guest) {
      const userToAssign = {
        id: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        points: 0,
        boardId: 2,
      };
      setIsGuest(true);
      assignGuest(roomId, userToAssign);
    }
  }, [assignGuest, room, roomId, user]);

  useEffect(() => {
    if (roomId) {
      updateRoom(roomId, {
        gameMatrix: gameMatrix,
      });
    }
  }, [gameMatrix, roomId, updateRoom, playerOnePoints, playerTwoPoints]);

  useEffect(() => {
    onValue(ref(database, `/room/${roomId}`), (snapshot) => {
      const data = snapshot.val();
      setRoom(data);
      console.log(data);
      setGameMatrix(data.gameMatrix);
      setCurrentPlayer(data.currentPlayer);
      setIsGameRunning(data.isGameRunning);
    });
  }, [roomId]);

  useEffect(() => {
    type === "player" && setIsVsPlayer(true);
  }, [type]);

  const notifyWinner = useCallback(() => {
    const playerWinner = currentPlayer === 1 ? 2 : 1;
    setWinner(playerWinner);
    playerWinner === 1
      ? setPlayerOnePoints((prevState) => prevState + 1)
      : setPlayerTwoPoints((prevState) => prevState + 1);
    setGameMatrix(defaultGameMatrix);
    setIsModalWinnerOpen(true);
  }, [currentPlayer]);

  const verifyColumns = useCallback(() => {
    for (let colIdx = 0; colIdx < gameMatrix[0].length; colIdx++) {
      let prev = 0;
      let count = 1;
      for (let rowIdx = gameMatrix.length - 1; rowIdx >= 0; rowIdx--) {
        const item = gameMatrix[rowIdx][colIdx];
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
    }
  }, [gameMatrix, notifyWinner]);

  const verifyRows = useCallback(() => {
    for (let rowIdx = gameMatrix.length - 1; rowIdx >= 0; rowIdx--) {
      let prev = 0;
      let count = 1;
      for (let colIdx = 0; colIdx < gameMatrix[rowIdx].length; colIdx++) {
        const item = gameMatrix[rowIdx][colIdx];
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
    }
  }, [gameMatrix, notifyWinner]);

  const verifyMainDiagonals = useCallback(() => {
    for (let startCol = 0; startCol <= gameMatrix[0].length - 4; startCol++) {
      for (let startRow = gameMatrix.length - 1; startRow >= 3; startRow--) {
        const item = gameMatrix[startRow][startCol];
        if (item !== 0) {
          let count = 1;
          let colIdx = startCol + 1;
          let rowIdx = startRow - 1;
          while (
            colIdx < gameMatrix[0].length &&
            rowIdx >= 0 &&
            gameMatrix[rowIdx][colIdx] === item
          ) {
            count++;
            if (count >= 4) {
              return notifyWinner();
            }
            colIdx++;
            rowIdx--;
          }
        }
      }
    }
  }, [gameMatrix, notifyWinner]);

  const verifySecondaryDiagonals = useCallback(() => {
    for (let startCol = gameMatrix[0].length - 1; startCol >= 3; startCol--) {
      for (let startRow = gameMatrix.length - 1; startRow >= 3; startRow--) {
        const item = gameMatrix[startRow][startCol];
        if (item !== 0) {
          let count = 1;
          let colIdx = startCol - 1;
          let rowIdx = startRow - 1;
          while (
            colIdx >= 0 &&
            rowIdx >= 0 &&
            gameMatrix[rowIdx][colIdx] === item
          ) {
            count++;
            if (count >= 4) {
              return notifyWinner();
            }
            colIdx--;
            rowIdx--;
          }
        }
      }
    }
  }, [gameMatrix, notifyWinner]);

  const verifyWinner = useCallback(() => {
    verifyColumns();
    verifyRows();
    verifyMainDiagonals();
    verifySecondaryDiagonals();
  }, [
    verifyColumns,
    verifyRows,
    verifyMainDiagonals,
    verifySecondaryDiagonals,
  ]);

  useEffect(() => {
    verifyWinner();
  }, [gameMatrix, verifyWinner]);

  const canPlayCondition =
    (currentPlayer === 1 && !isGuest) || (currentPlayer === 2 && isGuest);

  const makePlay = (columnIdx: number) => {
    if (!isGameRunning) {
      return;
    }

    if (canPlayCondition) {
      const newGameMatrix = gameMatrix.map((row) => [...row]);
      for (let index = newGameMatrix.length - 1; index >= 0; index--) {
        if (newGameMatrix[columnIdx][index] === 0) {
          newGameMatrix[columnIdx][index] = currentPlayer;
          switchPlayer();
          if (roomId) {
            updateRoom(roomId, {
              gameMatrix: newGameMatrix,
            });
          }
          return;
        }
      }
    }
  };

  const randomPlay = () => {
    const columnIdx = Math.floor(Math.random() * 6);
    makePlay(columnIdx);
  };

  const switchPlayer = () => {
    const newCurrentPlayer = currentPlayer === 1 ? 2 : 1;
    if (roomId) {
      updateRoom(roomId, {
        currentPlayer: newCurrentPlayer,
      });
    }
    setCurrentPlayer(newCurrentPlayer);
  };

  const handleStartGame = () => {
    setIsGameRunning(true);
    if (roomId) {
      updateRoom(roomId, {
        isGameRunning: true,
      });
    }
  };

  const resetGame = () => {
    setGameMatrix(defaultGameMatrix);
    setCurrentPlayer(1);
    setIsGameRunning(false);
    setPlayerOnePoints(0);
    setPlayerTwoPoints(0);
  };

  return (
    <GameContainer>
      <Modal
        isModalOpen={isModalWinnerOpen}
        setIsModalOpen={setIsModalWinnerOpen}
        backgroundColor={winner === 1 ? "bg-pink" : "bg-yellow"}
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
            {isVsPlayer || winner === 1 ? `Player ${winner}` : "CPU"}
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

      <GameHeader
        resetGame={resetGame}
        isModalMenuOpen={isModalMenuOpen}
        setIsModalMenuOpen={setIsModalMenuOpen}
        roomId={roomId}
      />

      <Scoreboard
        playerOnePoints={playerOnePoints}
        playerTwoPoints={playerTwoPoints}
        isVsPlayer={isVsPlayer}
        isGameRunning={isGameRunning}
        owner={room?.owner}
        guest={room?.guest}
      />

      <Gameboard
        gameMatrix={gameMatrix}
        canPlayCondition={canPlayCondition}
        currentPlayer={currentPlayer}
        makePlay={makePlay}
        isGameRunning={isGameRunning}
        handleStartGame={handleStartGame}
        randomPlay={randomPlay}
        switchPlayer={switchPlayer}
        isModalOpen={isModalWinnerOpen || isModalMenuOpen}
        owner={room?.owner}
        guest={room?.guest}
      />
    </GameContainer>
  );
}
