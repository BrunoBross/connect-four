import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const databaseRef = ref(database, "room");

// const analytics = getAnalytics(app);

export default app;
