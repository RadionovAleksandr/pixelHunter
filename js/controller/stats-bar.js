import StatsBar from "../view/stats-bar-view";

export default class StatsBarTemplate {
  constructor(model) {
    this.model = model;
  }
  get template() {
    const statsBar = new StatsBar(this.model).template;

    return statsBar;
  }
}
