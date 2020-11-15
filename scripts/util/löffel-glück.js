
// const innerHTML = document.body.innerHTML.replace(/\b(\w*(löffel|glück)\w*)\b/ig, '<span class="löffel_glück">$1</span>');

// document.body.innerHTML = innerHTML;

// console.log(innerHTML);
// console.log(document.querySelectorAll('text'));

// console.log(document.body.innerHTML.match(/\b(\w*(löffel|glück)\w*)\b/i));

(() => {
  wrap(document.body);

  function wrap_(n, p) {
    if(!n.childElementCount) {
      if(!n.localName && n.textContent && !/^\s+$/.test(n.textContent)) {
        n.textContent = n.textContent.replace(/\b(\w*(löffel|glück)\w*)\b/ig, '<span class="löffel_glück">$1</span>');
      }
    } else {
      n.childNodes.forEach(nn => wrap(nn, n));
    }
  }
  function  wrap(n) {
    n.childNodes.forEach(nn => {

    })
  }
})();
