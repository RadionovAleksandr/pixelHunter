// import {
//   assert
// } from 'chai';

// import {
//   gameData
// } from './game-data';

// // генератор массива ответов
// const generateAnswers = (right = 10, time = 15000) => {
//   const arr = [];
//   const rightAnswers = right;
//   const wrongAnswers = 10 - rightAnswers;

//   for (let i = 0; i < rightAnswers; i += 1) {
//     arr.push([true, time]);
//   }
//   if (wrongAnswers) {
//     for (let i = 0; i < wrongAnswers; i += 1) {
//       arr.push([false, time]);
//     }
//   }

//   return arr;
// };

// describe(`Проверка функции подсчета результатов игры`, () => {
//   it(`Если правильных ответов меньше 7, то возвращается -1`, () => {
//     assert.equal(gameData(generateAnswers(6), 3), -1);
//   });

//   it(`Если игрок ответил на все вопросы и не быстро, и не медленно, и у него остались все жизни, то функция должна вернуть 1150 очков`, () => {
//     assert.equal(gameData(generateAnswers(), 3), 1150);
//   });

//   it(`Если игрок ответил на все вопросы быстро, и у него остались все жизни, то функция должна вернуть 1650 очков`, () => {
//     assert.equal(gameData(generateAnswers(10, 9000), 3), 1650);
//   });

//   it(`Если игрок ответил на все вопросы быстро, и у него осталость 2 жизни, то функция должна вернуть 1600 очков`, () => {
//     assert.equal(gameData(generateAnswers(10, 9000), 2), 1600);
//   });

//   it(`Если игрок ответил на все вопросы быстро, и у него осталость 0 жизней, то функция должна вернуть 1500 очков`, () => {
//     assert.equal(gameData(generateAnswers(10, 9000), 0), 1500);
//   });

//   it(`Если игрок ответил на все вопросы медленно, и у него остались все жизни, то функция должна вернуть 650 очков`, () => {
//     assert.equal(gameData(generateAnswers(10, 25000), 3), 650);
//   });

//   it(`Если игрок ответил на все вопросы медленно, и у него осталось 0 жизней, то функция должна вернуть 500 очков`, () => {
//     assert.equal(gameData(generateAnswers(10, 25000), 0), 500);
//   });
// });
