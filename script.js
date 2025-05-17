// Game variables
let time = 10;
let timerId;
let score = 0;
let currentLevel = 'easy';
let questionCount = 0;
const maxQuestions = 10;
let highScore = localStorage.getItem('mathQuizHighScore') || 0;
let correctAnswers = 0;
let totalTimeUsed = 0;
let speedBonuses = 0;

// DOM elements
const startMenu = document.getElementById('startMenu');
const quizContainer = document.getElementById('quizContainer');
const resultsContainer = document.getElementById('resultsContainer');
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const backBtnDifficulty = document.getElementById('backBtnDifficulty');
const backBtnResults = document.getElementById('backBtnResults');
const restartBtn = document.getElementById('restartBtn');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const levelDisplay = document.getElementById('levelDisplay');
const difficultyBtns = document.querySelectorAll('.difficulty_btn');
const difficultyMenu = document.getElementById('difficultyMenu');
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');
const progressBar = document.getElementById('progressBar');
const finalScoreEl = document.getElementById('finalScore');
const correctAnswersEl = document.getElementById('correctAnswers');
const totalAnswersEl = document.getElementById('totalAnswers');
const avgTimeEl = document.getElementById('avgTime');
const speedBonusEl = document.getElementById('speedBonus');
const ratingStarsEl = document.getElementById('ratingStars');

// Difficulty levels
const levels = {
  easy: {
    name: 'Лёгкий',
    time: 15,
    operations: ['+', '-'],
    range: [1, 10],
    color: '#2E7D32'
  },
  medium: {
    name: 'Средний',
    time: 12,
    operations: ['+', '-', '*'],
    range: [5, 15],
    color: '#FF8F00'
  },
  hard: {
    name: 'Сложный',
    time: 10,
    operations: ['+', '-', '*', '/'],
    range: [10, 20],
    color: '#7B1FA2'
  }
};

// Initialize
highScoreEl.textContent = highScore;
totalQuestionsEl.textContent = maxQuestions;

// Event listeners
startBtn.addEventListener('click', () => {
  startMenu.classList.add('hidden');
  setTimeout(() => {
    difficultyMenu.style.display = 'flex';
    difficultyMenu.classList.remove('hidden');
  }, 300);
});

backBtn.addEventListener('click', backToMenu);
backBtnDifficulty.addEventListener('click', backToStartMenu);
backBtnResults.addEventListener('click', backToStartMenu);
restartBtn.addEventListener('click', restartGame);

difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLevel = btn.dataset.level;
    startGame();
  });
});

function startGame() {
  difficultyMenu.classList.add('hidden');
  setTimeout(() => {
    quizContainer.style.display = 'block';
    quizContainer.classList.remove('hidden');
  }, 300);
  
  levelDisplay.textContent = levels[currentLevel].name;
  score = 0;
  questionCount = 0;
  correctAnswers = 0;
  totalTimeUsed = 0;
  speedBonuses = 0;
  updateScore();
  generateQuestion();
}

function backToStartMenu() {
  difficultyMenu.classList.add('hidden');
  resultsContainer.classList.add('hidden');
  setTimeout(() => {
    startMenu.style.display = 'flex';
    startMenu.classList.remove('hidden');
  }, 300);
  clearInterval(timerId);
}

function backToMenu() {
  quizContainer.classList.add('hidden');
  setTimeout(() => {
    startMenu.style.display = 'flex';
    startMenu.classList.remove('hidden');
  }, 300);
  clearInterval(timerId);
}

function generateQuestion() {
  if (questionCount >= maxQuestions) {
    endGame();
    return;
  }

  questionCount++;
  currentQuestionEl.textContent = questionCount;
  
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
  questionEl.classList.remove('new');
  void questionEl.offsetWidth; // Trigger reflow
  questionEl.textContent = question;
  questionEl.classList.add('new');

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
  const answerTime = levels[currentLevel].time - time;
  totalTimeUsed += answerTime;

  clearInterval(timerId);

  const buttons = answersEl.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (parseFloat(btn.textContent) === correct) {
      btn.classList.add('correct');
    } else if (selected !== null && parseFloat(btn.textContent) === selected && selected !== correct) {
      btn.classList.add('incorrect');
    }
  });

  setTimeout(() => {
    if (selected === null && correct === null) {
      // Время вышло, пользователь не ответил
      score = Math.max(0, score - 5); // штраф
    } else if (selected === correct) {
      correctAnswers++;
      let points = levels[currentLevel].time;
      const speedBonus = Math.floor((time / levels[currentLevel].time) * 5);
      points += speedBonus;
      speedBonuses += speedBonus;
      score += points;
    } else {
      // Неправильный ответ, можно добавить штраф, если нужно
      score = Math.max(0, score - 5);
    }

    updateScore();
    generateQuestion();
  }, 1500);
}


function resetTimer() {
  time = levels[currentLevel].time;
  timeEl.textContent = time;
  
  // Update progress bar
  progressBar.innerHTML = `<div class="progress-bar-inner" style="width:100%; background:${levels[currentLevel].color}"></div>`;
  const progressBarInner = progressBar.querySelector('.progress-bar-inner');
  
  clearInterval(timerId);
  timerId = setInterval(() => {
    time--;
    timeEl.textContent = time;
    
    // Update progress bar width
    const percent = (time / levels[currentLevel].time) * 100;
    progressBarInner.style.width = `${percent}%`;
    
    // Change color when time is running out
    if (percent < 30) {
      progressBarInner.style.background = '#F44336';
    } else if (percent < 60) {
      progressBarInner.style.background = '#FFC107';
    }
    
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
  // Save high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('mathQuizHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  // Calculate rating (1-5 stars)
  const rating = Math.min(5, Math.max(1, Math.floor(correctAnswers / 2)));
  
  // Show results
  quizContainer.classList.add('hidden');
  setTimeout(() => {
    resultsContainer.style.display = 'flex';
    resultsContainer.classList.remove('hidden');
    
    // Update results
    finalScoreEl.textContent = score;
    correctAnswersEl.textContent = correctAnswers;
    totalAnswersEl.textContent = maxQuestions;
    avgTimeEl.textContent = (totalTimeUsed / maxQuestions).toFixed(1);
    speedBonusEl.textContent = speedBonuses;
    
    // Show stars
    ratingStarsEl.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('div');
      star.className = i <= rating ? 'star' : 'star empty';
      star.innerHTML = '★';
      ratingStarsEl.appendChild(star);
    }
  }, 300);
}

function restartGame() {
  resultsContainer.classList.add('hidden');
  setTimeout(() => {
    startGame();
  }, 300);
}