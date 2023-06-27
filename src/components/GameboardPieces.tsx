import { v4 as uuid } from "uuid";
import { motion } from "framer-motion";

import redPiece from "../img/counter-red-large.svg";
import yellowPiece from "../img/counter-yellow-large.svg";

interface GameboardPiecesProps {
  gameMatrix: number[][];
  makePlay: (columnIdx: number) => void;
}

export default function GameboardPieces(props: GameboardPiecesProps) {
  const { gameMatrix, makePlay } = props;

  return (
    <div className="flex absolute z-[15] w-full h-full p-4 pb-[4.12rem] gap-4">
      {gameMatrix.map((column, columnIdx) => {
        return (
          <div
            className="flex flex-1 flex-col items-center cursor-pointer gap-[0.8rem]"
            onClick={() => makePlay(columnIdx)}
            key={uuid()}
          >
            {column.map((row, rowIdx) => {
              return (
                <div
                  className="flex flex-1 justify-center items-center rounded-full"
                  key={uuid()}
                >
                  {row !== 0 && (
                    <motion.img
                      src={row === 1 ? redPiece : yellowPiece}
                      animate={{ y: 0 }}
                      transition={{
                        from: rowIdx * -100,
                        duration: 0.5,
                        type: "spring",
                        bounce: 0.25,
                      }}
                      alt="piece img"
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
