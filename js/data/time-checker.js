const ANSWER_TIME = 3000; // для теста убрал один ноль

const timeChecker = (time) => {
  if (typeof time !== `number`) {
    throw new Error(`Время должно быть числом`);
  }
  if (time < 0) {
    throw new Error(`Время должно быть положительным числом`);
  }

  return time < ANSWER_TIME;
};

export default timeChecker;
