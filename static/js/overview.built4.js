function handleRibbon() {
  const myElement = document.querySelector("#ribbon");
  const scrollT = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollT > 500) {
    myElement.classList.add("hide");
  } else {
    myElement.classList.add("animate");
    myElement.classList.remove("hide");
  }
}

window.onscroll = handleRibbon;
window.onload = handleRibbon;
