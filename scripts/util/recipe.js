const scrollScript = document.createElement('script');
scrollScript.src = '/lib/simplebar.js';
const scrollStyle = document.createElement('link');
scrollStyle.href = '/lib/simplebar.css';
scrollStyle.rel = 'stylesheet';
document.head.appendChild(scrollScript);
document.head.appendChild(scrollStyle);

scrollScript.addEventListener('load', () => {
  const name = document.querySelector('#name');
  let zutaten = document.querySelector('#zutaten');
  let zubereitung = document.querySelector('#zubereitung');
  let kommentar = document.querySelector('#kommentar');

  const scrollContainers = [zutaten, zubereitung, kommentar];
  scrollContainers.forEach(scr => {
    new SimpleBar(scr, {
      autoHide: false
    });
  });
  on_load();
});

const url = new URL(window.location);

const link = decodeURIComponent(url.pathname).replace(/\/rezepte\/([a-zA-Z0-9öÖüÜäÄ_-]+)\//i, "$1");



async function on_load() {

  zutaten = document.querySelector('#zutaten .simplebar-content') || document.querySelector('#zutaten');
  zubereitung = document.querySelector('#zubereitung .simplebar-content') || document.querySelector('#zubereitung');
  kommentar = document.querySelector('#kommentar .simplebar-content') || document.querySelector('#kommentar');

  const recipeData = (await fetch(`/data/recipes.json`).then(response => response.json())).find(e => e.link == link);
  const zutatenTxt = await fetch(`/rezepte/${link}/Zutaten.txt`).then(response => response.text());
  const zubereitungTxt = await fetch(`/rezepte/${link}/Zubereitung.txt`).then(response => response.text());
  const kommentarTxt = await fetch(`/rezepte/${link}/Kommentar.txt`).then(response => response.text());

  document.head.querySelector('title').innerText = `${recipeData.name} - Löffelweise Glück`;
  name.innerText = recipeData.name;

  const img = document.createElement('img');
  img.id = 'img';
  img.src = `/rezepte/${link}/img.jpg`;
  container.appendChild(img);
  const zutatenList = document.createElement('ul');
  zutaten.appendChild(zutatenList);
  zutatenTxt.split('\n').forEach(e => {
    if(!e || /^\s+$/.test(e)) return;
    const el = document.createElement('li');
    el.innerText = e;
    replaceLinks(el);
    zutatenList.appendChild(el);
  });
  zubereitung.innerText = zubereitungTxt;
  kommentar.innerText = kommentarTxt;

  replaceLinks(zubereitung);
  replaceLinks(kommentar);

  recipeData.tags.forEach((e, i) => {
    const tag = document.createElement('a');
    tag.innerText = '#' + e;
    tag.href = `../?search=${encodeURIComponent('#'+e)}`;
    const sep = document.createElement('span');
    sep.innerText = ', ';
    tags.appendChild(tag);
    if(i != recipeData.tags.length-1) tags.appendChild(sep);
  });
};



function replaceLinks(el) {
  const matches = [...el.innerText.matchAll(/\[(.+)\]\(([^\)]+)\)/g)];
  matches.forEach(m => {
    const r = new RegExp("\\[" + m[1].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\]\\(" + m[2].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\)");
    el.innerHTML = el.innerHTML.replace(r, `<a href="${m[2]}" target="_blank" class="markdown-link">${m[1]}</a>`);
  });
}
