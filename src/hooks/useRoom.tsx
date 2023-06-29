import { set, get, ref, update } from "firebase/database";
import { database, databaseRef } from "../services/firebase";
import { useAuth } from "../contexts/authContext";
import { defaultGameMatrix } from "../contexts/gameContext";
import { useGameNavigate } from "./useGameNavigate";

export interface PlayerInterface {
  id: string;
  name: string | null;
  photoURL: string | null;
  email: string | null;
  points: number;
  boardId: number; //identificador de player 1 ou 2
}

export interface RoomInterface {
  owner: PlayerInterface;
  gameMatrix: number[][];
  guest?: PlayerInterface;
  inProgress: boolean;
  currentPlayer: number;
  isOpen: boolean;
}

const generateRoomKey = (): string => {
  return String(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
};

export function useRoom() {
  const { handleNavigateGame } = useGameNavigate();
  const { user } = useAuth();

  const assignGuest = (roomId: string, guest: RoomInterface["guest"]) => {
    if (guest) {
      update(ref(database, `/room/${roomId}/guest`), guest);
    }
  };

  const updateRoom = (roomId: string, newData: any) => {
    update(ref(database, `/room/${roomId}`), newData);
  };

  const getRoomById = (roomId: string) => {
    get(databaseRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const rooms = Object.entries(snapshot.val());
          rooms.forEach((room) => {
            const roomId_ = room[0];
            const data = room[1];
            if (roomId_ === roomId) {
              return data;
            }
          });
        } else {
          console.log("No data");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const joinRoom = (roomId: string) => {
    get(databaseRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const rooms = Object.entries(snapshot.val());
          rooms.forEach((room_) => {
            const roomId_ = room_[0];
            const room = room_[1] as RoomInterface;
            if (roomId_ === String(roomId) && room.isOpen && !room.guest) {
              return handleNavigateGame({
                type: "public",
                roomId: roomId,
              });
            }
          });
        } else {
          console.log("No data");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createRoom = () => {
    if (!user) {
      return alert("User not authenticated");
    }

    const data: RoomInterface = {
      owner: {
        id: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        points: 0,
        boardId: 1,
      },
      gameMatrix: defaultGameMatrix,
      inProgress: false,
      currentPlayer: 1,
      isOpen: true,
    };

    const roomId = generateRoomKey();

    set(ref(database, `/room/${roomId}`), data)
      .then(() => {
        handleNavigateGame({
          type: "public",
          roomId: roomId,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { createRoom, joinRoom, getRoomById, updateRoom, assignGuest };
}
