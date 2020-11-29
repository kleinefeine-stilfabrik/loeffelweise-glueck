
const el = document.createElement('div');
el.classList.add('scrollTop');
// el.innerHTML = '<i class="fas fa-arrow-up"></i>';
el.innerHTML = '<i class="fas fa-utensil-spoon"></i>';
el.title = 'Zum Anfang springen';
document.body.appendChild(el);
el.addEventListener('click', () => {
  window.scrollTo(0, 0);
});
