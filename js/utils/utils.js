const main = document.querySelector(`#main`);

const showScreen = (e) => {
  main.innerHTML = ``;
  main.appendChild(e);
};

export {
  main,
  showScreen
};
