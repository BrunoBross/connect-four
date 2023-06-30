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

  const { verifyBoard } = useGameUtils({ gameMatrix });
  const { updateRoom } = useRoom();

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

  const notifyWinner = useCallback(() => {
    const playerWinner = currentPlayer === 1 ? 2 : 1;
    setWinner(playerWinner);
    playerWinner === 1
      ? setPlayerOnePoints((prevState) => prevState + 1)
      : setPlayerTwoPoints((prevState) => prevState + 1);
    setGameMatrix(defaultGameMatrix);
    setIsModalWinnerOpen(true);
  }, [
    currentPlayer,
    setGameMatrix,
    setIsModalWinnerOpen,
    setPlayerOnePoints,
    setPlayerTwoPoints,
    setWinner,
  ]);

  const canPlayCondition =
    (currentPlayer === 1 && !isGuest) || (currentPlayer === 2 && isGuest);

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
    (columnIdx: number) => {
      if (!isGameRunning) {
        return;
      }

      if (type !== TypeEnum.public || canPlayCondition) {
        const newGameMatrix = gameMatrix.map((row) => [...row]);
        for (let index = newGameMatrix.length - 1; index >= 0; index--) {
          if (newGameMatrix[columnIdx][index] === 0) {
            newGameMatrix[columnIdx][index] = currentPlayer;
            switchPlayer();
            setGameMatrix(newGameMatrix);
            if (type === TypeEnum.public && roomId) {
              updateRoom(roomId, {
                gameMatrix: newGameMatrix,
              });
            }
            return;
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
    ]
  );

  const randomPlay = useCallback(() => {
    const columnIdx = Math.floor(Math.random() * 6);
    makePlay(columnIdx);
  }, [makePlay]);

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

  useEffect(() => {
    if (verifyBoard()) {
      notifyWinner();
    }
  }, [gameMatrix, verifyBoard, notifyWinner]);

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
        makePlay,
        randomPlay,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);