import {
  assert
} from 'chai';
import timeChecker from './time-checker';

describe(`Проверка функции отсчета времени на ответ`, () => {
  it(`Если игрок не успел ответить за 3 секунды, то возвращается false`, () => {
    assert.equal(timeChecker(50000), false);
  });

  it(`Если игрок ответил быстрее 3х секунд, то возвращается true`, () => {
    assert.equal(timeChecker(2000), true);
  });

  it(`Время должно быть числом`, () => {
    assert.throws(() => timeChecker([]), /Время должно быть числом/);
    assert.throws(() => timeChecker(null), /Время должно быть числом/);
    assert.throws(() => timeChecker(`1000`), /Время должно быть числом/);
  });

  it(`Время должно быть положительным числом`, () => {
    assert.throws(() => timeChecker(-10), /Время должно быть положительным числом/);
  });
});
