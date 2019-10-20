import AbstractView from './abstract-view';
import {
  INITIAL_STATE
} from '../data/game-data';

export default class Lives extends AbstractView {
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
