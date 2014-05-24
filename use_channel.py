import websocket
import thread
import time
import sys
import json

def on_message(ws, message):
    print ">> " + message

def on_error(ws, error):
    print "!! " + error

def on_close(ws):
    print "### closed ###"

def on_open(ws):
    def run(*args):
        while True:
            command = raw_input("<<")
            if command == "exit":
                break
            #try:
            ws.send(json.dumps(command))
            #except:
            #    print "could not send that (json correct?)"
        ws.close()
    thread.start_new_thread(run, ())


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(sys.argv[1],
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()
