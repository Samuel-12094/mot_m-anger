(() => {
  "use strict";

  const WORDS_PER_ROUND = 5;
  const TIMES = { 1: 30, 2: 25, 3: 20 };
  const MAX_HINTS = 2;

  const $ = (id) => document.getElementById(id);

  const startPanel = $("start-panel");
  const gamePanel = $("game-panel");
  const endPanel = $("end-panel");
  const levelEl = $("level");
  const scoreEl = $("score");
  const bestEl = $("best");
  const currentEl = $("current");
  const totalEl = $("total");
  const slotsEl = $("slots");
  const lettersEl = $("letters");
  const progressBar = $("progress-bar");
  const feedbackEl = $("feedback");
  const hintBtn = $("hint-btn");
  const shuffleBtn = $("shuffle-btn");
  const validateBtn = $("validate-btn");

  let level = 1;
  let score = 0;
  let best = parseInt(localStorage.getItem("mot_manger_best") || "0", 10);
  bestEl.textContent = best;

  // état d'une partie
  let words = [];
  let wordIndex = 0;
  let currentWord = "";
  let remaining = [];   // lettres non placées (chars)
  let slots = [];       // lettres placées (chars ou null)
  let hintsUsed = 0;
  let timeLeft = TIMES[level];
  let timer = null;
  let active = false;

  function scramble(word) {
    let arr = word.split("");
    do {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    } while (arr.join("") === word);
    return arr;
  }

  function startRound(worldLevel = level) {
    level = worldLevel;
    words = shuffle(WORDS[level]).slice(0, WORDS_PER_ROUND);
    wordIndex = 0;
    score = 0;
    scoreEl.textContent = 0;
    levelEl.textContent = level;
    totalEl.textContent = WORDS_PER_ROUND;
    startPanel.classList.add("hidden");
    endPanel.classList.add("hidden");
    gamePanel.classList.remove("hidden");
    feedbackEl.className = "feedback";
    feedbackEl.textContent = "";
    loadWord();
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function loadWord() {
    clearInterval(timer);
    currentWord = words[wordIndex];
    remaining = scramble(currentWord);
    slots = Array(currentWord.length).fill(null);
    hintsUsed = 0;
    hintBtn.disabled = false;
    currentEl.textContent = wordIndex + 1;
    timeLeft = TIMES[level];
    render();
    startTimer();
  }

  function startTimer() {
    active = true;
    timer = setInterval(() => {
      timeLeft -= 0.1;
      if (timeLeft <= 0) {
        timeLeft = 0;
        clearInterval(timer);
        active = false;
        onTimeout();
      }
      progressBar.style.width = (timeLeft / TIMES[level]) * 100 + "%";
    }, 100);
  }

  function render() {
    // requêtes du thème de la barre selon urgence
    progressBar.style.width = (timeLeft / TIMES[level]) * 100 + "%";

    slotsEl.innerHTML = "";
    slots.forEach((ch, i) => {
      const div = document.createElement("div");
      div.className = "slot" + (ch ? " filled correct" : "");
      div.textContent = ch || "";
      div.addEventListener("click", () => unplace(i));
      slotsEl.appendChild(div);
    });

    lettersEl.innerHTML = "";
    remaining.forEach((ch, i) => {
      const div = document.createElement("div");
      div.className = "tile";
      div.textContent = ch.toUpperCase();
      div.addEventListener("click", () => place(div, i));
      lettersEl.appendChild(div);
    });
  }

  function place(tileEl, i) {
    const idx = slots.indexOf(null);
    if (idx === -1) return; // tout est rempli
    slots[idx] = remaining[i];
    tileEl.classList.add("gone");
    render();
  }

  function unplace(i) {
    if (!slots[i]) return;
    remaining.push(slots[i]);
    slots[i] = null;
    render();
  }

  function validate() {
    if (!active) return;
    if (slots.includes(null)) {
      feedback("Remplis toutes les lettres d'abord.", "wrong");
      return;
    }
    const guess = slots.join("");
    if (guess === currentWord) {
      const bonus = Math.ceil(timeLeft);
      const gain = 100 + bonus * 2;
      score += gain;
      scoreEl.textContent = score;
      feedback("Bien joué ! +" + gain + " pts", "ok");
      clearInterval(timer);
      active = false;
      setTimeout(nextWord, 800);
    } else {
      feedback("Ce n'est pas le bon mot. Réessaie !", "wrong");
    }
  }

  function onTimeout() {
    feedback("Temps écoulé ! Le mot était : " + currentWord.toUpperCase(), "wrong");
    lettersEl.innerHTML = "";
    slotsEl.innerHTML = "";
    setTimeout(nextWord, 1200);
  }

  function nextWord() {
    wordIndex++;
    if (wordIndex >= words.length) {
      endRound();
    } else {
      loadWord();
    }
  }

  function endRound() {
    gamePanel.classList.add("hidden");
    endPanel.classList.remove("hidden");
    $("end-title").textContent = "Partie terminée !";
    $("end-score").textContent = "Niveau " + level + " · Score final : " + score + " pts";
    if (score > best) {
      best = score;
      localStorage.setItem("mot_manger_best", String(best));
      bestEl.textContent = best;
      $("end-score").textContent += " — Nouveau record ! 🎉";
    }
  }

  function giveHint() {
    if (!active || hintsUsed >= MAX_HINTS) return;
    const idx = slots.indexOf(null);
    if (idx === -1) return;
    const target = currentWord[idx];
    const idxLetter = remaining.findIndex((ch) => ch === target);
    if (idxLetter === -1) return;
    slots[idx] = remaining[idxLetter];
    remaining.splice(idxLetter, 1);
    hintsUsed++;
    hintsUsed >= MAX_HINTS ? (hintBtn.disabled = true) : hintBtn.disabled = false;
    render();
  }

  function reshuffle() {
    if (!active) return;
    if (slots.some(Boolean)) {
      slots.forEach((ch, i) => {
        if (ch) {
          remaining.push(ch);
          slots[i] = null;
        }
      });
    }
    remaining = scramble(remaining.join(""));
    render();
  }

  function feedback(msg, cls) {
    feedbackEl.textContent = msg;
    feedbackEl.className = "feedback " + cls;
  }

  // Événements
  $("start-btn").addEventListener("click", () => startRound(level));
  $("replay-btn").addEventListener("click", () => startRound(level));
  $("menu-btn").addEventListener("click", () => {
    gamePanel.classList.add("hidden");
    endPanel.classList.add("hidden");
    startPanel.classList.remove("hidden");
    clearInterval(timer);
    active = false;
  });

  validateBtn.addEventListener("click", validate);
  hintBtn.addEventListener("click", giveHint);
  shuffleBtn.addEventListener("click", reshuffle);

  document.querySelectorAll(".lv").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".lv").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      level = parseInt(b.dataset.level, 10);
    });
  });

  document.querySelector('.lv[data-level="1"]').classList.add("selected");
})();