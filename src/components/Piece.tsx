import { motion } from "framer-motion";

import redPiece from "../img/counter-red-large.svg";
import yellowPiece from "../img/counter-yellow-large.svg";
import clsx from "clsx";

interface PieceProps {
  row: number;
  rowIdx: number;
}

export default function Piece(props: PieceProps) {
  const { row, rowIdx } = props;

  return (
    <div className="flex relative flex-1 justify-center items-center rounded-full">
      {row !== 0 && (
        <motion.div
          animate={{ y: [(rowIdx + 1) * -80, 0, -10, 0] }}
          transition={{
            duration: 0.7,
          }}
          className="flex justify-center items-center"
        >
          <img
            src={row === 1 || row === 3 ? redPiece : yellowPiece}
            alt="piece img"
          />
          {row > 2 && (
            <div
              className={clsx("absolute w-8 h-8 border-[6px] rounded-full", {
                "border-white": row === 3,
                "border-black": row === 4,
              })}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
