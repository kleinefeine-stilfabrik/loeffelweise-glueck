const TABSPACE = "&nbsp;";

const url = new URL(window.location);
let searchFinal = "";
const searchParam = decodeURIComponent(url.searchParams.get('search'));
if(searchParam != "null") searchFinal = searchParam;

fetch('/data/recipes.json')
  .then(response => response.json())
  .then(recipeData => {
    refreshRecipes(filterData(recipeData, undefined, searchFinal));
});


function filterData(data, amount = 20, search = '') {
  const filtered = data.filter(e => {
    let ret = true;
    const queries = search.split(' ');
    queries.forEach(ee => {
      let isTag = false;
      if(/^#/.test(ee)) {
        ee = ee.replace(/^#/, '');
        isTag = true;
      }
      // let isAuthor = false;
      // if(/^@/.test(ee)) {
      //   ee = ee.replace(/^@/, '');
      //   isAuthor = true;
      // }
      const r = new RegExp(ee.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
      if(!((r.test(e.name) && isTag == false) || (isTag == true && e.tags.map(eee => r.test(eee)).some(eee => eee == true)))) ret = false
      // if(!((r.test(e.name) && isTag == false && isAuthor == false) || ((r.test(e.author) && isTag == false) && ((e.author != "unnamedDE" || isAuthor) || search.toLowerCase() == "unnamedde")) || (e.keywords.map(eee => r.test(eee)).some(eee => eee == true) && isAuthor == false))) ret = false;
    });
    return ret;
  })
  return filtered.slice(0, amount)
}


function refreshRecipes(recipeData) {
  const recipeContainer = document.querySelector('#recipeContainer');
  if(!recipeContainer) return;
  recipeContainer.innerHTML = "";

  recipeData.forEach(r => {
    const recipe = document.createElement('div');
    recipe.classList.add('recipe');
    const img = document.createElement('img');
    img.src = `/rezepte/${r.link}/img.jpg`;
    recipe.appendChild(img);

    const text = document.createElement('div');
    text.classList.add('text');
    const header = document.createElement('h3');
    header.innerText = r.name;
    text.appendChild(header);
    const link = document.createElement('a');
    const löffelglück = document.createElement('span');
    löffelglück.innerText = 'Löffelglück...';
    link.href = `${r.link}`;
    link.innerText = `Rezept zum `;
    link.appendChild(löffelglück);
    text.appendChild(link);

    const tags = document.createElement('div');
    tags.classList.add('tags');
    r.tags.forEach(t => {
      const tag = document.createElement('a');
      tag.innerText = `#${t}`;
      tag.href = `./?search=${encodeURIComponent('#'+t)}`;
      tags.appendChild(tag);
    });
    text.appendChild(tags);

    recipe.appendChild(text);

    recipeContainer.appendChild(recipe);

  });
}
