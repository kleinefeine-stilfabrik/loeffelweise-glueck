const TABSPACE = "&nbsp;";
const RECIPEAMOUNT = 10;
let recipeAmount = RECIPEAMOUNT;

const url = new URL(window.location);
let searchFinal = "";
const searchParam = decodeURIComponent(url.searchParams.get('search'));
if(searchParam != "null") {
  search.value = searchParam;
}
if(search.value) {
  searchFinal = search.value;
}

const loadMore = document.querySelector('#loadMore');


fetch('/data/recipes.json')
  .then(response => response.json())
  .then(recipeData => {
    refreshRecipes(filterData(recipeData.reverse(), undefined, searchFinal));
    search.addEventListener('input', () => {
      if(search.value) {
        url.searchParams.set('search', encodeURIComponent(search.value));
        refreshRecipes(filterData(recipeData, recipeAmount, search.value));
      } else {
        url.searchParams.delete('search');
        refreshRecipes(filterData(recipeData, recipeAmount));
      }
      window.history.pushState({}, '', url);
    });
    [document.querySelector('#delete-search'),navbar.querySelector('a[href="#"]')].forEach(e => {
      e.addEventListener('click', () => {
      search.value = '';
      url.searchParams.delete('search');
      refreshRecipes(filterData(recipeData, recipeAmount));
      window.history.pushState({}, '', url);
    })});
    loadMore.addEventListener('click', () => {
      recipeAmount += RECIPEAMOUNT;
      refreshRecipes(filterData(recipeData, recipeAmount, search.value));
    });
});


function filterData(data, amount = RECIPEAMOUNT, search = '') {
  // console.log(advancedSearch(data, search));
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
  });
  if(filtered.length > amount) {
    loadMore.classList.remove('hidden');
  } else {
    loadMore.classList.add('hidden');
  }
  return [filtered.slice(0, amount), data]
}


function refreshRecipes([recipeData, fullData]) {
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
    let searchSuffix = "";
    if(searchFinal) searchSuffix = `/?search=${encodeURIComponent(searchFinal)}`;
    const link = document.createElement('a');
    const löffelglück = document.createElement('span');
    löffelglück.innerText = 'Löffelglück...';
    link.href = r.link + searchSuffix;
    link.innerText = `Rezept zum `;
    link.appendChild(löffelglück);
    text.appendChild(link);

    const tags = document.createElement('div');
    tags.classList.add('tags');
    r.tags.forEach(t => {
      // const tag = document.createElement('a');
      // tag.innerText = `#${t}`;
      // tag.href = `./?search=${encodeURIComponent('#'+t)}`;
      // tags.appendChild(tag);
      const tag = document.createElement('button');
      tag.innerText = `#${t}`;
      tag.addEventListener('click', () => {
        url.searchParams.set('search', encodeURIComponent('#'+t));
        refreshRecipes(filterData(fullData, recipeAmount, '#'+t));
        search.value = '#' + t;
        window.history.pushState({}, '', url);
      });
      tags.appendChild(tag);
    });
    text.appendChild(tags);

    recipe.appendChild(text);

    recipeContainer.appendChild(recipe);

  });
}

// function advancedSearch(data, search) {
//   // return
//   console.log(data, search);
//   const filtered = data.filter(e => {
//     let ret = true;
//     const queries = search.split(',').map(ee => ee.split(' ').filter(eee => eee ? true : false));
//     console.log(queries);
//     queries.forEach(ee => {
//       ee.forEach(eee => {
//         let isTag = false;
//         if(/^#/.test(eee)) {
//           eee = eee.replace(/^#/, '');
//           isTag = true;
//         }
//         const r = new RegExp(eee.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
//         if(!((r.test(e.name) && isTag == false) || (isTag == true && e.tags.map(eeee => r.test(eeee)).some(eeee => eeee == true)))) ret = false
//       })
//     });
//     return ret;
//   });
//   return filtered
// }
