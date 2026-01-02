// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;

const INLINE_TEST_QUESTIONS = [
  {
    q: "Welche Gruppen waren maßgeblich am Beginn der Revolution 1848 beteiligt?",
    a: [
      "Studenten, Bürger und Bauern",
      "Bauern, Juristen und Militär",
      "Adel und Klerus"
    ],
    correct: 0
  },
  {
    q: "Welche Parteien waren Teil der ersten Nachkriegsregierung Österreichs?",
    a: [
      "Österreichische Volkspartei und Sozialistische Partei Österreichs",
      "Christlich-soziale Partei und Freiheitliche Partei",
      "Kommunistische Partei und Volkspartei"
    ],
    correct: 0
  },
  {
    q: "Welche Reform führte Maria Theresia für alle Kinder ein?",
    a: [
      "Die allgemeine Schulpflicht",
      "Die Wehrpflicht",
      "Die Krankenversicherung"
    ],
    correct: 0
  },
  {
    q: "Wie viele Sprachen waren im 19. Jahrhundert in Österreich-Ungarn offiziell anerkannt?",
    a: [
      "Elf",
      "Acht",
      "Fünf"
    ],
    correct: 0
  },
  {
    q: "Wann wurde die Republik Österreich nach dem Zweiten Weltkrieg wieder ausgerufen?",
    a: [
      "1945",
      "1943",
      "1948"
    ],
    correct: 0
  },
  {
    q: "Wann trat Österreich der Europäischen Union bei?",
    a: [
      "1995",
      "1989",
      "2004"
    ],
    correct: 0
  },
  {
    q: "Wer wählt den Bundespräsidenten in Österreich?",
    a: [
      "Das Volk",
      "Der Nationalrat",
      "Der Bundeskanzler"
    ],
    correct: 0
  },
  {
    q: "Wie viele Wähler müssen ein Volksbegehren unterschreiben, damit es wirksam wird?",
    a: [
      "100.000",
      "200.000",
      "10.000"
    ],
    correct: 0
  },
  {
    q: "Wie viele Gemeinden gibt es in Österreich?",
    a: [
      "Über 2.000",
      "Über 3.000",
      "Über 300"
    ],
    correct: 0
  },
  {
    q: "Wie viele Bundesländer hat Österreich?",
    a: [
      "9",
      "8",
      "11"
    ],
    correct: 0
  },
  {
    q: "Wer wählt das Europäische Parlament?",
    a: [
      "Die EU-Bürgerinnen und EU-Bürger",
      "Die Regierungen der Mitgliedstaaten",
      "Die Europäische Kommission"
    ],
    correct: 0
  }
];

// ----------------------------
// STATE
// ----------------------------
let correctCount = 0;
let wrongCount = 0;
let answeredCount = 0;
let totalQuestions = INLINE_TEST_QUESTIONS.length;

let currentRow = 0;

// ----------------------------
// UI TARGETS
// ----------------------------
const container = document.getElementById("inline-test-questions");
const expandBtn = document.getElementById("inline-test-expand");

// ----------------------------
// PROGRESS DISPLAY
// ----------------------------
function updateProgressDisplay() {
  document.getElementById("inline-progress-text").textContent =
    `Fortschritt: ${answeredCount} / ${totalQuestions} Fragen`;
}

function updateProgressBar() {
  const pct = (answeredCount / totalQuestions) * 100;
  document.getElementById("inline-progressbar").style.width = pct + "%";
}

// ----------------------------
// UTILITIES
// ----------------------------
function shuffleAnswers(question) {
  const combined = question.a.map((opt, index) => ({
    text: opt,
    isCorrect: index === question.correct
  }));

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  question.a = combined.map(i => i.text);
  question.correct = combined.findIndex(i => i.isCorrect);
}

function createDonutChart() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const C = 2 * Math.PI * 40;

  return `
    <div class="donut-wrapper">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="#ebe6ff" stroke-width="12" fill="none"></circle>
        <circle cx="50" cy="50" r="40" stroke="#6d4aff" stroke-width="12" fill="none"
          stroke-dasharray="${(pct / 100) * C} ${(1 - pct / 100) * C}"
          transform="rotate(-90 50 50)" stroke-linecap="round"></circle>
      </svg>
      <div class="donut-center">${pct}%</div>
    </div>
  `;
}

function createEndCard() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const card = document.createElement("div");
  card.className = "inline-question-card end-card";

  const title =
    pct >= 80 ? "Sehr gut!" :
    pct >= 50 ? "Guter Fortschritt!" :
    pct >= 25 ? "Ein solider Anfang" :
    "Weiter üben";

  card.innerHTML = `
    <h3>${title}</h3>
    ${createDonutChart()}
    <p>
      Sie haben die kostenlosen Beispielfragen abgeschlossen.<br>
      Erhalten Sie Zugriff auf <strong>hunderte prüfungsnahe Fragen zum österreichischen Staatsbürgerschaftstest</strong>,
      realistische Simulationen und klare Erklärungen.
    </p>
    <a href="https://civiclearn.com/austria/checkout" class="hero-primary-btn">
      Vollzugang freischalten
    </a>
  `;

  return card;
}


// ----------------------------
// BUILD ROWS
// ----------------------------
const rows = [];
for (let i = 0; i < totalQuestions; i += QUESTIONS_PER_ROW) {
  rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
}

INLINE_TEST_QUESTIONS.forEach(q => shuffleAnswers(q));

// ----------------------------
// RENDERING
// ----------------------------
function renderRow(rowIndex) {
  if (!rows[rowIndex]) return;

  rows[rowIndex].forEach((q, offset) => {
    const absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
    container.appendChild(createQuestionCard(q, absoluteIndex));
  });
}

function createQuestionCard(questionObj, absoluteIndex) {
  const card = document.createElement("div");
  card.className = "inline-question-card";

  const title = document.createElement("h3");
  title.textContent = questionObj.q;

  const feedback = document.createElement("div");
  feedback.className = "inline-feedback";

  card.append(title);

  questionObj.a.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "inline-option-btn";
    btn.textContent = opt;

    btn.onclick = () => {
      answeredCount++;
      updateProgressDisplay();
      updateProgressBar();

    if (i === questionObj.correct) {
  correctCount++;
  feedback.textContent = "Richtig!";
  feedback.classList.add("inline-correct");
} else {
  wrongCount++;
  feedback.textContent =
    "Richtige Antwort: " + questionObj.a[questionObj.correct];
  feedback.classList.add("inline-wrong");
}


      card.querySelectorAll("button").forEach(b => (b.disabled = true));
      card.appendChild(feedback);

      const isLastQuestion = absoluteIndex === totalQuestions - 1;

      if (isLastQuestion) {
        setTimeout(() => container.appendChild(createEndCard()), 300);
      }

      const isLastInRow =
        (absoluteIndex + 1) % QUESTIONS_PER_ROW === 0 &&
        absoluteIndex !== totalQuestions - 1;

      if (isLastInRow) {
        currentRow++;
        renderRow(currentRow);
      }
    };

    card.appendChild(btn);
  });

  return card;
}

// ----------------------------
// INITIAL RENDER
// ----------------------------
renderRow(0);
updateProgressDisplay();
updateProgressBar();

// ----------------------------
// CONTINUE BUTTON
// ----------------------------
expandBtn.onclick = () => {
  currentRow = 1;
  renderRow(currentRow);
  expandBtn.style.display = "none";
};
