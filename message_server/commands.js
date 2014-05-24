
function listCommand(room, sender, messageObj) {
  var ids = room.list().map(function(device) { return device.id; });
  var msgObj = {
    command: "list_users",
    payload: {
      participants : ids
    }
  }
  sender.sendObj(msgObj);
}

function defaultCommand(room, sender, messageObj) {
  room.broadcast(sender, messageObj);
}


module.exports = {
  listCommand: listCommand,
  defaultCommand: defaultCommand
};