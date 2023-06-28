import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  UserInfo,
  signOut,
  getAuth,
} from "firebase/auth";
import { auth, database } from "../config/firebase";
import { ref, set } from "firebase/database";

interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextInterface {
  signed: boolean;
  user: UserInfo | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const AuthContext = createContext({} as AuthContextInterface);

export default function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      set(ref(database, `/users/${user.uid}`), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      })
        .then(() => {
          setUser(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  async function loginWithGoogle() {
    setIsLoading(true);
    const googleProvider = new GoogleAuthProvider();

    await signInWithPopup(auth, googleProvider)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(user),
        user,
        loginWithGoogle,
        logout,
        isLoading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
