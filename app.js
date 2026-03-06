// ----------------------------
// Firebase Module importieren
// ----------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ----------------------------
// Firebase Config einfügen
// ----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAFICoiUOuH7csjX1kyI1OqGtM6GS8vfBU",
  authDomain: "schach-online-25607.firebaseapp.com",
  databaseURL: "https://schach-online-25607-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "schach-online-25607"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ----------------------------
// Schach-Logik initialisieren
// ----------------------------
const game = new Chess();

// ----------------------------
// Schachbrett erstellen
// ----------------------------
let board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: onDrop
});

// ----------------------------
// Aktuelles Spiel
// ----------------------------
let currentGame = "";
let myColor = "white";  // Standardfarbe

// ----------------------------
// Spiel beitreten / erstellen
// ----------------------------
window.joinGame = function() {
  let input = document.getElementById("gameId").value;

  if(!input) {
    // Wenn kein Input, automatisch eine Spiel-ID erstellen
    input = Math.random().toString(36).substring(2,8);
    alert("Neue Spiel-ID: " + input);
  }

  currentGame = input;

  // Zufällig Farbe wählen (weiß oder schwarz)
  myColor = Math.random() > 0.5 ? "white" : "black";
  board.orientation(myColor);

  // Moves vom Server hören
  listenMoves();

  alert(`Du spielst ${myColor}. Spiel-ID: ${currentGame}`);
}

// ----------------------------
// Funktion beim Ziehen einer Figur
// ----------------------------
function onDrop(source, target) {
  // Zug prüfen
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if(move === null) return 'snapback'; // illegaler Zug

  // Nur eigene Züge senden
  push(ref(db, "games/" + currentGame + "/moves"), {
    from: source,
    to: target,
    color: myColor
  });

  return;
}

// ----------------------------
// Züge vom Server empfangen
// ----------------------------
function listenMoves() {
  const movesRef = ref(db, "games/" + currentGame + "/moves");

  onChildAdded(movesRef, (data) => {
    const move = data.val();

    // Nur Züge des anderen Spielers ausführen
    if(move.color !== myColor) {
      const legalMove = game.move({
        from: move.from,
        to: move.to,
        promotion: 'q'
      });

      if(legalMove) board.position(game.fen());
    }

    // Schachmatt prüfen
    if(game.isCheckmate()) {
      alert("Schachmatt!");
      board.position(game.fen());
    }

    // Unentschieden prüfen
    if(game.isDraw()) {
      alert("Unentschieden!");
      board.position(game.fen());
    }
  });
}