import AbstractView from './abstract-view';
import {
  QUICK_ANSWER,
  SLOW_ANSWER
} from '../data/game-data';

export default class StatsBar extends AbstractView {
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
