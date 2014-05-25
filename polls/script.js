function init() {
    var STATE = "INIT";
    var num_anwers;
    var current_answers;

    if ("WebSocket" in window) {
	console.log("Websockets are supported!");
    }
    var socket = new WebSocket('ws://192.168.1.8:8080');
    
    console.log("Waiting for websocket to initialize...");

    socket.onmessage = function (event) {
	console.log(event.data);
	var msg = JSON.parse(event.data);
	if (msg.hasOwnProperty('command')) {
	    switch (msg.command) {
	    case "list-users": 
		
		break;
	    case "ask":
		STATE = "QUESTION_RECEIVED";
		if ( msg.hasOwnProperty('payload') && msg.payload.hasOwnProperty('answers') )
		{
		    num_answers = 0;
		    answers = document.getElementById('poll_answers');
		    // Clean any remaining answers from previous question
		    while (answers.firstChild)
		    {
			answers.removeChild(answers.firstChild);
		    }
		    var i = 0;
		    for (answer in msg.payload.answers) {
			var container = document.createElement('div');
			container.id = i;
			var label = document.createElement('div');
			label.appendChild(document.createTextNode(msg.payload.answers[answer]));
			var bar = document.createElement('div');
			bar.className = "chartBar";
			bar.id = "bar";
			container.appendChild(bar);
			container.appendChild(label);
			answers.appendChild(container);
			i++;
		    }
		}
		break;
	    case "answer":
		if (STATE == "QUESTION_RECEIVED" && msg.hasOwnProperty('payload') && msg.payload.hasOwnProperty('answer_id'))
		{
		    var answer_id = msg.payload.answer_id;
		    num_answers++;
		    current_answers[answer_id]++;
		    answers = window.getElementById('answer_list');
		    for (i in current_answers) {
			var bar = answers.getElementById(i).getElementById("bar");
			bar.setAttribute("style", "height:" + (current_answers[i] / num_answers) * 3 + "em");
			bar.style.height = (current_answers[i] / num_answers) * 3 + "em";
		    }
		}
		break;
	    default:
		console.log("received " + event.data);
	    }
	}
    }
    socket.send(JSON.stringify({
	command : "hello",
    payload : {ownerHint : "browser"}
}));
}
