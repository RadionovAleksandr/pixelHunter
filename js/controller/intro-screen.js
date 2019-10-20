import Intro from "../view/intro-view";
import Router from "../router/application-router";
console.log(' модуль intro-screen ');

export default class IntroScreen {
    get element() {
        const intro = new Intro();
        intro.onButtonClick = () => Router.showGreeting();

        return intro.element;
    }
}