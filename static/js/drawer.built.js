const DATA_COPY = 'data-copy';
let container = document.querySelector('[data-drawer-container]');
let content = document.querySelector('[data-drawer-content]');
let button = document.querySelector('.drawer-toggle');
let iconUp = document.querySelector('.drawer-toggle .drawer-copy-up');
let iconDown = document.querySelector('.drawer-toggle .drawer-copy-down');



function setStyle(obj, sty) {
	for (var i in sty) {
  		obj.style[i] = sty[i];
	}
}


button.addEventListener('click', function(){

	if(!container.classList.contains('opened')){

		let height = container.clientHeight + "px"; 
	
		container.setAttribute('data-height', height);

		container.classList.add('opened');
		container.style.height = "auto";
		
		content.classList.remove("hide");

		newHeight = container.clientHeight + "px";

		container.style.height = height;


		setTimeout(() => {
			container.style.height = newHeight;

			setStyle(iconUp, { opacity: 0, 'z-index': 0, color:'#fff'})
			
			button.setAttribute('aria-label', button.getAttribute(`${DATA_COPY}-close`));
			button.setAttribute('aria-expanded', true);

		}, 0)

		setTimeout(() => {
			setStyle(iconDown, {opacity: 1, 'z-index' : 1, color:'#06c'})
		}, 100)

	}
	else{

		container.style.height = container.attributes['data-height'].nodeValue

		container.addEventListener('transitionend', () => {

            container.classList.remove('opened');
            
            content.classList.add("hide");

            button.setAttribute('aria-label', button.getAttribute(`${DATA_COPY}-open`));
            button.setAttribute('aria-expanded', false);
            
            setStyle(iconDown, {opacity: 0, 'z-index' : 0, color: '#fff'})
			setStyle(iconUp, {opacity: 1, 'z-index' : 1, color: '#06c'})

        }, {once: true})

	}

	
})

window.addEventListener("resize", () => {
	if(container.classList.contains('opened')){
		if(parseInt(container.style.height) < parseInt(content.clientHeight)){
			container.style.height = parseInt(content.clientHeight) + 'px';

		}
	}
});
