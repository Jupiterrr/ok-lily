import json
from websocket import create_connection

class event_channel:
    def __init__(self):
        self.handlers = {}
        self.my_id = None

    def generate_message(self, command, senderid, targetid, payload = {}):
        return json.dumps({"command": command, "senderID": senderid, "targetID": targetid, "payload": payload})

    def generate_hello_message(self, id = "no id given :("):
        return json.dumps({"command": "hello", "payload": {}})

    def register_handler(self, command, handler):
        self.handlers[command] = handler

    def send(self, msg):
        if self.ws is None:
            print "can not send message since I am not connected"
        else:
            self.ws.send(msg)

    def loop(self, endpoint):
        print "connection to " + endpoint
        self.ws = create_connection(endpoint)
        print "connected :)"
        self.send(self.generate_hello_message())
        ack = json.loads(self.ws.recv())
        self.id = str(ack["payload"]["id"])
        print "my id is " + self.id
        while True:
            data = self.ws.recv()
            data_parsed = {}
            print "received " + data

            try:
                data_parsed = json.loads(data)
            except:
                print "could not parse data"

            if "targetID" not in data_parsed:
                print "message does not contain a targetID - ignoring it"
                continue

            if str(data_parsed["targetID"]).to_lower() != self.id:
                print "this message is not meant for me (was for %s)" % str(data_parsed["targgetID"])
                continue

            if data_parsed["command"] in handlers:
                handlers[data_parsed["command"]](data_parsed["payload"])
                print "handled that"
            else:
                print "no handler registered for that command"

