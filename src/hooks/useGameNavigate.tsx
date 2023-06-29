import { useNavigate } from "react-router-dom";

export interface NavigateProps {
  type: "public" | "private" | "cpu";
  roomId?: string;
}

export function useGameNavigate() {
  const navigate = useNavigate();

  const handleNavigateGame = (props: NavigateProps) => {
    navigate("/game", {
      state: {
        type: props.type,
        roomId: props.roomId,
      },
    });
  };

  return { handleNavigateGame };
}
