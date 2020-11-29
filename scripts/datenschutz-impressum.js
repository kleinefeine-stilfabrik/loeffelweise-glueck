const scrollScript = document.createElement('script');
scrollScript.src = '/lib/simplebar.js';
const scrollStyle = document.createElement('link');
scrollStyle.href = '/lib/simplebar.css';
scrollStyle.rel = 'stylesheet';
document.head.appendChild(scrollScript);
document.head.appendChild(scrollStyle);

const scrollContainers = document.querySelectorAll('#container > div > .content');

scrollScript.addEventListener("load", () => {
  scrollContainers.forEach(scr => {
    new SimpleBar(scr, {
      autoHide: false
    });
  });
});
