import {
    showScreen
} from "../utils/utils";
import IntroScreen from "../controller/intro-screen";
import GreetingScreen from "../controller/greeting-screen";
import RulesScreen from "../controller/rules-screen";
import GameModel from "../model/game-model";
import GameScreen from "../controller/game-screen";
import StatsScreen from "../controller/stats-screen";
import StatsBarTemplate from "../controller/stats-bar";
console.log(' модуль router ');

export default class Router {
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