const Player = Object.freeze({
  X: "X",
  O: "O",
});

let currentPlayer = Player.X;
let isComputerTurn = false; // Indique si c'est le tour de l'ordinateur
let isGameRunning = true; // Indique si le jeu est en cours
let winnerText = document.getElementById("winner");

// Initialiser une grille vide
const grid = Array.from({ length: 3 }, () => Array(3).fill(" "));

// Met à jour le joueur actuel affiché
document.getElementById("currentPlayer").textContent = currentPlayer;

// Fonction pour gérer le clic sur une case
async function handleCellClick(event) {
  if (isComputerTurn) {
    return;
  }

  if (!isGameRunning) {
    return;
  }

  const cell = event.target;
  const [row, col] = cell.id.split("-").slice(1).map(Number);

  if (grid[row][col] !== " ") {
    alert("Cette case est déjà occupée !");
    return;
  }

  grid[row][col] = currentPlayer;
  cell.textContent = currentPlayer;

  const winner = checkWinner();
  if (winner) {
    if (winner === "egalite") {
      winnerText.textContent =
        "Match nul ! C'est quand même nul de pas gagner contre le bot débile :p !";
        await sleep(2000);
        window.location.href = '/match-nul.html';
    } else {
      winnerText.textContent = `Le joueur ${winner} a gagné !`;
      await sleep(2000);
      window.location.href = `/victoire.html?gagnant=${winner}`;
    }

    isGameRunning = false;
    return;
  }

  currentPlayer = currentPlayer === Player.X ? Player.O : Player.X;
  document.getElementById("currentPlayer").textContent = currentPlayer;

  // Si c'est au tour de l'ordinateur, jouer automatiquement
  if (currentPlayer === Player.O) {
    isComputerTurn = true; // Bloquer les clics
    await sleep(1000);
    playComputerTurn();

    const winner = checkWinner();
    if (winner) {
      if (winner === "egalite") {
        winnerText.textContent =
         "Match nul ! C'est quand même nul de pas gagner contre le bot débile :p !";
        await sleep(2000);
        window.location.href = '/match-nul.html';
      } else {
        winnerText.textContent = `Le joueur ${winner} a gagné !`;
        await sleep(2000);
        window.location.href = `/victoire.html?gagnant=${winner}`;
      }

      isGameRunning = false;
      return;
    }

    isComputerTurn = false;
  }
}

// Fonction pour le tour de l'ordinateur
async function playComputerTurn() {
  const emptyCells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row][col] === " ") {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];

  grid[row][col] = Player.O;
  document.getElementById(`cell-${row}-${col}`).textContent = Player.O;

  currentPlayer = Player.X;
  document.getElementById("currentPlayer").textContent = currentPlayer;
}

// Ajouter des écouteurs d'événements sur chaque cellule
document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

// Fonctions checkWinner, resetGame et sleep restent les mêmes

function checkWinner() {
  // Vérifier les lignes et colonnes
  for (let i = 0; i < 3; i++) {
    // Vérification des lignes
    if (
      grid[i][0] !== " " &&
      grid[i][0] === grid[i][1] &&
      grid[i][1] === grid[i][2]
    ) {
      return grid[i][0]; // Retourne le gagnant (X ou O)
    }

    // Vérification des colonnes
    if (
      grid[0][i] !== " " &&
      grid[0][i] === grid[1][i] &&
      grid[1][i] === grid[2][i]
    ) {
      return grid[0][i]; // Retourne le gagnant (X ou O)
    }
  }

  // Vérifier les diagonales
  if (
    grid[0][0] !== " " &&
    grid[0][0] === grid[1][1] &&
    grid[1][1] === grid[2][2]
  ) {
    return grid[0][0]; // Retourne le gagnant (X ou O)
  }

  if (
    grid[0][2] !== " " &&
    grid[0][2] === grid[1][1] &&
    grid[1][1] === grid[2][0]
  ) {
    return grid[0][2]; // Retourne le gagnant (X ou O)
  }

  // Vérifier s'il reste des cases vides (égalité si aucune case vide)
  if (grid.flat().every((cell) => cell !== " ")) {
    return "egalite";
  }

  // Pas de gagnant pour l'instant
  return null;
}

// Fonction de sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
