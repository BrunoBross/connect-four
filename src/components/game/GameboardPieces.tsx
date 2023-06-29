import Piece from "./Piece";

interface GameboardPiecesProps {
  gameMatrix: number[][];
  makePlay: (columnIdx: number) => void;
}

export default function GameboardPieces(props: GameboardPiecesProps) {
  const { gameMatrix, makePlay } = props;

  return (
    <div className="flex z-[15] w-full h-full gap-[1vw] px-[0.9vw] pt-[0.9vw] pb-[3.5vw]">
      {gameMatrix.map((column, columnIdx) => {
        return (
          <div
            className="flex flex-1 flex-col gap-[1vw] cursor-pointer"
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
