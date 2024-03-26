/* 
let meta = document.createElement("meta");
let id = parseInt(localStorage.getItem('rotationIndex') == undefined ? Math.random() > 0.5 ? 0 : 1 : localStorage.getItem('rotationIndex'));
const ribbon_display = ["cn_edu_pricing_ribbon","cn_financing_ribbon"];

let analytics_value = ribbon_display[id];

meta.setAttribute("property", "analytics-s-page-tracking-data");

meta.content = `{"prop2": "${analytics_value}"}`;

document.getElementsByTagName("head")[0].appendChild(meta);


window.onload = function(){
	if(document.querySelector('[data-component="rotation"]')){
		
		let sosumi = document.querySelectorAll('.ac-gf-sosumi ul:first-child li');

		document.querySelectorAll('.rotation')[id].classList.add('rotation-show');
		if(id){

			sosumi[0].classList.add('show');
			sosumi[0].id='footnote-1';
		}

		localStorage.setItem('rotationIndex', Math.abs(id - 1));

	}
}
*/


let id = parseInt(localStorage.getItem('rotationIndex') == undefined ? Math.random() > 0.5 ? 0 : 1 : localStorage.getItem('rotationIndex'));
window.onload = function(){
	if(document.querySelector('[data-toggle-bts-2023="acmi"]')){
		document.querySelectorAll('.rotation')[id].classList.add('rotation-show');
		localStorage.setItem('rotationIndex', Math.abs(id - 1));
	}
}