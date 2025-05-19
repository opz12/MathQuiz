// variables
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
let usedFacts = []; // для отслеживания использованных mathFacts


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
    name: 'Сложная арифметика',
    time: 20,
    operations: ['+', '-', '*', '/', '√', '²', '%', 'mixed'],
    range: [10, 100],
    color: '#2E7D32'
  },
  medium: {
    name: 'Средний',
    time: 25,
    operations: [], // удалены арифметические операции
    range: [5, 15],
    color: '#FF8F00'
  },
  hard: {
    name: 'Сложный',
    time: 30,
    operations: [], // удалены арифметические операции
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
  usedFacts = []; // сброс использованных вопросов
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateHardMathQuestion() {
  const { range } = levels[currentLevel];
  const [min, max] = range;
  const questionType = Math.floor(Math.random() * 8);

  let a, b, c, correct, questionText;

  switch(questionType) {
    case 0: // Комбинированные операции
      a = getRandomInt(15, 50);
      b = getRandomInt(10, 30);
      c = getRandomInt(5, 20);
      correct = a + b * c;
      questionText = `${a} + ${b} × ${c} = ?`;
      break;

    case 1: // Степени
      a = getRandomInt(2, 5);
      b = 2;
      correct = Math.pow(a, b);
      questionText = `${a}² = ?`;
      break;

    case 2: // Корни
      a = getRandomInt(2, 10);
      correct = a;
      questionText = `√${a*a} = ?`;
      break;

    case 3: // Проценты
      a = getRandomInt(10, 50);
      b = getRandomInt(100, 500);
      correct = Math.round(b * (a/100));
      questionText = `${a}% от ${b} = ?`;
      break;

    case 4: // Дроби
      const denom = getRandomInt(2, 5);
      a = getRandomInt(1, denom-1);
      b = getRandomInt(1, denom-1);
      correct = a + b;
      questionText = `${a}/${denom} + ${b}/${denom} = ?/${denom}`;
      break;

    case 5: // Уравнения
      a = getRandomInt(5, 20);
      b = getRandomInt(5, 20);
      correct = b - a;
      questionText = `x + ${a} = ${b}, x = ?`;
      break;

    case 6: // Со скобками
      a = getRandomInt(5, 15);
      b = getRandomInt(5, 15);
      c = getRandomInt(2, 5);
      correct = (a + b) * c;
      questionText = `(${a} + ${b}) × ${c} = ?`;
      break;

    case 7: // Комплексный пример
      a = getRandomInt(10, 30);
      b = getRandomInt(5, 15);
      c = getRandomInt(2, 10);
      correct = a * b - c;
      questionText = `${a} × ${b} - ${c} = ?`;
      break;
  }

  const options = generateSmartOptions(correct, range);
  return { questionText, correct, options };
}

function generateSmartOptions(correct, range) {
  const options = [correct];
  const [min, max] = range;
  
  while (options.length < 4) {
    let wrong;
    const errorType = Math.floor(Math.random() * 3);
    
    switch(errorType) {
      case 0: // Ошибка в знаке
        wrong = -correct;
        break;
      case 1: // Ошибка в 1-2 единицы
        wrong = correct + (Math.random() > 0.5 ? 1 : -1) * 
               Math.max(1, Math.floor(Math.random() * 3));
        break;
      case 2: // Случайное число
        wrong = getRandomInt(
          Math.max(min, correct - 10), 
          Math.min(max, correct + 10)
        );
        break;
    }
    
    if (!options.includes(wrong) && wrong !== correct) {
      options.push(wrong);
    }
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function generateQuestion() {
  if (questionCount >= maxQuestions) {
    endGame();
    return;
  }

  questionCount++;
  currentQuestionEl.textContent = questionCount;

  const { operations, range } = levels[currentLevel];
  const [min, max] = range;

  if (currentLevel === 'easy') {
    const useMathFact = mathFacts && mathFacts.some(f => f.level === 'easy' && !usedFacts.includes(f.question)) && Math.random() > 0.5;
  
    if (useMathFact) {
      const facts = mathFacts.filter(f => f.level === 'easy' && !usedFacts.includes(f.question));
      if (facts.length > 0) {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        usedFacts.push(randomFact.question); // запоминаем
        showQuestion(randomFact.question, randomFact.answer, randomFact.options);
        return;
      }
    }
  
    const { questionText, correct, options } = generateHardMathQuestion();
    showQuestion(questionText, correct, options);
    return;
  }
  

  // medium / hard уровни: тоже проверим mathFacts
  const useMathFact = mathFacts && mathFacts.some(fact => fact.level === currentLevel && !usedFacts.includes(fact.question)) && Math.random() > 0.5;


  if (useMathFact) {
    const facts = mathFacts.filter(fact => fact.level === currentLevel);
    if (facts.length > 0) {
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      usedFacts.push(randomFact.question);
      showQuestion(randomFact.question, randomFact.answer, randomFact.options);
      return;
    }
  }

  if (operations.length === 0) {
    // Пропускаем генерацию арифметики — только mathFacts
    generateQuestion(); // Рекурсивный вызов, пока не найдет подходящий факт
    return;
  }
  
  let a, b, correct, questionText;
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  switch(operation) {
    case '+':
      a = getRandomInt(min, max);
      b = getRandomInt(min, max);
      correct = a + b;
      questionText = `${a} + ${b} = ?`;
      break;
    case '-':
      a = getRandomInt(min, max);
      b = getRandomInt(min, a);
      correct = a - b;
      questionText = `${a} - ${b} = ?`;
      break;
    case '*':
      a = getRandomInt(min, Math.floor(max/2));
      b = getRandomInt(min, Math.floor(max/2));
      correct = a * b;
      questionText = `${a} × ${b} = ?`;
      break;
    case '/':
      b = getRandomInt(min, Math.floor(max/2));
      correct = getRandomInt(min, Math.floor(max/2));
      a = b * correct;
      questionText = `${a} ÷ ${b} = ?`;
      break;
  }

  const options = generateOptions(correct, range);
  showQuestion(questionText, correct, options);
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
      wrong = getRandomInt(min, max);
    }
    
    if (!options.includes(wrong)) {
      options.push(wrong);
    }
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function showQuestion(question, correct, options) {
  questionEl.classList.remove('new');
  void questionEl.offsetWidth; // Trigger reflow
  questionEl.textContent = question;
  questionEl.classList.add('new');

  answersEl.innerHTML = '';
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, correct);
    answersEl.appendChild(btn);
  });

  resetTimer();
}

