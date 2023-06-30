import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Scoreboard from "../components/game/Scoreboard";
import GameHeader from "../components/game/GameHeader";
import Gameboard from "../components/game/Gameboard";
import GameContainer from "../components/game/GameContainer";
import { RoomInterface, useRoom } from "../hooks/useRoom";
import { onValue, ref } from "firebase/database";
import { database } from "../services/firebase";
import { useAuth } from "../contexts/authContext";
import {
  defaultGameMatrix,
  defaultTime,
  useGame,
} from "../contexts/gameContext";
import { NavigateProps, TypeEnum } from "../hooks/useGameNavigate";
import WinnerModal from "../components/game/modal/WinnerModal";

export default function Game() {
  const { type, roomId } = useLocation().state as NavigateProps;
  const navigate = useNavigate();

  const {
    room,
    setRoom,
    setRoomId,
    setType,
    gameMatrix,
    setGameMatrix,
    currentPlayer,
    setCurrentPlayer,
    isGameRunning,
    setIsGameRunning,
    playerOnePoints,
    playerTwoPoints,
    isGuest,
    setIsGuest,
    makePlay,
    randomPlay,
    resetGame,
  } = useGame();

  const { updateRoom, assignGuest } = useRoom();
  const { user } = useAuth();

  // initial configs
  useEffect(() => {
    setRoomId(roomId);
    setType(type);
  }, [roomId, setRoomId, setType, type]);

  // set guest to room
  useEffect(() => {
    if (
      type === TypeEnum.public &&
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

  const canPlayCondition =
    (currentPlayer === 1 && !isGuest) || (currentPlayer === 2 && isGuest);

  useEffect(() => {
    if (type === TypeEnum.public) {
      onValue(ref(database, `/room/${roomId}`), (snapshot) => {
        const data: RoomInterface = snapshot.val();

        // Atualiza caso nao seja o jogador da vez
        if (canPlayCondition) {
          setGameMatrix(data.gameMatrix);
        }

        setRoom(data);
        setCurrentPlayer(data.currentPlayer);
        setIsGameRunning(data.isGameRunning);

        if (!data || !data.isOpen) {
          resetGame();
          return navigate("/");
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
    setRoom,
    resetGame,
    canPlayCondition,
  ]);

  // const makePlay = (columnIdx: number) => {
  //   if (!isGameRunning) {
  //     return;
  //   }

  //   if (type !== TypeEnum.public || canPlayCondition) {
  //     const newGameMatrix = gameMatrix.map((row) => [...row]);
  //     for (let index = newGameMatrix.length - 1; index >= 0; index--) {
  //       if (newGameMatrix[columnIdx][index] === 0) {
  //         newGameMatrix[columnIdx][index] = currentPlayer;
  //         switchPlayer();
  //         if (type === TypeEnum.public && roomId) {
  //           updateRoom(roomId, {
  //             gameMatrix: newGameMatrix,
  //           });
  //         }
  //         return setGameMatrix(newGameMatrix);
  //       }
  //     }
  //   }
  // };

  // const randomPlay = () => {
  //   const columnIdx = Math.floor(Math.random() * 6);
  //   makePlay(columnIdx);
  // };

  const switchPlayer = () => {
    const newCurrentPlayer = currentPlayer === 1 ? 2 : 1;
    if (type === TypeEnum.public && roomId) {
      updateRoom(roomId, {
        currentPlayer: newCurrentPlayer,
      });
    }
    setCurrentPlayer(newCurrentPlayer);
  };

  const handleStartGame = () => {
    if (type === TypeEnum.public && roomId && room?.guest && !isGuest) {
      updateRoom(roomId, {
        isGameRunning: true,
      });
    }
    setIsGameRunning(true);
  };

  const handleGoHome = () => {
    if (type === TypeEnum.public) {
      if (!isGuest) {
        // Fecha a sala
        updateRoom(roomId!!, {
          isOpen: false,
        });
      } else {
        // Libera convidado e reinicia sala
        updateRoom(roomId!!, {
          guest: null,
          gameMatrix: defaultGameMatrix,
          isGameRunning: false,
          currentPlayer: 1,
          remainingTime: defaultTime,
        });
      }
    }

    resetGame();
    navigate("/");
  };

  return (
    <GameContainer>
      <WinnerModal />

      <GameHeader
        resetGame={resetGame}
        handleGoHome={handleGoHome}
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
        type={type}
        owner={room?.owner}
        guest={room?.guest}
      />
    </GameContainer>
  );
}
