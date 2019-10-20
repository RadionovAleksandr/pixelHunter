import Greeting from "../view/greeting-view";
import Router from "../router/application-router";

export default class GreetingScreen {
    get element() {
        const greeting = new Greeting();
        greeting.onButtonClick = () => Router.showRules();

        return greeting.element;
    }
}