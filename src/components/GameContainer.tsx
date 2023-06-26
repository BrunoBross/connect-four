import { ReactNode } from "react";

interface GameContainerProps {
  children: ReactNode;
}

export default function GameContainer(props: GameContainerProps) {
  const { children } = props;

  return (
    <div className="w-[100vw] h-[100vh] gap-12 flex flex-col bg-background-1 pt-[6rem] items-center">
      {children}

      <div className="absolute w-[100vw] h-[28vh] bg-background-0 bottom-0 rounded-t-[4rem] " />
    </div>
  );
}
