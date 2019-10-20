import Stats from "../view/stats-view";
import Router from "../router/application-router";

export default class StatsScreen {
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

