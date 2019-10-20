import AbstractView from './abstract-view';

export default class Timer extends AbstractView {
  constructor(time) {
    super();
    this.time = time;
  }

  get template() {
    return `<div class="game__timer">${this.time}</div>`;
  }
}
