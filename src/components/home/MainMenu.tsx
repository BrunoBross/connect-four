import { animated, easings, useSpring } from "react-spring";
import { motion } from "framer-motion";

import logo from "../../img/logo.svg";
import playerVsCpu from "../../img/player-vs-cpu.svg";
import playerVsPlayer from "../../img/player-vs-player.svg";
import { Dispatch, SetStateAction } from "react";
import MenuButton from "../utils/MenuButton";
import { useGameNavigate } from "../../hooks/useGameNavigate";

export interface MainMenuProps {
  isRulesModalOpen: boolean;
  setIsRulesModalOpen: Dispatch<SetStateAction<boolean>>;
  isSelectModeModalOpen: boolean;
  setIsSelectModeModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MainMenu(props: MainMenuProps) {
  const {
    isRulesModalOpen,
    setIsRulesModalOpen,
    isSelectModeModalOpen,
    setIsSelectModeModalOpen,
  } = props;

  const { handleNavigateGame } = useGameNavigate();

  const contentAnimation = useSpring({
    transform:
      isRulesModalOpen || isSelectModeModalOpen
        ? "translateY(-150%)"
        : "translateY(0%)",
    config: {
      easing: easings.easeOutSine,
    },
  });

  return (
    <animated.div style={contentAnimation}>
      <motion.div
        className="flex flex-col w-[90vw] sm:w-[450px] h-[550px] bg-background-1 border-[3px] border-black shadow-layout rounded-3xl items-center justify-center"
        animate={{ y: 1 }}
        transition={{
          from: -1000,
          duration: 1,
          type: "spring",
        }}
      >
        <div className="flex flex-col h-full w-full py-10 items-center justify-around">
          <img src={logo} alt="logo" className="w-20" />
          <div className="flex flex-col w-full items-center gap-5">
            <MenuButton
              title="Play vs CPU"
              imgsrc={playerVsCpu}
              onClick={() => handleNavigateGame({ type: "cpu" })}
              bgcolor="bg-pink"
            />
            <MenuButton
              title="Play vs Player"
              imgsrc={playerVsPlayer}
              onClick={() => setIsSelectModeModalOpen(true)}
              bgcolor="bg-yellow"
            />
            <MenuButton
              title="Gamerules"
              onClick={() => setIsRulesModalOpen(true)}
            />
          </div>
        </div>
      </motion.div>
    </animated.div>
  );
}
