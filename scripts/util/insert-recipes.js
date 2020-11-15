const TABSPACE = "&nbsp;";


fetch('/data/recipes.json')
  .then(response => response.json())
  .then(recipeData => {


    function refreshRecipes() {
      const recipeContainer = document.querySelector('#recipeContainer');
      if(!recipeContainer) return;
      recipeContainer.innerHTML = "";

      recipeData.forEach(r => {
        const recipe = document.createElement('div');
        recipe.classList.add('recipe');
        const img = document.createElement('img');
        img.src = `/imgs/rezepte/rezeptbilder/${r.imglink}`;
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
          tag.href = `#?search=#${t}`;
          tags.appendChild(tag);
        });
        text.appendChild(tags);

        recipe.appendChild(text);

        recipeContainer.appendChild(recipe);

      });
    }

    refreshRecipes();


});
