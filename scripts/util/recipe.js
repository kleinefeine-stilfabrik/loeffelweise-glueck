const scrollScript = document.createElement('script');
scrollScript.src = '/lib/simplebar.js';
const scrollStyle = document.createElement('link');
scrollStyle.href = '/lib/simplebar.css';
scrollStyle.rel = 'stylesheet';
document.head.appendChild(scrollScript);
document.head.appendChild(scrollStyle);

scrollScript.addEventListener('load', () => {
  let zutaten = document.querySelector('#page .zutaten');
  let zubereitung = document.querySelector('#page .zubereitung');
  let kommentar = document.querySelector('#page .kommentar');

  const scrollContainers = [zutaten, zubereitung, kommentar];
  // scrollContainers.forEach(scr => {
  //   new SimpleBar(scr, {
  //     autoHide: false
  //   });
  // });
  on_load();
});

window.addEventListener('beforeprint', () => document.body.classList.add('print'));
window.addEventListener('afterprint', () => document.body.classList.remove('print'));

document.querySelector('#printBtn').addEventListener('click', () => window.print());
window.addEventListener('keydown', ev => {
  // console.log(ev);
  if(ev.keyCode == 32 || ev.keyCode == 13) { // Space oder Enter
    ev.preventDefault();
    window.print();
  }
});

const url = new URL(window.location);

const link = decodeURIComponent(url.pathname).replace(/\/rezepte\/([a-zA-Z0-9öÖüÜäÄ_-]+)\//i, "$1");

const searchParam = url.searchParams.get('search');
if(searchParam) {
  const linkBack = document.querySelector('a#back');
  linkBack.href = `../?search=${encodeURIComponent(decodeURIComponent(searchParam))}`
}



async function on_load() {

  const name = document.querySelector('#page .name');

  zutaten = document.querySelector('#page .zutaten .simplebar-content') || document.querySelector('#page .zutaten');
  zubereitung = document.querySelector('#page .zubereitung .simplebar-content') || document.querySelector('#page .zubereitung');
  kommentar = document.querySelector('#page .kommentar .simplebar-content') || document.querySelector('#page .kommentar');
  let tags = document.querySelector('#page .tags');
  let img = document.querySelector('#page .container img');

  const recipeData = (await fetch(`/data/recipes.json`).then(response => response.json())).find(e => e.link == link);
  const zutatenTxt = await fetch(`/rezepte/${link}/Zutaten.txt`).then(response => response.text());
  const zubereitungTxt = await fetch(`/rezepte/${link}/Zubereitung.txt`).then(response => response.text());
  const kommentarTxt = await fetch(`/rezepte/${link}/Kommentar.txt`).then(response => response.text());

  document.head.querySelector('title').innerText = `${recipeData.name} - Löffelweise Glück`;
  name.innerText = recipeData.name;
  document.querySelector('#print .name').innerText = recipeData.name;

  img.src = `/rezepte/${link}/img.jpg`;
  document.querySelector('#print img').src = `/rezepte/${link}/img.jpg`;

  let zutatenSplit = zutatenTxt.split('\r\n');
  if(zutatenSplit.length == 1 && zutatenSplit[0].length >= 15) zutatenSplit = zutatenTxt.split('\n');

  const zutatenHeader = document.createElement('h4');
  if(zutatenSplit[0]) zutaten.appendChild(zutatenHeader);
  zutatenHeader.innerText = zutatenSplit[0];
  const zutatenList = document.createElement('ul');
  zutatenSplit.slice(1).forEach(e => {
    // if(!e || /^\s+$/.test(e)) return;
    let el;
    if(/^!/.test(e)) {
      el = document.createElement('span');
      el.innerText = e.replace(/^!/, '');
      el.classList.add('sectionHeader');
    } else if(e == "") {
      el = document.createElement('span');
      el.innerText = '\n';
    } else {
      el = document.createElement('li');
      el.innerText = e;
    }

    replaceLinks(el);
    zutatenList.appendChild(el);
  });
  zutaten.appendChild(zutatenList);
  document.querySelector('#print .zutaten').appendChild(zutatenList.cloneNode(true));

  zubereitung.innerText = zubereitungTxt;
  document.querySelector('#print .zubereitung').innerText = zubereitungTxt;
  kommentar.innerText = kommentarTxt;
  document.querySelector('#print .kommentar').innerText = kommentarTxt;

  replaceLinks(zubereitung);
  replaceLinks(document.querySelector('#print .zubereitung'));
  replaceLinks(kommentar);
  replaceLinks(document.querySelector('#print .kommentar'));

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
