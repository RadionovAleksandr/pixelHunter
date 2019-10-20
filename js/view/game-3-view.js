import AbstractView from './abstract-view';
import BackButton from './back-button-view';
import Lives from './lives-view';
import StatsBar from './stats-bar-view';
import Timer from './timer-view';

export default class Game3 extends AbstractView {
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
