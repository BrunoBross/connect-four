import { useState } from "react";
import RulesModal from "../components/home/RulesModal";
import SelectModeModal from "../components/home/SelectModeModal";

import "./Home.css";
import MainMenu from "../components/home/MainMenu";
import HomeContainer from "../components/home/HomeContainer";

export default function Home() {
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isSelectModeModalOpen, setIsSelectModeModalOpen] = useState(false);

  return (
    <HomeContainer
      isRulesModalOpen={isRulesModalOpen}
      isSelectModeModalOpen={isSelectModeModalOpen}
    >
      <MainMenu
        isRulesModalOpen={isRulesModalOpen}
        setIsRulesModalOpen={setIsRulesModalOpen}
        isSelectModeModalOpen={isSelectModeModalOpen}
        setIsSelectModeModalOpen={setIsSelectModeModalOpen}
      />

      <SelectModeModal
        isModalOpen={isSelectModeModalOpen}
        setIsModalOpen={setIsSelectModeModalOpen}
      />

      <RulesModal
        isModalOpen={isRulesModalOpen}
        setIsModalOpen={setIsRulesModalOpen}
      />
    </HomeContainer>
  );
}
