import AbstractView from './abstract-view';
import BackButton from './back-button-view';
import Lives from './lives-view';
import StatsBar from './stats-bar-view';
import Timer from './timer-view';

export default class Game2 extends AbstractView {
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
