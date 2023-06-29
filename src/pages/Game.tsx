import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Scoreboard from "../components/game/Scoreboard";
import GameHeader from "../components/game/GameHeader";
import Gameboard from "../components/game/Gameboard";
import GameContainer from "../components/game/GameContainer";
import Modal from "../components/utils/Modal";
import clsx from "clsx";
import { RoomInterface, useRoom } from "../hooks/useRoom";
import { onValue, ref } from "firebase/database";
import { database } from "../services/firebase";
import { useAuth } from "../contexts/authContext";
import { defaultGameMatrix, useGame } from "../contexts/gameContext";
import { NavigateProps } from "../hooks/useGameNavigate";

export default function Game() {
  const { type, roomId } = useLocation().state as NavigateProps;
  const navigate = useNavigate();

  const {
    gameMatrix,
    setGameMatrix,
    currentPlayer,
    setCurrentPlayer,
    winner,
    isGameRunning,
    setIsGameRunning,
    playerOnePoints,
    setPlayerOnePoints,
    playerTwoPoints,
    setPlayerTwoPoints,
    isVsPlayer,
    setIsVsPlayer,
    isGuest,
    setIsGuest,
  } = useGame();

  const { updateRoom, assignGuest } = useRoom();
  const { user } = useAuth();

  const [room, setRoom] = useState<RoomInterface>();

  const [isModalWinnerOpen, setIsModalWinnerOpen] = useState(false);
  const [isModalMenuOpen, setIsModalMenuOpen] = useState(false);

  // set guest to room
  useEffect(() => {
    if (
      type === "public" &&
      roomId &&
      room &&
      user &&
      room?.owner.id !== user.uid
    ) {
      const guestToAssign = {
        id: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        points: 0,
        boardId: 2,
      };
      setIsGuest(true);
      assignGuest(roomId, guestToAssign);
    }
  }, [assignGuest, room, roomId, user, type, setIsGuest]);

  useEffect(() => {
    if (roomId) {
      updateRoom(roomId, {
        gameMatrix: gameMatrix,
      });
    }
  }, [gameMatrix, roomId, updateRoom, playerOnePoints, playerTwoPoints]);

  useEffect(() => {
    if (type === "public") {
      onValue(ref(database, `/room/${roomId}`), (snapshot) => {
        const data: RoomInterface = snapshot.val();

        setRoom(data);
        setGameMatrix(data.gameMatrix);
        setCurrentPlayer(data.currentPlayer);
        setIsGameRunning(data.inProgress);

        if (!data.isOpen) {
          navigate("/");
        }
      });
    }
  }, [
    roomId,
    type,
    setCurrentPlayer,
    setGameMatrix,
    setIsGameRunning,
    navigate,
  ]);

  useEffect(() => {
    type !== "cpu" && setIsVsPlayer(true);
  }, [type, setIsVsPlayer]);

  const canPlayCondition =
    (currentPlayer === 1 && !isGuest) || (currentPlayer === 2 && isGuest);

  const makePlay = (columnIdx: number) => {
    if (!isGameRunning) {
      return;
    }

    if (type !== "public" || canPlayCondition) {
      const newGameMatrix = gameMatrix.map((row) => [...row]);
      for (let index = newGameMatrix.length - 1; index >= 0; index--) {
        if (newGameMatrix[columnIdx][index] === 0) {
          newGameMatrix[columnIdx][index] = currentPlayer;
          switchPlayer();
          if (type === "public" && roomId) {
            updateRoom(roomId, {
              gameMatrix: newGameMatrix,
            });
          } else {
            setGameMatrix(newGameMatrix);
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
    if (type === "public" && roomId) {
      updateRoom(roomId, {
        currentPlayer: newCurrentPlayer,
      });
    }
    setCurrentPlayer(newCurrentPlayer);
  };

  const handleStartGame = () => {
    setIsGameRunning(true);
    if (type === "public" && roomId && room?.guest && !isGuest) {
      console.log("oi");
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

  const handleGoHome = () => {
    if (type === "public") {
      if (!isGuest) {
        updateRoom(roomId!!, {
          isOpen: false,
        });
      } else {
        updateRoom(roomId!!, {
          guest: null,
        });
      }
    } else {
      resetGame();
    }

    navigate("/");
  };

  return (
    <GameContainer>
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
        handleGoHome={handleGoHome}
        isModalMenuOpen={isModalMenuOpen}
        setIsModalMenuOpen={setIsModalMenuOpen}
        roomId={roomId}
      />

      <Scoreboard
        playerOnePoints={playerOnePoints}
        playerTwoPoints={playerTwoPoints}
        isGameRunning={isGameRunning}
        type={type}
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
        type={type}
        owner={room?.owner}
        guest={room?.guest}
      />
    </GameContainer>
  );
}
