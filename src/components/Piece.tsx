import { motion } from "framer-motion";

import redPiece from "../img/counter-red-large.svg";
import yellowPiece from "../img/counter-yellow-large.svg";

interface PieceProps {
  row: number;
  rowIdx: number;
}

export default function Piece(props: PieceProps) {
  const { row, rowIdx } = props;

  return (
    <div className="flex relative flex-1 justify-center items-center rounded-full">
      {row !== 0 && (
        <motion.img
          src={row === 1 || row === 3 ? redPiece : yellowPiece}
          animate={{ y: [rowIdx * -110, 0, -10, 0] }}
          transition={{
            duration: 0.7,
          }}
          alt="piece img"
        />
      )}
      {row > 2 && (
        <div className="absolute w-1/2 h-1/2 border-[6px] rounded-full" />
      )}
    </div>
  );
}
