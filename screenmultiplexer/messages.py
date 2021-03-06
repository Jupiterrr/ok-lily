import json
from websocket import create_connection

class event_channel:
    def __init__(self):
        self.handlers = {}
        self.my_id = None

    def generate_message(self, command, targetid, payload = {}):
        return json.dumps({"command": command, "targetID": targetid, "payload": payload})


    def generate_hello_message(self, owner_hint = ""):
        return json.dumps({"command": "hello", "payload": {"owner_hint": owner_hint}})

    def register_handler(self, command, handler):
        self.handlers[command] = handler

    def send(self, msg):
        if self.ws is None:
            print "can not send message since I am not connected"
        else:
            self.ws.send(msg)

    def get_ip(self):
        if self.ws is None:
            print "not connected"
        else:
            return self.ws.sock.getsockname()[0]

    def loop(self, endpoint, owner_hint = "", targetBindings = ["any"]):
        print "connection to " + endpoint
        self.ws = create_connection(endpoint)
        print "connected :)"
        self.send(self.generate_hello_message(owner_hint))
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
                data_parsed = {}
                print "could not parse data"

            if "targetID" not in data_parsed:
                print "message does not contain a targetID - ignoring it"
                continue
            print data_parsed

            if str(data_parsed['targetID']).lower() != self.id and str(data_parsed['targetID']).lower() not in targetBindings:
                print "this message is not meant for me (was for %s)" % str(data_parsed["targetID"])
                continue

            if data_parsed["command"] in self.handlers:
                if "payload" in data_parsed:
                    self.handlers[data_parsed["command"]](data_parsed["payload"])
                else:
                    self.handlers[data_parsed["command"]]()

                print "handled that"
            else:
                print "no handler registered for that command"

