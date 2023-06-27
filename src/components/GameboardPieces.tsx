import Piece from "./Piece";

interface GameboardPiecesProps {
  gameMatrix: number[][];
  makePlay: (columnIdx: number) => void;
}

export default function GameboardPieces(props: GameboardPiecesProps) {
  const { gameMatrix, makePlay } = props;

  return (
    <div className="flex absolute z-[15] w-full h-full justify-center gap-4 px-4 pt-4 pb-16">
      {gameMatrix.map((column, columnIdx) => {
        return (
          <div
            className="flex w-20 flex-col items-center cursor-pointer gap-[0.8rem]"
            onClick={() => makePlay(columnIdx)}
            key={columnIdx}
          >
            {column.map((row, rowIdx) => {
              return (
                <Piece
                  row={row}
                  rowIdx={rowIdx}
                  key={`${columnIdx}-${rowIdx}`}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
