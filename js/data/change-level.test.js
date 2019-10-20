import {
  assert
} from 'chai';
import {
  changeLvl
} from './change-level';
import {
  INITIAL_STATE
} from './game-data';

describe(`Проверка функции смены уровней`, () => {
  it(`Уровень игры должен совпадать с переданным значением`, () => {
    assert.equal(0, changeLvl(INITIAL_STATE, 0));
    assert.equal(1, changeLvl(INITIAL_STATE, 1));
    assert.equal(5, changeLvl(INITIAL_STATE, 5));
    assert.equal(555, changeLvl(INITIAL_STATE, 555));
  });

  it(`Уровень игры должен быть числом`, () => {
    assert.throws(() => changeLvl(INITIAL_STATE, `abc`), /Уровень должен быть числом/);
  });

  it(`Уровень игры не должен быть отрицательным`, () => {
    assert.throws(() => changeLvl(INITIAL_STATE, -3), /Уровень не должен быть отрицательным/);
  });
});
