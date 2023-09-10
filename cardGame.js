"use strict";

// --- VARIABLES ---

let cardsUp = 0;
const cardsUpId = { "0" : null,"1" : null };
const cardsUpObj = { "0" : null,"1" : null };
let blocked = false;
let action = "";
let imageExtension = ".svg";

let points = 0;
let tries = 0;
let pairs = 0;
let seconds = 1;

let timeResetCards; //Timeout that resets card values
let timer; //Interval that increases seconds
const root = document.documentElement;
const screen = document.getElementById("screen");
const content = document.getElementById("content");
const infoContainer = document.getElementById("info-container");
const cardsContainer = document.getElementById("cards-container");
const recordsContainer = document.getElementById("records-container");
const startButton = document.getElementById("button-start");
const optionButton = document.getElementById("button-options");
startButton.addEventListener("click",()=> startGame(startButton) );

const recordNum1 = document.getElementById("record-num1");
const recordNum2 = document.getElementById("record-num2");
const recordNum3 = document.getElementById("record-num3");
const records = [];

let audio = true;
const audioSelect = document.getElementById("audioSelect");
const audioPick = document.getElementById("audioPick");
const audioFail = document.getElementById("audioFail");

// --- CARD PROTOTYPE ---

class Card {
	constructor(id) {
		this.id = id;

		this.idCode = 0;
		while(true) {
			const idGenerated = Math.floor(Math.random()*9999)+1;
			if (document.getElementById("card"+idGenerated) === null) {
				this.idCode = idGenerated;
				break;
			}
		}

		this.imgId = (id+1);

		this.img = document.createElement("img");
		this.img.src = "JWCGimages/card"+this.imgId+imageExtension;
		this.img.alt = "Card"+this.imgId;

		this.shown = false;
		this.picked = false;

		this.element = document.createElement("div");
		this.element.id = "card"+this.idCode;
		this.element.classList.add("card","unshown");
		this.element.addEventListener("click",()=>{
			if (!this.picked) {
				if (blocked) { speedAction(); }
				const elm = document.getElementById(this.element.id);
				if (this.shown) {
					cardsUp--;
					cardsUpId[cardsUp] = null;
					cardsUpObj[cardsUp] = null;
					elm.classList.add("unshown");
					elm.classList.remove("shown");
				} else {
					cardsUpId[cardsUp] = this.id;
					cardsUpObj[cardsUp] = this;
					cardsUp++;
					elm.classList.add("shown");
					elm.classList.remove("unshown");
				}
				this.shown = (!this.shown);
				if (audio && cardsUp < 2) audioSelect.play();
				refresh();
			}
		});
		this.element.addEventListener("dragstart",(evt) => evt.preventDefault());
		this.element.appendChild(this.img);
	};
}

// --- FUNCTION TO CREATE CARDS ---

function createCards() {
	const deckCards = [];
	let i = 0;
	while (i < 12) {
		deckCards[i] = 0;
		i++;
	}

	i = 0;
	while (i < 24) {
		let cardToCreate = Math.floor(Math.random()*11)
		createCard(cardToCreate);
		i++;
	}

	// --- FUNCTION TO CREATE ONE CARD --- (it is inside to be able to use the "deckCards" var)
	function createCard(c) {
		if (c > 11) { createCard(0) }
		else if (deckCards[c] == 2) {
			createCard(c+1);
		} else {
			const card = new Card(c);
			cardsContainer.appendChild(card.element);
			deckCards[c]++;
		}
	}
}

// --- FUNCTION TO REFRESH CARDS ---

function refresh() {
	if (!(cardsUp < 2)) {
		blocked = true;
		if (cardsUpId[0] == cardsUpId[1]) {
			action = "correct";
			points += calcPoints(seconds,tries);
			cardsUpObj[0].picked = true;
			cardsUpObj[1].picked = true;
			for (let i=0;i<2;i++){
				cardsUpObj[i].timer1 = setTimeout(()=>{
					cardsUpObj[i].element.style.animation = "1.53s ease-in-out correctCard";
					if (audio) audioPick.play();
				},100);
				cardsUpObj[i].timer2 = setTimeout(()=>{
					cardsUpObj[i].element.classList.replace("shown","picked");
				},1500);
			}
			timeResetCards = setTimeout(()=> resetValues(), 1500);
			pairs++;
		}
		else {
			action = "incorrect";
			for (let i=0;i<2;i++){
				cardsUpObj[i].timer1 = setTimeout(()=>{
					cardsUpObj[i].element.style.animation = "0.65s linear incorrectCard";
					if (audio) audioFail.play();
				},400);
				cardsUpObj[i].timer2 = setTimeout(()=>{
					cardsUpObj[i].element.classList.replace("shown","unshown");
					cardsUpObj[i].shown = false;
				},1300);
			}
			timeResetCards = setTimeout(()=> resetValues(), 1300);
			tries++;
		}
	}
}

