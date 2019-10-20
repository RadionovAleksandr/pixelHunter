(function () {
  'use strict';

  const main = document.querySelector(`#main`);

  const showScreen = (e) => {
    main.innerHTML = ``;
    main.appendChild(e);
  };

  console.log(` модуль AbstractView 
отдает элемент: get element();

`);
  class AbstractView {
      constructor() {
          if (new.target === AbstractView) {
              throw new Error(`Can't instantiate AbstractView, only concrete one`);
          }
      }

      get template() {
          throw new Error(`Template is required`);
      }

      get element() {
          if (this._element) {
              return this._element;
          }
          this._element = this.render();
          this.bind(this._element);
          return this._element;
      }

      render() {
          const div = document.createElement(`div`);
          div.innerHTML = this.template.trim();
          return div;
      }

      bind() {}
  }

  console.log(' модуль intro-view ');

  class Intro extends AbstractView {
      constructor() {
          super();
      }

      get template() {
          return `
      <section class="intro">
        <button class="intro__asterisk asterisk" type="button">
        <span class="visually-hidden">Продолжить</span>*</button>
        <p class="intro__motto"><sup>*</sup> Это не фото. Это рисунок маслом нидерландского художника-фотореалиста Tjalf Sparnaay.</p>
      </section>`;
      }

      bind() {
          const asterisk = this.element.querySelector(`.intro__asterisk`);
          asterisk.addEventListener(`click`, (e) => {
              e.preventDefault();
              this.onButtonClick();
          });
      }

      onButtonClick() {}
  }

  console.log(' модуль intro-screen ');

  class IntroScreen {
      get element() {
          const intro = new Intro();
          intro.onButtonClick = () => Router.showGreeting();

          return intro.element;
      }
  }

  class Greeting extends AbstractView {
    constructor() {
      super();
    }

    get template() {
      return `
      <section class="greeting central--blur">
        <img class="greeting__logo" src="img/logo_ph-big.svg" width="201" height="89" alt="Pixel Hunter">
        <div class="greeting__asterisk asterisk"><span class="visually-hidden">Я просто красивая звёздочка</span>*</div>
        <div class="greeting__challenge">
          <h3 class="greeting__challenge-title">Лучшие художники-фотореалисты бросают тебе вызов!</h3>
          <p class="greeting__challenge-text">Правила игры просты:</p>
          <ul class="greeting__challenge-list">
            <li>Нужно отличить рисунок от фотографии и сделать выбор.</li>
            <li>Задача кажется тривиальной, но не думай, что все так просто.</li>
            <li>Фотореализм обманчив и коварен.</li>
            <li>Помни, главное — смотреть очень внимательно.</li>
          </ul>
        </div>
        <button class="greeting__continue" type="button">
          <span class="visually-hidden">Продолжить</span>
          <svg class="icon" width="64" height="64" viewBox="0 0 64 64" fill="#000000">
            <use xlink:href="img/sprite.svg#arrow-right"></use>
          </svg>
        </button>
      </section>`;
    }

    bind() {
      const arrowRight = this.element.querySelector(`.greeting__continue`);
      arrowRight.addEventListener(`click`, (e) => {
        e.preventDefault();
        this.onButtonClick();
      });
    }

    onButtonClick() {}
  }

  class GreetingScreen {
      get element() {
          const greeting = new Greeting();
          greeting.onButtonClick = () => Router.showRules();

          return greeting.element;
      }
  }

  class BackButton extends AbstractView {
    constructor() {
      super();
    }

    get template() {
      return `<button class="back">
    <span class="visually-hidden">Вернуться к началу</span>
    <svg class="icon" width="45" height="45" viewBox="0 0 45 45" fill="#000000">
      <use xlink:href="img/sprite.svg#arrow-left"></use>
    </svg>
    <svg class="icon" width="101" height="44" viewBox="0 0 101 44" fill="#000000">
      <use xlink:href="img/sprite.svg#logo-small"></use>
    </svg>
    </button>`;
    }
  }

  class Rules extends AbstractView {
    constructor() {
      super();
    }

    get template() {
      console.log(new BackButton());
      console.log(BackButton);
      return `
      <header class="header">
      ${new BackButton().template}
      </header>
      <section class="rules">
        <h2 class="rules__title">Правила</h2>
        <ul class="rules__description">
          <li>Угадай 10 раз для каждого изображения фото
            <img class="rules__icon" src="img/icon-photo.png" width="32" height="31" alt="Фото"> или рисунок
            <img class="rules__icon" src="img/icon-paint.png" width="32" height="31" alt="Рисунок"></li>
          <li>Фотографиями или рисунками могут быть оба изображения.</li>
          <li>На каждую попытку отводится 30 секунд.</li>
          <li>Ошибиться можно не более 3 раз.</li>
        </ul>
        <p class="rules__ready">Готовы?</p>
        <form class="rules__form">
          <input class="rules__input" type="text" placeholder="Ваше Имя">
          <button class="rules__button  continue" type="submit" disabled>Go!</button>
        </form>
      </section>`;
    }

    bind() {
      const goBtn = this.element.querySelector(`.rules__button`);
      const inputName = this.element.querySelector(`.rules__input`);
      const backButton = this.element.querySelector(`.back`);

      inputName.addEventListener(`input`, () => {
        goBtn.disabled = (inputName.value < 1);
      });

      goBtn.addEventListener(`click`, (e) => {
        e.preventDefault();
        this.onButtonClick();
      });

      backButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        this.onBackButtonClick();
      });
    }

    onButtonClick() {}

    onBackButtonClick() {}
  }

  class RulesScreen {
    get element() {
      const rulesScreen = new Rules();
      rulesScreen.onButtonClick = () => Router.showGame();
      rulesScreen.onBackButtonClick = () => Router.showGreeting();

      return rulesScreen.element;
    }
  }

  const QUICK_ANSWER = 10000;
  const SLOW_ANSWER = 20000;

  const INITIAL_STATE = Object.freeze({
      level: 0,
      lives: 3,
      time: 10,
      questions: 10,
      savedGamesCount: 3,
      answers: [],
      playedGames: []
  });

  const Answer = {
      RIGHT: 100,
      QUICK: 50,
      SLOW: 50,
      BONUS_FOR_LIVES: 50,
  };

  const ONE_SECOND = 1000;

  const gameData = (state) => {
      const lives = state.lives;
      const answers = state.answers;

      let acc = 0;
      let scores = 0;
      const livesBonus = Answer.BONUS_FOR_LIVES * lives;

      if (livesBonus) {
          scores += livesBonus;
      }


      // для каждого элемента answers записываем в массив елемента записываем answer и time
      answers.forEach((el) => {
          const [answer, time] = el;

          if (answer) {
              acc += 1;
              scores += Answer.RIGHT;
          }
          if (answer && (time < QUICK_ANSWER)) {
              scores += Answer.QUICK;
          }
          if (answer && (time > SLOW_ANSWER)) {
              scores -= Answer.SLOW;
          }
      });
      // не понятна логика
      if (acc < INITIAL_STATE.questions - INITIAL_STATE.lives) {
          console.log(` Проиграл `);
          return -1;
      }
      return scores;
  };

  const GAME_SCREENS = [{
    type: `two-of-two`,
    question: `Угадайте для каждого изображения фото или рисунок?`,
    answers: [{
      image: {
        url: `http://i.imgur.com/DKR1HtB.jpg`
      },
      type: `photo`
    },
    {
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `photo`
    }
    ]
  }, {
    type: `tinder-like`,
    question: `Угадай, фото или рисунок?`,
    answers: [{
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `painting`
    }]
  }, {
    type: `tinder-like`,
    question: `Угадай, фото или рисунок?`,
    answers: [{
      image: {
        url: `http://i.imgur.com/1KegWPz.jpg`
      },
      type: `photo`
    }]
  }, {
    type: `one-of-three`,
    question: `Найдите рисунок среди изображений`,
    answers: [{
      image: {
        url: `https://i.imgur.com/DiHM5Zb.jpg`
      },
      type: `painting`
    },
    {
      image: {
        url: `http://i.imgur.com/DKR1HtB.jpg`
      },
      type: `painting`
    },
    {
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `painting`
    }
    ]
  }, {
    type: `tinder-like`,
    question: `Угадай, фото или рисунок?`,
    answers: [{
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `painting`
    }]
  }, {
    type: `one-of-three`,
    question: `Найдите рисунок среди изображений`,
    answers: [{
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `painting`
    },
    {
      image: {
        url: `https://k42.kn3.net/D2F0370D6.jpg`
      },
      type: `painting`
    },
    {
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `painting`
    }
    ]
  }, {
    type: `two-of-two`,
    question: `Угадайте для каждого изображения фото или рисунок?`,
    answers: [{
      image: {
        url: `http://i.imgur.com/DKR1HtB.jpg`
      },
      type: `photo`
    },
    {
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `photo`
    }
    ]
  }, {
    type: `tinder-like`,
    question: `Угадай, фото или рисунок?`,
    answers: [{
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `painting`
    }]
  }, {
    type: `two-of-two`,
    question: `Угадайте для каждого изображения фото или рисунок?`,
    answers: [{
      image: {
        url: `https://i.imgur.com/DiHM5Zb.jpg`
      },
      type: `photo`
    },
    {
      image: {
        url: `https://k42.kn3.net/CF42609C8.jpg`
      },
      type: `photo`
    }
    ]
  }, {
    type: `tinder-like`,
    question: `Угадай, фото или рисунок?`,
    answers: [{
      image: {
        url: `http://i.imgur.com/1KegWPz.jpg`
      },
      type: `painting`
    }]
  }];

  const checkLives = (data) => {
    let lives = INITIAL_STATE.lives;
    const arr = data.answers;

    arr.forEach((el) => {
      if (!el[0] && lives >= 0) {
        lives -= 1;
      }
    });

    return lives;
  };

  class GameModel {
      constructor() {
          this.gamePlay = null;
      }

      get getState() {
          return this.gamePlay;
      }

      resetGame() {
          this.gamePlay = Object.assign({}, INITIAL_STATE, { // копируем обьекты в gamePlay
              answers: []
          });
          this.gamePlay.gameScreens = GAME_SCREENS;
      }

      changeGameLevel() {
          this.gamePlay.level += 1;
          alert(`level +1 ` + this.gamePlay.level);
      }

      addAnswer(result, time) {
          this.gamePlay.answers.push([result, time]);
      }

      checkLivesCount(state) {
          this.gamePlay.lives = checkLives(state);
      }

      //повторяющийся элемент выпилить
      quickAnswersCount(state) {
              alert(`запускаю reduce для answers ` + state.answers);
              return state.answers.reduce((acc, el) => {
                  if (el[0] && (el[1] < QUICK_ANSWER)) {
                      acc += 1;
                  }
                  return acc;
              }, 0);
          }
          //повторяющийся элемент выпилить
      slowAnswersCount(state) {
              return state.answers.reduce((acc, el) => {
                  if (el[0] && (el[1] > SLOW_ANSWER)) {
                      acc += 1;
                  }
                  return acc;
              }, 0);
          }
          //повторяющийся элемент выпилить
      correctAnswersCount(state) {
          return state.answers.reduce((acc, el) => {
              if (el[0]) {
                  acc += 1;
              }
              return acc;
          }, 0);
      }

      totalScores(state) {
          return gameData(state);
      }

      negativeLivesChecker(lives) {
          return (lives < 0) ? 0 : lives;
      }
  }

  class StatsBar extends AbstractView {
    constructor(state) {
      super();
      this.state = state;
      this.questionsCount = this.state.gameScreens.length;
    }

    get template() {
      const blankStats = [];
      const gameStats = [];

      for (let i = 0; i < this.questionsCount; i += 1) {
        blankStats.push(`stats__result--unknown`);
      }

      const gameStatus = this.addClassOfResult(this.state, blankStats);
      for (let i = 0; i < this.questionsCount; i += 1) {
        gameStats.push(`<li class="stats__result ${gameStatus[i]}"></li>`);
      }

      const statsHtml = `
      <ul class="stats">
        ${gameStats.join(``)}
      </ul>`;

      return statsHtml;
    }

    addClassOfResult(state, sourceArr) {
      const resultArr = [...sourceArr];

      if (state.answers.length < 1) {
        return resultArr;
      }
      for (let i = 0; i < resultArr.length; i += 1) {
        if (state.answers[i]) {
          if (state.answers[i][0] && (state.answers[i][1] > QUICK_ANSWER && state.answers[i][1] < SLOW_ANSWER)) {
            resultArr[i] = `stats__result--correct`;
          }
          if (state.answers[i][0] && state.answers[i][1] > SLOW_ANSWER) {
            resultArr[i] = `stats__result--slow`;
          }
          if (state.answers[i][0] && state.answers[i][1] < QUICK_ANSWER) {
            resultArr[i] = `stats__result--fast`;
          }
          if (!state.answers[i][0]) {
            resultArr[i] = `stats__result--wrong`;
          }
        }
      }
      return resultArr;
    }
  }

  class Lives extends AbstractView {
    constructor(lives) {
      console.log(' lives-view '+lives);
     
      super();
      this.lives = lives;
    }

    get template() {
      const missedLives = new Array(INITIAL_STATE.lives - this.lives)
        .fill(`<img src="img/heart__empty.svg" class="game__heart" alt=" Missed Life" width="31" height="27">`)
        .join(``);
      const lives = new Array(this.lives)
        .fill(`<img src="img/heart__full.svg" class="game__heart" alt="Life" width="31" height="27">`)
        .join(``);

      return `
    <div class="game__lives">
      ${missedLives}
      ${lives}
    </div>`;
    }
  }

  class Timer extends AbstractView {
    constructor(time) {
      super();
      this.time = time;
    }

    get template() {
      return `<div class="game__timer">${this.time}</div>`;
    }
  }

  debugger
  class Game1 extends AbstractView {
      constructor(state) {
          super();
          this.state = state;
          this._gameAnswer = null;
          this._answers = [];
      }

      get template() {
          const gameTask = `<p class="game__task">${this.state.gameScreens[this.state.level].question}</p>`;

          return `
    <header class="header">
    ${new BackButton().template}
    ${new Timer(this.state.time).template}
    ${new Lives(this.state.lives).template}
    </header>
    <section class="game">
    ${gameTask}
      <form class="game__content">
        <div class="game__option">
          <img src="${this.state.gameScreens[this.state.level].answers[0].image.url}" alt="Option 1" width="468" height="458">
          <label class="game__answer game__answer--photo">
            <input class="visually-hidden" name="question1" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer game__answer--paint">
            <input class="visually-hidden" name="question1" type="radio" value="paint">
            <span>Рисунок</span>
          </label>
        </div>
        <div class="game__option">
          <img src="${this.state.gameScreens[this.state.level].answers[1].image.url}" alt="Option 2" width="468" height="458">
          <label class="game__answer  game__answer--photo">
            <input class="visually-hidden" name="question2" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer  game__answer--paint">
            <input class="visually-hidden" name="question2" type="radio" value="paint">
            <span>Рисунок</span>
          </label>
        </div>
      </form>
    </section>`;
      }

      get result() {
          const answersTemp = [];
          this._answers.forEach((el) => {
              answersTemp.push(el[0] === el[1]);
          });
          this._gameAnswer = (answersTemp[0] === answersTemp[1]);
          return this._gameAnswer;
      }

      convertAnswer(answer) {
          const InputToAnswerType = {
              paint: `painting`,
              photo: `photo`
          };
          return InputToAnswerType[answer];
      }

      bind() {
          alert('модуль game-1-view ' + this.element);
          const leftRadioGroup = [...this.element.querySelectorAll(`input[name=question1]`)];
          const rightRadioGroup = [...this.element.querySelectorAll(`input[name=question2]`)];
          const backButton = this.element.querySelector(`.back`);
          const gameSection = this.element.querySelector(`.game`);
          let isLeftPictureSelected = false;
          let isRightPictureSelected = false;

          gameSection.appendChild(new StatsBar(this.state).element);

          const compareChecked = () => {
              if (isLeftPictureSelected && isRightPictureSelected) {
                  this.compareChecking();
              }
          };

          leftRadioGroup.forEach((el) => {
              const imageType = this.state.gameScreens[this.state.level].answers[0].type;
              const answerType = this.convertAnswer(el.value);

              el.addEventListener(`click`, () => {
                  if (el.checked) {
                      isLeftPictureSelected = true;
                      this._answers[0] = [answerType, imageType];
                  }
                  compareChecked();
              });
          });

          rightRadioGroup.forEach((el) => {
              const imageType = this.state.gameScreens[this.state.level].answers[1].type;
              const answerType = this.convertAnswer(el.value);

              el.addEventListener(`click`, () => {
                  if (el.checked) {
                      isRightPictureSelected = true;
                      this._answers[1] = [answerType, imageType];
                  }
                  compareChecked();
              });
          });

          backButton.addEventListener(`click`, (e) => {
              e.preventDefault();
              this.onBackButtonClick();
          });
      }

      onBackButtonClick() {}

      compareChecking() {}

      updateTimer() {
          const timer = this.element.querySelector(`.game__timer`);
          timer.innerText = ``;
          timer.innerText = this.model.getState.time;
      }
  }

  class Game2 extends AbstractView {
    constructor(state) {
      super();
      this.state = state;
      this._gameAnswer = null;
      this._answers = [];
    }

    get template() {
      const gameTask = `<p class="game__task">${this.state.gameScreens[this.state.level].question}</p>`;

      return `
      <header class="header">
        ${new BackButton().template}
        ${new Timer(this.state.time).template}
        ${new Lives(this.state.lives).template}
      </header>
      <section class="game">
        ${gameTask}
        <form class="game__content  game__content--wide">
          <div class="game__option">
            <img src="${this.state.gameScreens[this.state.level].answers[0].image.url}" alt="Option 1" width="705" height="455">
            <label class="game__answer  game__answer--photo">
              <input class="visually-hidden" name="question1" type="radio" value="photo">
              <span>Фото</span>
            </label>
            <label class="game__answer  game__answer--paint">
              <input class="visually-hidden" name="question1" type="radio" value="paint">
              <span>Рисунок</span>
            </label>
          </div>
        </form>
      </section>`;
    }

    get result() {
      this._gameAnswer = (this._answers[0] === this._answers[1]);
      return this._gameAnswer;
    }

    convertAnswer(answer) {
      const InputToAnswerType = {
        paint: `painting`,
        photo: `photo`
      };
      return InputToAnswerType[answer];
    }

    bind() {
      const form = this.element.querySelector(`.game__content`);
      const backButton = this.element.querySelector(`.back`);
      const gameSection = this.element.querySelector(`.game`);

      const imageType = this.state.gameScreens[this.state.level].answers[0].type;

      gameSection.appendChild(new StatsBar(this.state).element);

      form.addEventListener(`change`, (e) => {
        e.preventDefault();
        const answerType = this.convertAnswer(e.target.value);
        this._answers = [answerType, imageType];

        this.onFormChange();
      });

      backButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        this.onBackButtonClick();
      });
    }

    onFormChange() {}

    onBackButtonClick() {}
  }

  class Game3 extends AbstractView {
    constructor(state) {
      super();
      this.state = state;
      this._gameAnswer = null;
      this._answers = [];
    }

    get template() {
      const gameTask = `<p class="game__task">${this.state.gameScreens[this.state.level].question}</p>`;

      return `
      <header class="header">
        ${new BackButton().template}
        ${new Timer(this.state.time).template}
        ${new Lives(this.state.lives).template}
      </header>
      <section class="game">
        ${gameTask}
        <form class="game__content  game__content--triple">
          <div class="game__option">
            <img src="${this.state.gameScreens[this.state.level].answers[0].image.url}" alt="Option 1" width="304" height="455">
          </div>
          <div class="game__option  game__option--selected">
            <img src="${this.state.gameScreens[this.state.level].answers[1].image.url}" alt="Option 2" width="304" height="455">
          </div>
          <div class="game__option">
            <img src="${this.state.gameScreens[this.state.level].answers[2].image.url}" alt="Option 3" width="304" height="455">
          </div>
        </form>
      </section>
    `;
    }

    get result() {
      this._gameAnswer = (this._answers[0] === this._answers[1]);
      return this._gameAnswer;
    }

    convertAnswer(answer) {
      const InputToAnswerType = {
        paint: `painting`,
        photo: `photo`
      };
      return InputToAnswerType[answer];
    }

    questionType(question) {
      if (question === `Найдите рисунок среди изображений`) {
        return `painting`;
      }
      return `photo`;
    }

    bind() {
      const gameOptions = [...this.element.querySelectorAll(`.game__option`)];
      const backButton = this.element.querySelector(`.back`);
      const gameSection = this.element.querySelector(`.game`);

      gameSection.appendChild(new StatsBar(this.state).element);

      gameOptions.forEach((el, i) => {
        const answerType = this.state.gameScreens[this.state.level].answers[i].type;
        const imageType = this.questionType(this.state.gameScreens[this.state.level].question);

        el.addEventListener(`click`, () => {
          this._answers = [answerType, imageType];
          this.onImageClick();
        });
      });

      backButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        this.onBackButtonClick();
      });
    }

    onBackButtonClick() {}

    onImageClick() {}
  }

  class GameScreen {
    
    constructor(model) {
      this.model = model;
      this.timer = null;
    }

    get element() {
      return this.root;
    }

    init() {
      this.model.resetGame();
      this.updateRoot();
      this.startTimer();
    }

    showScreenWithData(state) {
      if (state.gameScreens[state.level].type === `two-of-two`) {
        const game1 = new Game1(state);
        game1.compareChecking = () => {
          this.model.addAnswer(game1.result, (INITIAL_STATE.time - state.time) * ONE_SECOND);
          this.changeLevel(state);
        };
        game1.onBackButtonClick = () => {
          Router.showGreeting();
        };
        return game1.element;
      }
      if (state.gameScreens[state.level].type === `tinder-like`) {
        const game2 = new Game2(state);
        game2.onFormChange = () => {
          this.model.addAnswer(game2.result, (INITIAL_STATE.time - state.time) * ONE_SECOND);
          this.changeLevel(state);
        };
        game2.onBackButtonClick = () => {
          Router.showGreeting();
        };
        return game2.element;
      }
      if (state.gameScreens[state.level].type === `one-of-three`) {
        const game3 = new Game3(state);
        game3.onImageClick = () => {
          this.model.addAnswer(game3.result, (INITIAL_STATE.time - state.time) * ONE_SECOND);
          this.changeLevel(state);
        };
        game3.onBackButtonClick = () => {
          Router.showGreeting();
        };
        return game3.element;
      }
      return ``;
    }

    changeLevel(state) {
      this.stopTimer();
      this.resetTimer();
      this.model.changeGameLevel(state);
      this.model.checkLivesCount(state);
      this.checkGameOver(state);
    }

    checkGameOver(state) {
      const lives = checkLives(state);
      const level = state.level;

      if (level === INITIAL_STATE.questions || lives < 0) {
        this.stopTimer();
        this.saveGameStats(state);
        return Router.showStats(state);
      } else {
        this.updateRoot();
        this.startTimer();
        return showScreen(this.element);
      }
    }

    saveGameStats(state) {
      const currentGameStats = {
        quickAnswersTotal: this.model.quickAnswersCount(state),
        slowAnswersTotal: this.model.slowAnswersCount(state),
        correctAnswersTotal: this.model.correctAnswersCount(state),
        livesTotal: this.model.negativeLivesChecker(state.lives),
        totalScores: this.model.totalScores(state),
        statsBarHtml: Router.showStatsBar(state)
      };

      if (state.playedGames.length === INITIAL_STATE.savedGamesCount) {
        state.playedGames.pop(INITIAL_STATE.savedGamesCount);
        state.playedGames.unshift(currentGameStats);
      } else {
        state.playedGames.unshift(currentGameStats);
      }
    }

    tick() {
      if (this.model.getState.time) {
        this.model.getState.time -= 1;
        this.updateTimer();
        this.blinking();
      } else {
        this.model.addAnswer(false, 0);
        this.changeLevel(this.model.getState);
        return true;
      }
      return false;
    }

    startTimer() {
      this.timer = setTimeout(() => {
        if (!this.tick()) {
          this.startTimer();
        }
      }, ONE_SECOND);
    }

    stopTimer() {
      clearTimeout(this.timer);
    }

    resetTimer() {
      this.model.getState.time = INITIAL_STATE.time;
    }

    updateTimer() {
      this.rootTimer.innerText = ``;
      this.rootTimer.innerText = this.model.getState.time;
    }

    updateRoot() {
      this.root = this.showScreenWithData(this.model.getState);
      this.rootTimer = this.root.querySelector(`.game__timer`);
    }

    blinking() {
      if (this.model.getState.time <= 5) {
        this.rootTimer.classList.add(`blink`);
      }
    }
  }

  class Stats extends AbstractView {
    constructor(state) {
      super();
      this.state = state;
    }

    get template() {

      const tableHtml = [];

      this.state.playedGames.forEach((el) => {
        const getBonusHtml = () => {
          const bonusesHtml = `
            <tr>
              <td></td>
              <td class="result__extra">Бонус за скорость:</td>
              <td class="result__extra">${el.quickAnswersTotal} <span class="stats__result stats__result--fast"></span></td>
              <td class="result__points">× ${Answer.QUICK}</td>
              <td class="result__total">${el.quickAnswersTotal * Answer.QUICK}</td>
            </tr>
            <tr>
              <td></td>
              <td class="result__extra">Бонус за жизни:</td>
              <td class="result__extra">${el.livesTotal} <span class="stats__result stats__result--alive"></span></td>
              <td class="result__points">× ${Answer.BONUS_FOR_LIVES}</td>
              <td class="result__total">${el.livesTotal * Answer.BONUS_FOR_LIVES}</td>
            </tr>
            <tr>
              <td></td>
              <td class="result__extra">Штраф за медлительность:</td>
              <td class="result__extra">${el.slowAnswersTotal} <span class="stats__result stats__result--slow"></span></td>
              <td class="result__points">× ${Answer.SLOW}</td>
              <td class="result__total">-${el.slowAnswersTotal * Answer.SLOW}</td>
            </tr>`;

          if (el.totalScores > 0) {
            return bonusesHtml;
          } else {
            return ``;
          }
        };

        const result = () => {
          return (el.totalScores > 0) ? el.totalScores : false;
        };

        const tableContent = `
      <tr>
          <td class="result__number">${this.state.playedGames.indexOf(el) + 1}</td>
          <td colspan="2" class="result__stats">${el.statsBarHtml}</td>
          <td class="result__points">× ${Answer.RIGHT}</td>
          <td class="result__total">${el.correctAnswersTotal * Answer.RIGHT}</td>
        </tr>
          ${getBonusHtml()}
        <tr>
          <td colspan="5" class="result__total  result__total--final">${result()}</td>
        </tr>`;

        tableHtml.push(tableContent);
      });

      const statsHtml = `
      <header class="header">
        ${new BackButton().template}
      </header>
      <section class="result">
        <h2 class="result__title">Победа!</h2>
        <table class="result__table">
         ${tableHtml.join(``)}
        </table>
      </section>`;

      return statsHtml;
    }

    bind() {
      const backButton = this.element.querySelector(`.back`);

      backButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        this.onBackButtonClick();
      });
    }

    onBackButtonClick() {}
  }

  class StatsScreen {
    constructor(model) {
      this.model = model;
    }
    get element() {
      const statsScreen = new Stats(this.model);

      statsScreen.onBackButtonClick = () => {
        Router.showGreeting();
      };

      return statsScreen.element;
    }
  }

  class StatsBarTemplate {
    constructor(model) {
      this.model = model;
    }
    get template() {
      const statsBar = new StatsBar(this.model).template;

      return statsBar;
    }
  }

  console.log(' модуль router ');

  class Router {
      static showIntro() {
          const introScreen = new IntroScreen();
          showScreen(introScreen.element);
      }

      static showGreeting() {
          const greetingScreen = new GreetingScreen();
          showScreen(greetingScreen.element);
      }

      static showRules() {
          const rulesScreen = new RulesScreen();
          showScreen(rulesScreen.element);
      }

      static showGame() {
          const model = new GameModel();
          const gameScreen = new GameScreen(model);
          gameScreen.init();
          showScreen(gameScreen.element);
      }

      static showStats(state) {
          const statsScreen = new StatsScreen(state);
          showScreen(statsScreen.element);
      }

      static showStatsBar(state) {
          const statsBar = new StatsBarTemplate(state);
          return statsBar.template;
      }
  }

  // console.log(' модуль main ');
  Router.showIntro();

}());

//# sourceMappingURL=main.js.map
