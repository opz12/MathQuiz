// Game variables
let time = 10;
let timerId;
let score = 0;
let currentLevel = 'easy';
let questionCount = 0;
const maxQuestions = 10;

// DOM elements
const startMenu = document.getElementById('startMenu');
const quizContainer = document.getElementById('quizContainer');
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const levelDisplay = document.getElementById('levelDisplay');
const difficultyBtns = document.querySelectorAll('.difficulty_btn');
const difficultyMenu = document.getElementById('difficultyMenu');

// Difficulty levels
const levels = {
  easy: {
    name: 'Лёгкий',
    time: 15,
    operations: ['+', '-'],
    range: [1, 10]
  },
  medium: {
    name: 'Средний',
    time: 12,
    operations: ['+', '-', '*'],
    range: [5, 15]
  },
  hard: {
    name: 'Сложный',
    time: 10,
    operations: ['+', '-', '*', '/'],
    range: [10, 20]
  }
};

// Event listeners
startBtn.addEventListener('click', () => {
  startMenu.style.display = 'none';
  difficultyMenu.style.display = 'flex';
});

backBtn.addEventListener('click', backToMenu);

difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLevel = btn.dataset.level;
    startGame();
  });
});

function startGame() {
  difficultyMenu.style.display = 'none';
  quizContainer.style.display = 'block';
  levelDisplay.textContent = levels[currentLevel].name;
  score = 0;
  questionCount = 0;
  updateScore();
  generateQuestion();
}

function backToMenu() {
  quizContainer.style.display = 'none';
  difficultyMenu.style.display = 'none';
  startMenu.style.display = 'flex';
  clearInterval(timerId);
}

function generateQuestion() {
  if (questionCount >= maxQuestions) {
    endGame();
    return;
  }

  questionCount++;
  
  const useMathFact = Math.random() > 0.5 && 
                     mathFacts.some(fact => fact.level === currentLevel);
  
  if (useMathFact) {
    const facts = mathFacts.filter(fact => fact.level === currentLevel);
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    showQuestion(randomFact.question, randomFact.answer, randomFact.options);
  } else {
    const { operations, range } = levels[currentLevel];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const [min, max] = range;
    
    let a, b, correct;
    let questionText;
    
    switch(operation) {
      case '+':
        a = Math.floor(Math.random() * (max - min + 1)) + min;
        b = Math.floor(Math.random() * (max - min + 1)) + min;
        correct = a + b;
        questionText = `${a} + ${b} = ?`;
        break;
      case '-':
        a = Math.floor(Math.random() * (max - min + 1)) + min;
        b = Math.floor(Math.random() * (a - min + 1)) + min;
        correct = a - b;
        questionText = `${a} - ${b} = ?`;
        break;
      case '*':
        a = Math.floor(Math.random() * (max/2 - min/2 + 1)) + min/2;
        b = Math.floor(Math.random() * (max/2 - min/2 + 1)) + min/2;
        correct = a * b;
        questionText = `${a} × ${b} = ?`;
        break;
      case '/':
        b = Math.floor(Math.random() * (max/2 - min/2 + 1)) + min/2;
        correct = Math.floor(Math.random() * (max/2 - min/2 + 1)) + min/2;
        a = b * correct;
        questionText = `${a} ÷ ${b} = ?`;
        break;
    }
    
    const options = generateOptions(correct, range);
    showQuestion(questionText, correct, options);
  }
}

function showQuestion(question, correct, options) {
  questionEl.textContent = question;

  answersEl.innerHTML = '';
  options.sort(() => Math.random() - 0.5).forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, correct);
    answersEl.appendChild(btn);
  });

  resetTimer();
}

function generateOptions(correct, range) {
  const options = [correct];
  const [min, max] = range;
  
  while (options.length < 4) {
    let wrong;
    if (Math.random() > 0.5) {
      wrong = correct + (Math.random() > 0.5 ? 1 : -1) * 
              Math.max(1, Math.floor(Math.random() * 5));
    } else {
      wrong = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    if (!options.includes(wrong)) {
      options.push(wrong);
    }
  }
  
  return options;
}

function checkAnswer(selected, correct) {
  clearInterval(timerId);
  
  const buttons = answersEl.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (parseFloat(btn.textContent) === correct) {
      btn.classList.add('correct');
    } else if (parseFloat(btn.textContent) === selected && selected !== correct) {
      btn.classList.add('incorrect');
    }
  });

  setTimeout(() => {
    if (selected === correct) {
      score += levels[currentLevel].time;
      updateScore();
    }
    generateQuestion();
  }, 1500);
}

function resetTimer() {
  time = levels[currentLevel].time;
  timeEl.textContent = time;
  clearInterval(timerId);
  timerId = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time === 0) {
      clearInterval(timerId);
      checkAnswer(null, null);
    }
  }, 1000);
}

function updateScore() {
  scoreEl.textContent = score;
}

function endGame() {
  alert(`Игра окончена! Ваш счет: ${score}`);
  backToMenu();
}

