const prompt = require("prompt");
const fs = require("fs");

var command = process.argv[2];

function BasicCard(front, back) {
    this.front = front;
    this.back = back;
}

function ClozeCard(text, cloze) {
    this.cloze = cloze;
    this.text = text;
    this.return_cloze = function() {
        return this.cloze;
    }
    this.return_text = function() {
        return this.text;
    }
    this.return_full = function() {
            this.full_text = text.replace("...", cloze);
            return this.full_text;
        }
        //ClozeCard should throw or log an error when the cloze deletion does not appear in the input text.
}
var log_cards = (type, question, answer) => {
    if (type == "basic") {
        var card = new BasicCard(question, answer);
    } else {
        var card = new ClozeCard(question, answer);
    }
    card = JSON.stringify(card);
    fs.appendFile("log.txt", card + ",", function(err) {
        if (err) {
            console.log(err);
        }
    })
}

var create_cards = (type) => {
    var question, answer;
    prompt.start();
    var card_question = {
        name: "question",
        message: "What's the question or full text for cloze?"
    };
    var card_answer = {
        name: "answer",
        message: "What's the answer or cloze text?"
    };
    prompt.get([card_question, card_answer], function(err, result) {
        question = result.question;
        answer = result.answer;
        log_cards(type, question, answer);
    });
}


var create_cards_prompt = () => {
    prompt.start();

    var curr_prompt = {
        name: "card_type_prompt",
        message: "Ok. Choose a basic card type or cloze card type. Enter basic or cloze",
        validator: /basic|cloze|b|c/,
        warning: "Must respond basic or cloze.",
    };

    prompt.get(curr_prompt, function(err, result) {
        var card_type;
        if (result.card_type_prompt === "basic" | result.card_type_prompt === "b") {
            card_type = "basic";
            create_cards(card_type);
        } else if (result.card_type_prompt === "cloze" | result.card_type_prompt === "c") {
            card_type = "cloze";
            console.log("Okay. For cloze cards, we will substitute the cloze word with '...'");
            create_cards(card_type);
        } else {
            console.log("Try again.");
            create_cards_prompt();
        }
    })
}
var practice_cards = () => {
    var body = fs.readFileSync("log.txt");
    if (body[0] === 123){ //char [ in ascii; essentially checking to see if the log has already been turned into actual JSON formatting; if not, forcing [] around objs. In retrospect this seems weird as heck, but I was getting it o work with JSON... I shall refactor, maybe...
	    body = `[${body}]`;
	    fs.writeFileSync("log.txt", body);
	}
	var number_correct, number_wrong = 0;
    fs.readFile("log.txt", function(err, data) {
        if (err) {
            console.log(err);
        }
        data = JSON.parse(data);
        console.log("Starting practice flashcards.");
        for (var i = 0; i < data.length; i++){
        	var current_question = {
        		name: "question",
        		message: data[i].front,
        		answer: data[i].back
        	}
        	prompt.get(current_question, function (err, result){
        		if (result.question === current_question.answer){
        			number_correct++;
        			console.log("Correct.");
        		} else {
        			number_wrong++;
        			console.log(`Wrong. Correct answer: ${current_question.answer}`);
        		}
        	})
        }
    })
}

var init = () => {
    switch (command) {
        case "practice":
            practice_cards();
            break;
        case "create":
            create_cards_prompt();
            break;
        default:
            console.log("Not a valid command. Gotta enter create or practice. Exiting.");
    }
}


init();
