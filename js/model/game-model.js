import {
    INITIAL_STATE,
    QUICK_ANSWER,
    SLOW_ANSWER,
    gameData
} from "../data/game-data";
import GAME_SCREENS from "../data/game-screens";
import checkLives from "../data/check-lives";

export default class GameModel {
    constructor() {
        this.gamePlay = null;
    }

    get getState() {
        return this.gamePlay;
    }

    resetGame() {
        this.gamePlay = Object.assign({}, INITIAL_STATE, { // копируем обьекты в gamePlay
            answers: []
        });
        this.gamePlay.gameScreens = GAME_SCREENS;
    }

    changeGameLevel() {
        this.gamePlay.level += 1;
        alert(`level +1 ` + this.gamePlay.level);
    }

    addAnswer(result, time) {
        this.gamePlay.answers.push([result, time]);
    }

    checkLivesCount(state) {
        this.gamePlay.lives = checkLives(state);
    }

    //повторяющийся элемент выпилить
    quickAnswersCount(state) {
            alert(`запускаю reduce для answers ` + state.answers);
            return state.answers.reduce((acc, el) => {
                if (el[0] && (el[1] < QUICK_ANSWER)) {
                    acc += 1;
                }
                return acc;
            }, 0);
        }
        //повторяющийся элемент выпилить
    slowAnswersCount(state) {
            return state.answers.reduce((acc, el) => {
                if (el[0] && (el[1] > SLOW_ANSWER)) {
                    acc += 1;
                }
                return acc;
            }, 0);
        }
        //повторяющийся элемент выпилить
    correctAnswersCount(state) {
        return state.answers.reduce((acc, el) => {
            if (el[0]) {
                acc += 1;
            }
            return acc;
        }, 0);
    }

    totalScores(state) {
        return gameData(state);
    }

    negativeLivesChecker(lives) {
        return (lives < 0) ? 0 : lives;
    }
}