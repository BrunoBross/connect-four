import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD2UCNmvXsj6Uf5F1H9ecB4LmIzn8cDrhc",
  authDomain: "connect-four-84b25.firebaseapp.com",
  databaseURL: "https://connect-four-84b25-default-rtdb.firebaseio.com",
  projectId: "connect-four-84b25",
  storageBucket: "connect-four-84b25.appspot.com",
  messagingSenderId: "572140612658",
  appId: "1:572140612658:web:88f57e99c86519e31ce02b",
  measurementId: "G-91193KZY45",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const databaseRef = ref(database, "room");

// const analytics = getAnalytics(app);

export default app;
