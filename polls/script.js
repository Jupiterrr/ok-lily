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
		    current_answers = [];
		    num_answers = 0;
		    answers = document.getElementById('poll_answers');
		    // Clean any remaining answers from previous question
		    while (answers.firstChild)
		    {
			answers.removeChild(answers.firstChild);
		    }
		    for (answer in msg.payload.answers) {
			var container = document.createElement('div');
			container.id = "cont" + answer;
			var label = document.createElement('div');
			label.appendChild(document.createTextNode(msg.payload.answers[answer]));
			var bar = document.createElement('div');
			bar.className = "chartBar";
			bar.id = "bar" + answer;
			container.appendChild(bar);
			container.appendChild(label);
			answers.appendChild(container);
			current_answers.push(0);
		    }
		}
		break;
	    case "answer":
		if (STATE == "QUESTION_RECEIVED" && msg.hasOwnProperty('payload') && msg.payload.hasOwnProperty('answer_id'))
		{
		    var answer_id = msg.payload.answer_id;
		    num_answers++;
		    current_answers[answer_id]++;
		    answers = document.getElementById('poll_answers');
		    for (i in current_answers) {
			var bar = document.getElementById("bar" + i);
			// bar.setAttribute("style", "height:" + (current_answers[i] / num_answers) * 3 + "em");
      // bar.setAttribute("style", "height:" + current_answers[i] + "em");
			bar.style.height = current_answers[i] * 3 + "em";
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