// --- SHORT EXTRA FUNCTIONS ---

//Starts the game
function startGame(child) {
	points = 0;
	tries = 0;
	pairs = 0;
	seconds = 1;
	cardsContainer.classList.remove("container-flex");
	startTime(true);
	createCards();
	resetValues();
	recordsContainer.remove();
	infoContainer.removeChild(optionButton);
	infoContainer.style.setProperty("grid-template","1fr 1fr / 1fr 1fr");
	child.remove();
}

//On-off the time
function startTime(on) {
	if (on) {
		timer = setInterval(()=>{
			seconds++;
			document.getElementById("secondsCounter").innerHTML = seconds;
		},1000);
	} else {
		clearInterval(timer);
	}
}

//Refresh user points
function refreshPoints() {
	document.getElementById("pointCounter").innerHTML = points;
	document.getElementById("triesCounter").innerHTML = tries;
	document.getElementById("pairsCounter").innerHTML = pairs;
	if (pairs === 12) { createRestartButton(); }
}

//Reset card values
function resetValues() {
	blocked = false;
	for (let i=0; i<2; i++){
		if (cardsUpObj[i] !== null) {
			cardsUpObj[i].element.style.animation = "";
			cardsUpId[i] = null;
			cardsUpObj[i] = null;
		}
	}
	cardsUp = 0;
	action = "";
	refreshPoints();
}

//Calculate the points
function calcPoints(time,fails) {
	let base = 5000;
	base = Math.floor(base / (Math.floor(time/4)));
	if (base == Infinity) base = 5000;
	base -= (fails*5);
	if (base <= 0) base = 1;
	return base;
}

//Skip the cards animations
function speedAction() {
	clearTimeout(timeResetCards);
	clearTimeout(cardsUpObj[0].timer1);
	clearTimeout(cardsUpObj[0].timer2);
	clearTimeout(cardsUpObj[1].timer1);
	clearTimeout(cardsUpObj[1].timer2);
	if (action == "correct") {
		cardsUpObj[0].element.classList.replace("shown","picked");
		cardsUpObj[1].element.classList.replace("shown","picked");
	} else if (action == "incorrect") {
		cardsUpObj[0].element.classList.replace("shown","unshown");
		cardsUpObj[0].shown = false;
		cardsUpObj[1].element.classList.replace("shown","unshown");
		cardsUpObj[1].shown = false;
	}
	resetValues();
}

//Create the restart button when all the cards are picked up
function createRestartButton() {
	const pickedCards = cardsContainer.childNodes;
	const staticLength = pickedCards.length;
	for (let i=0; i<staticLength; i++){
		pickedCards[0].remove();
	}
	const button = document.createElement("button");
	button.innerHTML = "Play Again";
	button.classList.add("button");
	button.id = "button-start";
	button.addEventListener("click",()=>{
		pairs = 0;
		resetValues();
		const buttonRemove = document.getElementById("button-start");
		startGame(buttonRemove);
	});
	cardsContainer.classList.add("container-flex");
	cardsContainer.appendChild(button);
	infoContainer.appendChild(optionButton);
	infoContainer.style.setProperty("grid-template","1fr 1fr / 1fr 1fr 1fr");
	content.appendChild(recordsContainer);
	pushRecord(points,seconds,tries);
	startTime(false);
}

//Place a record in the leaderboard
function pushRecord(po,ti,tr) {
	if (records[0] === undefined) stablishRecord(0,po,ti,tr);
	else {
		let stablished = false;
		for (let i in records) {
			if (po > parseInt(records[i].points)) {
				records.splice(i,0,undefined);
				stablishRecord(i,po,ti,tr);
				stablished = true;
				break;
			}
		}
		if (!stablished) stablishRecord(records.length,po,ti,tr);
	}
	updateRecords();
}

//Creates an objecto for a record
function stablishRecord(index,po,ti,tr) {
	records[index] = {
		"points" : po,
		"time" : ti,
		"tries" : tr
	}
}

//Updates the HTML of the records
function updateRecords() {
	if (records[0] !== undefined) recordNum1.innerHTML = `- ${records[0].points} in ${records[0].time} seconds (${records[0].tries} tries)`;
	if (records[1] !== undefined) recordNum2.innerHTML = `- ${records[1].points} in ${records[1].time} seconds (${records[1].tries} tries)`;
	if (records[2] !== undefined) recordNum3.innerHTML = `- ${records[2].points} in ${records[2].time} seconds (${records[2].tries} tries)`;
}