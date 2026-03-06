import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFICoiUOuH7csjX1kyI1OqGtM6GS8vfBU",
  authDomain: "schach-online-25607.firebaseapp.com",
  databaseURL: "https://schach-online-25607-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "schach-online-25607"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);