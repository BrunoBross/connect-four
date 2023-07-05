import Piece from "./Piece";

interface GameboardPiecesProps {
  gameMatrix: number[][];
  makePlay: (columnIdx: number) => void;
}

export default function GameboardPieces(props: GameboardPiecesProps) {
  const { gameMatrix, makePlay } = props;

  return (
    <div className="flex absolute w-full h-full p-[2.7%] pt-[2.4%] gap-[3%] pb-[10.5%] z-[15]">
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
