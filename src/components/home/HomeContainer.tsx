import clsx from "clsx";
import { ReactNode } from "react";

interface HomeContainerProps {
  isRulesModalOpen: boolean;
  isSelectModeModalOpen: boolean;
  children: ReactNode;
}

export default function HomeContainer(props: HomeContainerProps) {
  const { children, isRulesModalOpen, isSelectModeModalOpen } = props;

  return (
    <div
      className={clsx(
        "w-screen h-screen flex flex-col justify-center items-center transition-colors",
        {
          "bg-background-0": !isRulesModalOpen && !isSelectModeModalOpen,
          "bg-background-1": isRulesModalOpen || isSelectModeModalOpen,
        }
      )}
    >
      {children}
    </div>
  );
}
