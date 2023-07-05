import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGameUtils } from "../hooks/useGameUtils";
import { RoomInterface, useRoom } from "../hooks/useRoom";
import { NavigateProps, TypeEnum } from "../hooks/useGameNavigate";
import { onValue, ref } from "firebase/database";
import { database } from "../services/firebase";

interface GameProviderProps {
  children: ReactNode;
}

interface GameModalsInterface {
  isModalWinnerOpen: boolean;
  setIsModalWinnerOpen: Dispatch<SetStateAction<boolean>>;
  isModalMenuOpen: boolean;
  setIsModalMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export interface GameContextInterface extends GameModalsInterface {
  room: RoomInterface | undefined;
  setRoom: Dispatch<SetStateAction<RoomInterface | undefined>>;
  roomId: string | undefined;
  setRoomId: Dispatch<SetStateAction<string | undefined>>;
  type: NavigateProps["type"] | undefined;
  setType: Dispatch<SetStateAction<NavigateProps["type"] | undefined>>;

  gameMatrix: number[][];
  setGameMatrix: Dispatch<SetStateAction<number[][]>>;
  currentPlayer: number;
  setCurrentPlayer: Dispatch<SetStateAction<number>>;
  winner: number;
  setWinner: Dispatch<SetStateAction<number>>;
  isGameRunning: boolean;
  setIsGameRunning: Dispatch<SetStateAction<boolean>>;
  playerOnePoints: number;
  setPlayerOnePoints: Dispatch<SetStateAction<number>>;
  playerTwoPoints: number;
  setPlayerTwoPoints: Dispatch<SetStateAction<number>>;
  isGuest: boolean;
  setIsGuest: Dispatch<SetStateAction<boolean>>;
  closeOrExitRoom: () => void;
  handleStartGame: () => void;
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
  canPlayCondition: boolean;
  makePlay: (columnIdx: number) => void;
  randomPlay: () => void;

  resetGame: () => void;
}

const GameContext = createContext({} as GameContextInterface);

export const defaultGameMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

export const defaultTime = 30;

export default function GameProvider(props: GameProviderProps) {
  const { children } = props;

  const [room, setRoom] = useState<RoomInterface>();
  const [roomId, setRoomId] = useState<string | undefined>();
  const [type, setType] = useState<NavigateProps["type"] | undefined>();
  const [isGuest, setIsGuest] = useState(false);

  const [isModalWinnerOpen, setIsModalWinnerOpen] = useState(false);
  const [isModalMenuOpen, setIsModalMenuOpen] = useState(false);

  const [gameMatrix, setGameMatrix] = useState(defaultGameMatrix);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [playerOnePoints, setPlayerOnePoints] = useState(0);
  const [playerTwoPoints, setPlayerTwoPoints] = useState(0);

  const [timer, setTimer] = useState(defaultTime);

  const { verifyBoard } = useGameUtils();
  const { updateRoom, updateOwner, updateGuest } = useRoom();

  const canPlayCondition =
    (currentPlayer === 1 && !isGuest) || (currentPlayer === 2 && isGuest);

  const handleStartGame = () => {
    if (type === TypeEnum.public && roomId && room?.guest && !isGuest) {
      if (room.owner.points !== 0 || room.guest.points !== 0) {
        updateRoom(roomId, {
          gameMatrix: defaultGameMatrix,
        });
      }
      updateRoom(roomId, {
        isGameRunning: true,
      });
    }
    setIsGameRunning(true);
  };

  const resetGame = useCallback(() => {
    setRoom(undefined);
    setRoomId(undefined);
    setType(undefined);
    setIsGuest(false);
    setGameMatrix(defaultGameMatrix);
    setCurrentPlayer(1);
    setIsGameRunning(false);
    setPlayerOnePoints(0);
    setPlayerTwoPoints(0);
  }, [
    setGameMatrix,
    setCurrentPlayer,
    setIsGameRunning,
    setPlayerOnePoints,
    setPlayerTwoPoints,
  ]);

  const notifyWinner = useCallback(async () => {
    if (type === TypeEnum.public) {
      await updateRoom(roomId!, {
        isGameRunning: false,
        gameMatrix: defaultGameMatrix,
      });
      if (currentPlayer === 1) {
        await updateOwner(roomId!, {
          points: playerOnePoints + 1,
        });
      } else {
        await updateGuest(roomId!, {
          points: playerTwoPoints + 1,
        });
      }
    }

    setWinner(currentPlayer);
    setGameMatrix(defaultGameMatrix);
    currentPlayer === 1
      ? setPlayerOnePoints((prevState) => prevState + 1)
      : setPlayerTwoPoints((prevState) => prevState + 1);
    setIsGameRunning(false);
  }, [
    currentPlayer,
    playerOnePoints,
    playerTwoPoints,
    roomId,
    type,
    updateOwner,
    updateGuest,
    updateRoom,
  ]);

  const switchPlayer = useCallback(() => {
    const newCurrentPlayer = currentPlayer === 1 ? 2 : 1;
    if (type === TypeEnum.public && roomId) {
      updateRoom(roomId, {
        currentPlayer: newCurrentPlayer,
      });
    }
    setCurrentPlayer(newCurrentPlayer);
  }, [currentPlayer, roomId, type, updateRoom]);

  const makePlay = useCallback(
    async (columnIdx: number) => {
      if (!isGameRunning) {
        return;
      }
      if (type !== TypeEnum.public || canPlayCondition) {
        const newGameMatrix = gameMatrix.map((row) => [...row]);
        for (let index = newGameMatrix.length - 1; index >= 0; index--) {
          if (newGameMatrix[columnIdx][index] === 0) {
            newGameMatrix[columnIdx][index] = currentPlayer;
            setGameMatrix(newGameMatrix);
            await verifyBoard(newGameMatrix).then(async (hasWin) => {
              hasWin && (await notifyWinner());
            });
            if (type === TypeEnum.public && roomId) {
              updateRoom(roomId, {
                gameMatrix: newGameMatrix,
              });
            }
            return switchPlayer();
          }
        }
      }
    },
    [
      canPlayCondition,
      currentPlayer,
      gameMatrix,
      isGameRunning,
      roomId,
      switchPlayer,
      type,
      updateRoom,
      notifyWinner,
      verifyBoard,
    ]
  );

  const randomPlay = useCallback(() => {
    const columnIdx = Math.floor(Math.random() * 6);
    makePlay(columnIdx);
  }, [makePlay]);

  const closeOrExitRoom = () => {
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
  };

  // Se for convidado, busca o tempo que falta
  useEffect(() => {
    if (type === TypeEnum.public && isGuest) {
      onValue(ref(database, `/room/${roomId}`), (snapshot) => {
        const data: RoomInterface = snapshot.val();

        setTimer(data.remainingTime);
      });
    }
  }, [isGuest, roomId, type]);

  // Se for o dono, atualiza no banco de dados o tempo que falta
  useEffect(() => {
    if (!isGuest && roomId) {
      updateRoom(roomId, {
        remainingTime: timer,
      });
    }
  }, [timer, isGuest, roomId, updateRoom]);

  // Zera o tempo quando muda o jogador (alguem venceu)
  useEffect(() => {
    setTimer(defaultTime);
  }, [currentPlayer]);

  useEffect(() => {
    if (!isGuest && isGameRunning) {
      const interval = setInterval(() => {
        if (timer - 1 < 0) {
          setTimer(defaultTime);
          randomPlay();
          return switchPlayer();
        }

        if (!isModalMenuOpen && !isModalWinnerOpen) {
          setTimer((prevState) => prevState - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [
    isGameRunning,
    timer,
    switchPlayer,
    randomPlay,
    isModalMenuOpen,
    isModalWinnerOpen,
    isGuest,
  ]);
  return (
    <GameContext.Provider
      value={{
        room,
        setRoom,
        roomId,
        setRoomId,
        type,
        setType,
        gameMatrix,
        setGameMatrix,
        currentPlayer,
        setCurrentPlayer,
        winner,
        setWinner,
        isGameRunning,
        setIsGameRunning,
        playerOnePoints,
        setPlayerOnePoints,
        playerTwoPoints,
        setPlayerTwoPoints,
        isGuest,
        setIsGuest,
        isModalMenuOpen,
        setIsModalMenuOpen,
        isModalWinnerOpen,
        setIsModalWinnerOpen,
        closeOrExitRoom,
        handleStartGame,
        timer,
        setTimer,
        makePlay,
        randomPlay,
        resetGame,
        canPlayCondition,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
