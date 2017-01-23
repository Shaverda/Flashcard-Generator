const prompt = require("prompt");
const fs = require("fs");

function BasicCard (front, back) {
	this.front = front;
	this.back = back;
}

function ClozeCard (cloze, text) {
	this.cloze = cloze;
	this.text = text;
	this.full_text = cloze + text;
	this.return_cloze = function(){ return this.cloze;}
	this.return_text = function(){ return this.text;}
	//ClozeCard should throw or log an error when the cloze deletion does not appear in the input text.
}


var create_cards_basic = () => {
	console.log("Ok. ");
	prompt.start();
	var card_question = {
		name: "question",
		message: "What's the question?"
	}
	var card_answer = {
		name: "answer",
		message: "What's the answer?"
	}
	prompt.get([card_question, card_answer], function (err, result){
		console.log(result.question);
		console.log(result.answer);
	})
}

var create_cards_cloze = () => {

}

var create_cards_prompt = () => {
	prompt.start();

	var card_type = {
		name: "card_type",
		message: "Ok. Choose a basic card type or cloze card type. Enter basic or cloze",
		validator: /basic|cloze/,
		warning: "Must respond basic or cloze.",
	};

	prompt.get(card_type, function (err, result){
		if (result.card_type === "basic"){
			create_cards_basic();
		} else if (result.card_type === "cloze"){
			create_cards_cloze();
		} else { 
			console.log("Try again."); 
			create_cards_prompt();
		}
	})
}
var command = process.argv[2];

var init = () => {
	switch (command){
		case "practice": 
			//code here
			break;
		case "create":
			create_cards_prompt();
			break;
		default:
			console.log("Not a valid command. Gotta enter create or practice. Exiting.");
	}
}


init();