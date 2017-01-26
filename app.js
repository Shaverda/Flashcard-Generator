//control flow of this is kinda confusing and if I had had time, I woulda refactored that... Designed to be started with node app.js practice or node app.js create.


const prompt = require("prompt");
const fs = require("fs");

var command = process.argv[2];

function BasicCard(front, back) {   //constructor for basic cards
    this.front = front;
    this.back = back;
}

function ClozeCard(text, cloze) { //constructor for cloze cards
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
}

var log_cards = (type, question, answer) => {   //creates new cards based off constructor and works with our log.txt to make sure it's not already a json from prior card practicing. Writes card to file.
    if (type == "basic") {
        var card = new BasicCard(question, answer);
    } else {
        var card = new ClozeCard(question, answer);
    }

    var body = fs.readFileSync("log.txt");
    if (body[0] === 91) {   //essentially checking to see if it's already been turned into a jsonlike thingerz
        body = body.slice(1,-1);    //deletes [] around json
        body += ",";
        fs.writeFileSync("log.txt", body);
    }

    card = JSON.stringify(card);
    fs.appendFile("log.txt", card + ",", function(err) {
        if (err) {
            console.log(err);
        }
    })
}

var get_ques_and_ans = (type) => {  //prompt to get question/answer to card
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


var get_card_type = () => { //prompt to get card type
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
            get_ques_and_ans(card_type);
        } else if (result.card_type_prompt === "cloze" | result.card_type_prompt === "c") {
            card_type = "cloze";
            console.log("Okay. For cloze cards, we will substitute the cloze word with '...'");
            get_ques_and_ans(card_type);
        } else {
            console.log("Try again.");
            get_card_type();
        }
    })
}

var practice_cards = () => { //this whole part is weird and essentially was created in order to be able to read json files. Reads our log.txt, works with formatting, then parses it as JSON and passes to display_cards
    var body = fs.readFileSync("log.txt");
    if (body[0] === 123) { //char { in ascii; essentially checking to see if the log hasn't already been turned into actual JSON formatting; if not, forcing [] around objs. In retrospect this seems weird, but I was getting it to work with JSON... I shall refactor, maybe...
        body = body.slice(0, -1); //removing trailing comma
        body = `[${body}]`; //wrapping in []
        fs.writeFileSync("log.txt", body);
    }
    fs.readFile("log.txt", function(err, data) {
        if (err) {
            console.log(err);
        }
        data = JSON.parse(data);
        console.log("Starting practice flashcards.");
        display_cards(data);
    })
}
var number_correct = 0,
    number_wrong = 0;
var current_question_num = 0;

var display_cards = (data) => { //while you still have questions, use prompt to get user input and display appropriate responses
    if (current_question_num < data.length) {
        var current_question = {
            name: "question",
            message: data[current_question_num].front,
            answer: data[current_question_num].back
        }
        prompt.get(current_question, function(err, result) {
            if (result.question === current_question.answer) {
                number_correct++;
                console.log("Correct. Next question...");
            } else {
                number_wrong++;
                console.log(`Wrong. Correct answer: ${current_question.answer}. Next question...`);
            }
            current_question_num++;
            display_cards(data);
        })

    } else {
        console.log(`Practice over. You had ${number_correct} right and ${number_wrong} wrong.`);
    }
}

var init = () => {  //case statement to start this whole thing up.
    switch (command) {
        case "practice":
            practice_cards();
            break;
        case "create":
            get_card_type();
            break;
        default:
            console.log("Not a valid command. Gotta enter create or practice. Exiting.");
    }
}


init();
