interface ReadyBackgroundProps {
  currentPlayer: number;
  handleStartGame: () => void;
}

export default function ReadyBackground(props: ReadyBackgroundProps) {
  const { currentPlayer, handleStartGame } = props;

  return (
    <div className="absolute top-[5rem] flex flex-col items-center justify-center">
      <div className="flex flex-col gap-1 absolute items-center justify-center bg-white px-5 py-3 border-[3px] border-b-8 border-black rounded-[2rem] ">
        <p
          className={
            "font-space font-bold text-black uppercase transition-colors"
          }
        >
          Player {currentPlayer} starts
        </p>
        <h1
          className={
            "font-space font-bold text-black text-6xl uppercase transition-colors"
          }
        >
          Ready?
        </h1>
        <button
          className="uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full hover:bg-pink  transition-colors"
          onClick={handleStartGame}
        >
          Play
        </button>
      </div>
    </div>
  );
}
