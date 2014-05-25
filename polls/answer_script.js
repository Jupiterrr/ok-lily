function init() {
    var STATE = "INIT";
    var num_anwers;
    var current_answers;

    var socket = new WebSocket('ws://192.168.1.2:8080');
    function sendMessage(msg){
        // Wait until the state of the socket is not ready and send the message when it is...
        waitForSocketConnection(socket, function(){
            console.log("message sent!!!");
            socket.send(msg);
        });
    }

    // Make the function wait until the connection is made...
    function waitForSocketConnection(socket, callback){
        setTimeout(
            function () {
                if (socket.readyState === 1) {
                    console.log("Connection is made")
                    if(callback != null){
                        callback();
                    }
                    return;

                } else {
                    console.log("wait for connection...")
                    waitForSocketConnection(socket, callback);
                }

            }, 5); // wait 5 millisecond for the connection...
    }

    
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
		if ( msg.hasOwnProperty('payload') && msg.payload.hasOwnProperty('answers') && msg.payload.hasOwnProperty('question') )
		{
		    var question = document.getElementById('poll_question');
		    question.appendChild(document.createTextNode(msg.payload.question));
		    num_answers = 0;
		    answers = document.getElementById('poll_answers');
		    // Clean any remaining answers from previous question
		    while (answers.firstChild)
		    {
			answers.removeChild(answers.firstChild);
		    }
		    for (answer in msg.payload.answers) {
			var button = document.createElement('button');
			button.id = answer;
			button.onclick = function(e) {
			    sendMessage(JSON.stringify( {
				command: "answer",
				payload: {
				    answer_id : this.id
				}
			    }));
			}
			button.appendChild(document.createTextNode(msg.payload.answers[answer]));
			answers.appendChild(button);
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
    sendMessage(JSON.stringify({
	command : "hello",
    payload : {ownerHint : "browser"}
}));
}
