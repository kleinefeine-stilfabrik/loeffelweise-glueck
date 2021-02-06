const scrollScript = document.createElement('script');
scrollScript.src = '/lib/simplebar.js';
const scrollStyle = document.createElement('link');
scrollStyle.href = '/lib/simplebar.css';
scrollStyle.rel = 'stylesheet';
document.head.appendChild(scrollScript);
document.head.appendChild(scrollStyle);

const scrollContainers = document.querySelectorAll('#geschichtenContainer > .geschichte > .text > div');

scrollScript.addEventListener("load", () => {
  scrollContainers.forEach(scr => {
    new SimpleBar(scr, {
      autoHide: false
    });
  });
});


const sliders = document.querySelectorAll('#geschichtenContainer > .geschichte > div.img');

sliders.forEach(sl => {
  const amount = sl.childElementCount;
  changeImg(0);
  const back = document.createElement('span');
  const next = document.createElement('span');
  back.innerHTML = `<i class="fas fa-utensil-spoon"></i>`;
  next.innerHTML = `<i class="fas fa-utensil-spoon"></i>`;
  // back.innerHTML = `<i class="fas fa-chevron-left"></i>`;
  // next.innerHTML = `<i class="fas fa-chevron-right"></i>`;
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
