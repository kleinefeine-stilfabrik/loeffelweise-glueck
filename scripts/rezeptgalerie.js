fetch('/data/recipes.json')
  .then(response => response.json())
  .then(recipeData => {

    const container = document.querySelector('.container');

    recipeData.forEach(r => {
      const link = document.createElement('a');
      link.href = `/rezepte/${r.link}`;
      link.title = r.name;
      const img = document.createElement('img');
      img.src = `/imgs/rezepte/rezeptbilder/${r.imglink}`;
      link.appendChild(img);
      container.appendChild(link);
    })

  });
