import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGameUtils } from "../hooks/useGameUtils";

interface GameProviderProps {
  children: ReactNode;
}

export interface GameContextInterface {
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
  isVsPlayer: boolean;
  setIsVsPlayer: Dispatch<SetStateAction<boolean>>;
  isGuest: boolean;
  setIsGuest: Dispatch<SetStateAction<boolean>>;
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

export default function GameProvider(props: GameProviderProps) {
  const { children } = props;

  const [gameMatrix, setGameMatrix] = useState(defaultGameMatrix);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [playerOnePoints, setPlayerOnePoints] = useState(0);
  const [playerTwoPoints, setPlayerTwoPoints] = useState(0);
  const [isVsPlayer, setIsVsPlayer] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const { verifyBoard } = useGameUtils({ gameMatrix });

  // const notifyWinner = useCallback(() => {
  //   const playerWinner = currentPlayer === 1 ? 2 : 1;
  //   setWinner(playerWinner);
  //   playerWinner === 1
  //     ? setPlayerOnePoints((prevState) => prevState + 1)
  //     : setPlayerTwoPoints((prevState) => prevState + 1);
  //   setGameMatrix(defaultGameMatrix);
  //   setIsModalWinnerOpen(true);
  // }, [currentPlayer]);

  useEffect(() => {
    if (verifyBoard()) {
      console.log("win");
    }
  }, [gameMatrix, verifyBoard]);

  return (
    <GameContext.Provider
      value={{
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
        isVsPlayer,
        setIsVsPlayer,
        isGuest,
        setIsGuest,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
