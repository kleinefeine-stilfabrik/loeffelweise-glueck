
const sliders = document.querySelectorAll('#itemContainer > .item > div.img');

sliders.forEach(sl => {
  const amount = sl.childElementCount;
  changeImg(0);
  const back = document.createElement('span');
  const next = document.createElement('span');
  back.innerHTML = `<i class="fas fa-chevron-left"></i>`;
  next.innerHTML = `<i class="fas fa-chevron-right"></i>`;
  back.classList.add('back');
  next.classList.add('next');
  sl.appendChild(back);
  sl.appendChild(next);
  back.addEventListener('click', () => changeImg(Number(sl.dataset.index)-1));
  next.addEventListener('click', () => changeImg(Number(sl.dataset.index)+1));
  function changeImg(index) {
    if(index >= amount) index -= amount;
    if(index < 0) index += amount;
    sl.dataset.index = index;
    const imgs = sl.querySelectorAll('img');
    imgs.forEach(img => img.classList.add('hidden'));
    imgs[index].classList.remove('hidden');
  }
});
