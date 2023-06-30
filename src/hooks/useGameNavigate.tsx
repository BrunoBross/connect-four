import { useNavigate } from "react-router-dom";

export enum TypeEnum {
  "public",
  "private",
  "cpu",
}

export interface NavigateProps {
  type: TypeEnum;
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
