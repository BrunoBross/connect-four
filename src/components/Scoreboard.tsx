import playerOne from "../img/player-one.svg";
import playerTwo from "../img/player-two.svg";
import cpu from "../img/cpu.svg";

interface ScoreboardProps {
  playerOnePoints: number;
  playerTwoPoints: number;
  isVsPlayer: boolean;
}

export default function Scoreboard(props: ScoreboardProps) {
  const { playerOnePoints, playerTwoPoints, isVsPlayer } = props;

  return (
    <div className="flex absolute w-full justify-center">
      <div className="flex absolute w-[65rem] top-72 justify-between">
        <div className="flex flex-col gap-1 items-center bg-white w-36 pb-5 pt-10 border-[3px] shadow-layout border-black rounded-3xl ">
          <div className="flex absolute -top-8 w-16 h-16 justify-center">
            <img src={playerOne} alt="playerImg" />
          </div>

          <p
            className={
              "font-space font-bold text-xl uppercase transition-colors"
            }
          >
            {isVsPlayer ? "Player 1" : "You"}
          </p>
          <h1 className={"font-space font-bold text-6xl transition-colors"}>
            {playerOnePoints}
          </h1>
        </div>

        <div className="flex flex-col gap-1 items-center bg-white w-36 pb-5 pt-10 border-[3px] shadow-layout border-black rounded-3xl ">
          <div className="flex absolute -top-8 w-16 h-16 justify-center">
            <img src={isVsPlayer ? playerTwo : cpu} alt="playerImg" />
          </div>
          <p
            className={
              "font-space font-bold text-xl uppercase transition-colors"
            }
          >
            {isVsPlayer ? "Player 2" : "Cpu"}
          </p>
          <h1 className={"font-space font-bold text-6xl transition-colors"}>
            {playerTwoPoints}
          </h1>
        </div>
      </div>
    </div>
  );
}
