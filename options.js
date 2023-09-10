"use-strict";

const optionContent = document.createElement("div");
optionContent.id = "content";
const options = document.createElement("div");
options.classList.add("container","container-options");
options.innerHTML = `
	<h2 class="options-title">Options</h2>
	<button class="back-button button" onclick="closeOptions()">&lt</button>
	<div class="option">
		<span>Theme: </span>
		<div class="buttons-container">
			<button class="options-button-color selected"
				onclick="selectTheme('black')"
				style="background-color: #000;"></button>
			<button class="options-button-color"
				onclick="selectTheme('purple')"
				style="background-color: #a0a;"></button>
			<button class="options-button-color"
				onclick="selectTheme('orange')"
				style="background-color: #fa0;"></button>
			<button class="options-button-color"
				onclick="selectTheme('blue')"
				style="background-color: #00f;"></button>
			<button class="options-button-color"
				onclick="selectTheme('green')"
				style="background-color: #0a0;"></button>
			<button class="options-button-color"
				onclick="selectTheme('red')"
				style="background-color: #d00;"></button>
		</div>
	</div>
	<div class="option">
		<span>Sound Effects: </span>
		<div class="buttons-container">
			<button onclick="selectAudio(true);" class="options-button-yesno yes options-button-sound">Yes</button>
			<button onclick="selectAudio(false);" class="options-button-yesno options-button-sound">No</button>
		</div>
	</div>
	<div class="option">
		<span>SVG Images: </span>
		<div class="buttons-container">
			<button onclick="selectSVG(true);" class="options-button-yesno yes options-button-svg">Yes</button>
			<button onclick="selectSVG(false);" class="options-button-yesno options-button-svg">No</button>
		</div>
	</div>
`;
optionContent.appendChild(options);

optionButton.addEventListener("click",()=>{
	screen.appendChild(optionContent);
	content.remove();
})

function selectTheme(id) {
	const buttonContainer = document.querySelectorAll(".options-button-color");
	for (let i = 0; i < buttonContainer.length; i++) {
		buttonContainer[i].classList.toggle("selected",false);
	}
	switch (id) {
		case "black": root.style.setProperty("--themeColor1","#4e4e4e");
						root.style.setProperty("--themeColor2","#434343");
						buttonContainer[0].classList.add("selected");
						break;
		case "purple": root.style.setProperty("--themeColor1","#52075F");
						root.style.setProperty("--themeColor2","#4A074C");
						buttonContainer[1].classList.add("selected");
						break;
		case "orange": root.style.setProperty("--themeColor1","#5E4A07");
						root.style.setProperty("--themeColor2","#4D3607");
						buttonContainer[2].classList.add("selected");
						break;
		case "blue": root.style.setProperty("--themeColor1","#07565E");
						root.style.setProperty("--themeColor2","#07474D");
						buttonContainer[3].classList.add("selected");
						break;
		case "green": root.style.setProperty("--themeColor1","#075E08");
						root.style.setProperty("--themeColor2","#094D07");
						buttonContainer[4].classList.add("selected");
						break;
		case "red": root.style.setProperty("--themeColor1","#5E0707");
						root.style.setProperty("--themeColor2","#4D0707");
						buttonContainer[5].classList.add("selected");
						break;
	}
}

function selectAudio(id) {
	const buttonContainer = document.querySelectorAll(".options-button-sound");
	if (id) {
		audio = true;
		buttonContainer[0].classList.add("yes");
		buttonContainer[1].classList.remove("yes");
	} else {
		audio = false;
		buttonContainer[0].classList.remove("yes");
		buttonContainer[1].classList.add("yes");
	}
}

function selectSVG(id) {
	const buttonContainer = document.querySelectorAll(".options-button-svg");
	if (id) {
		imageExtension = ".svg";
		buttonContainer[0].classList.add("yes");
		buttonContainer[1].classList.remove("yes");
	} else {
		imageExtension = ".png";
		buttonContainer[0].classList.remove("yes");
		buttonContainer[1].classList.add("yes");
	}
}

function closeOptions() {
	screen.appendChild(content);
	optionContent.remove();
}