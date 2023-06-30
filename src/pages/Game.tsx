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
import { useGame } from "../contexts/gameContext";
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
    setIsGuest,
    makePlay,
    resetGame,
    handleStartGame,
    closeOrExitRoom,
    canPlayCondition,
  } = useGame();

  const { assignGuest } = useRoom();
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

  // request room data from firebase on every change
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

  const handleGoHome = () => {
    closeOrExitRoom();

    navigate("/");
  };

  return (
    <GameContainer>
      <WinnerModal />

      <GameHeader handleGoHome={handleGoHome} />

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
        type={type}
        owner={room?.owner}
        guest={room?.guest}
      />
    </GameContainer>
  );
}
