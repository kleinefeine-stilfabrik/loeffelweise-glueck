
let current = null;

data.addEventListener("change", refreshRecipes);
newBtn.addEventListener("click", newBtnAction);

[document.querySelector('#name'), link, tags].forEach(e => {
  e.addEventListener('change', () => {
    const json = JSON.parse(data.value || {});
    json[current].name = document.querySelector('#name').value;
    json[current].link = link.value;
    json[current].tags = tags.value.split('\n');
    data.value = JSON.stringify(json, undefined, '  ');
    refreshRecipes();
  });
});


function refreshRecipes() {
  const json = JSON.parse(data.value || {});
  recipes.innerHTML = "";
  json.forEach((e, i) => {
    const el = document.createElement('span');
    el.innerText = e.name;
    el.draggable = true;
    el.dataset.index = i;
    recipes.appendChild(el);
    el.addEventListener('click', () => {
      [...recipes.children].forEach(ee => ee.classList.remove('active'));
      el.classList.add('active');
      current = i;
      document.querySelector('#name').value = json[i].name;
      link.value = json[i].link;
      tags.value = json[i].tags.join('\n');
    });
    el.addEventListener('dragstart', ev => {
      // ev.preventDefault();
      el.classList.add('drag');
      ev.dataTransfer.setData("index", ev.target.dataset.index);
    });
    el.addEventListener('dragend', ev => {
      ev.preventDefault();
        [...recipes.children].forEach(ee => ee.classList.remove('drag'));
    });
    el.addEventListener('drop', ev => {
      moveRecipe(Number(ev.dataTransfer.getData("index")), Number(el.dataset.index));
    });
    el.addEventListener('dragover', ev => {
      ev.preventDefault();
      el.classList.add('drag');
    });
    el.addEventListener('dragleave', ev => {
      ev.preventDefault();
      el.classList.remove('drag');
    });
  });
  const newBtn = document.createElement('span');
  newBtn.innerText = "+ Neues Rezept";
  newBtn.id = "newBtn";
  newBtn.addEventListener("click", newBtnAction);
  newBtn.addEventListener("dragover", ev => {
    ev.preventDefault();
  });
  newBtn.addEventListener('drop', ev => {
    moveRecipe(Number(ev.dataTransfer.getData("index")), JSON.parse(data.value).length)
  });
  recipes.appendChild(newBtn);
}

function newBtnAction() {
  const json = JSON.parse(data.value || []);
  json.push({name: "< Unbenanntes Rezept >", link: "", tags: []});
  data.value = JSON.stringify(json, undefined, '  ');
  current = null;
  document.querySelector('#name').value = "";
  link.value = "";
  tags.value = "";

  refreshRecipes();
}

document.querySelector('#delete').addEventListener("click", () => {
  const modified = JSON.parse(data.value)
  modified.splice(current, 1);
  data.value = JSON.stringify(modified, undefined, '  ');
  refreshRecipes();
});

function moveRecipe(from, to) {
  const modified = JSON.parse(data.value);
  if(from != to) modified.splice(to, 0, modified[from]);
  if(from < to) {
    modified.splice(from, 1);
  } else if(from > to) {
    modified.splice(from+1, 1);
  }
 data.value = JSON.stringify(modified, undefined, '  ');
 refreshRecipes();
}
