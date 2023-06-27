import { ReactNode } from "react";

interface GameContainerProps {
  children: ReactNode;
}

export default function GameContainer(props: GameContainerProps) {
  const { children } = props;

  return (
    <div className="w-screen h-screen relative gap-4 lg:gap-16 flex flex-col bg-background-1 pt-4 xs:pt-6 lg:pt-[6rem] items-center select-none">
      {children}

      <div className="hidden md:block heightXs:hidden absolute w-[100vw] h-[24vh] bg-background-0 bottom-0 rounded-t-[4rem] " />
    </div>
  );
}
