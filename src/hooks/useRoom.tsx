import { set, get, ref, update } from "firebase/database";
import { database, databaseRef } from "../services/firebase";
import { useAuth } from "../contexts/authContext";
import { defaultGameMatrix, defaultTime } from "../contexts/gameContext";

export interface PlayerInterface {
  id: string;
  name: string | null;
  photoURL: string | null;
  email: string | null;
  points: number;
  boardId: number; //identificador de player 1 ou 2
}

interface DefaultRoomInterface {
  gameMatrix: number[][];
  isGameRunning: boolean;
  currentPlayer: number;
  isOpen: boolean;
  remainingTime: number;
}

export interface RoomInterface extends DefaultRoomInterface {
  owner: PlayerInterface;
  guest?: PlayerInterface;
}

const generateRoomKey = (): string => {
  return String(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
};

export const defaultRoomValues: DefaultRoomInterface = {
  gameMatrix: defaultGameMatrix,
  isGameRunning: false,
  currentPlayer: 1,
  isOpen: true,
  remainingTime: defaultTime,
};

export function useRoom() {
  const { user } = useAuth();

  const assignGuest = (roomId: string, guest: RoomInterface["guest"]) => {
    if (guest) {
      update(ref(database, `/room/${roomId}/guest`), guest);
    }
  };

  const updateOwner = async (roomId: string, newData: any) => {
    await update(ref(database, `room/${roomId}/owner`), newData);
  };

  const updateGuest = async (roomId: string, newData: any) => {
    await update(ref(database, `room/${roomId}/guest`), newData);
  };

  const updateRoom = async (roomId: string, newData: any) => {
    await update(ref(database, `/room/${roomId}`), newData);
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

  const verifyRoomExists = async (roomId: string) => {
    let exists = false;

    await get(databaseRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const rooms = Object.entries(snapshot.val());
          rooms.forEach((room_) => {
            const roomId_ = room_[0];
            const room = room_[1] as RoomInterface;
            if (roomId_ === String(roomId) && room.isOpen && !room.guest) {
              exists = true;
            }
          });
        } else {
          console.log("No data");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return exists;
  };

  const createRoom = async () => {
    if (!user) {
      alert("User not authenticated");
      return null;
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
      ...defaultRoomValues,
    };

    const roomId = generateRoomKey();

    await set(ref(database, `/room/${roomId}`), data).catch((error) => {
      console.log(error);
      return null;
    });

    return roomId;
  };

  return {
    createRoom,
    verifyRoomExists,
    getRoomById,
    updateRoom,
    updateOwner,
    updateGuest,
    assignGuest,
  };
}