function checkAnswer(selected, correct) {
  const answerTime = levels[currentLevel].time - time;
  totalTimeUsed += answerTime;

  clearInterval(timerId);

  const buttons = answersEl.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    const btnValue = parseFloat(btn.textContent);
    if (btnValue === parseFloat(correct)) {
      btn.classList.add('correct');
    } else if (parseFloat(selected) === btnValue && btnValue !== parseFloat(correct)) {
      btn.classList.add('incorrect');
    }
  });

  setTimeout(() => {
    if (selected === null) {
      score = Math.max(0, score - 5);
    } else if (parseFloat(selected) === parseFloat(correct)) {
      correctAnswers++;
      let points = levels[currentLevel].time;
      const speedBonus = Math.floor((time / levels[currentLevel].time) * 5);
      points += speedBonus;
      speedBonuses += speedBonus;
      score += points;
    } else {
      score = Math.max(0, score - 5);
    }

    updateScore();
    generateQuestion();
  }, 1500);
}

function resetTimer() {
  time = levels[currentLevel].time;
  timeEl.textContent = time;
  
  progressBar.innerHTML = `<div class="progress-bar-inner" style="width:100%; background:${levels[currentLevel].color}"></div>`;
  const progressBarInner = progressBar.querySelector('.progress-bar-inner');
  
  clearInterval(timerId);
  timerId = setInterval(() => {
    time--;
    timeEl.textContent = time;
    
    const percent = (time / levels[currentLevel].time) * 100;
    progressBarInner.style.width = `${percent}%`;
    
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
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('mathQuizHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  const rating = Math.min(5, Math.max(1, Math.floor(correctAnswers / 2)));
  
  quizContainer.classList.add('hidden');
  setTimeout(() => {
    resultsContainer.style.display = 'flex';
    resultsContainer.classList.remove('hidden');
    
    finalScoreEl.textContent = score;
    correctAnswersEl.textContent = correctAnswers;
    totalAnswersEl.textContent = maxQuestions;
    avgTimeEl.textContent = (totalTimeUsed / maxQuestions).toFixed(1);
    speedBonusEl.textContent = speedBonuses;
    
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
