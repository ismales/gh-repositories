function createElement(tag, addedClass = tag) {
  const element = document.createElement(tag);
  element.classList.add(tag);
  if (addedClass) element.classList.add(addedClass);
  return element;
}

const main = createElement("main");
const section = createElement("section");
const form = createElement("form");
form.setAttribute("autocomplete", "off");
const input = createElement("input", "search-input");
input.setAttribute("name", "repositories");
input.setAttribute("placeholder", "name of repository");
const findedRepoList = createElement("ul", "finded-repositories");
const repoList = createElement("ul", "selected-repositories");

document.body.append(main);
main.append(section);
section.append(form);
form.append(input);
section.append(findedRepoList);
section.append(repoList);

const debounce = (fn, debounceTime) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, debounceTime);
  };
};

async function searchRepo() {
  let res = [];
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${input.value}`);
    const data = await response.json();
    const repo = data.items;
    for (let i = 0; i < 5; i++) {
      res.push(repo[i]);
    }
    return res;
  } catch (error) {
    console.log(error);
  }
}

function createSelectedLi(obj) {
  const selectedli = createElement("li", "selected-repository");
  const container = createElement("div", "container");
  const removeBtn = createElement("button", "remove-btn");

  const name = createElement("p");
  name.textContent = `name: ${obj.name}`;
  const owner = createElement("p");
  owner.textContent = `owner: ${obj.owner.login}`;
  const stars = createElement("p");
  stars.textContent = `stars: ${obj.stargazers_count}`;

  container.append(name);
  container.append(owner);
  container.append(stars);
  selectedli.append(container);
  selectedli.append(removeBtn);

  removeBtn.addEventListener("click", () => {
    selectedli.remove();
  });

  return selectedli;
}

async function showLi() {
  const reposArray = await searchRepo();

  for (let i = 0; i < reposArray.length; i++) {
    const findedli = createElement("li", "finded-repository");
    findedli.textContent = reposArray[i].name;
    findedRepoList.append(findedli);
    findedli.addEventListener("click", () => {
      input.value = "";
      findedRepoList.innerHTML = "";
      const selectedli = createSelectedLi(reposArray[i]);
      repoList.append(selectedli);
    });
  }
}

function autocomplete() {
  if (findedRepoList.firstChild) {
    findedRepoList.innerHTML = "";
    showLi();
  } else {
    showLi();
  }
  return findedRepoList;
}

input.addEventListener("keyup", debounce(autocomplete, 400));
