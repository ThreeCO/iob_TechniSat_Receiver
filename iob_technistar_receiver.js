//// CONFIGURATION 
///////////////////////////////////////////////////////
const tsHOST   ="";
const tsPORT   =8090;
const tsPIN    =;
const net = require("dgram").createSocket("udp4");

///////////////////////////////////////////////////////
//// FUNCTIONALITY - DO NOT CHANGE BELOW THIS LINE ////
///////////////////////////////////////////////////////

function sendMessage(message) {

  net.on('end', function () {
    console.log('disconnected from server');
  });
  
  net.on('error', function (error) {
    console.error('error: ' + error);
    net.close();
  });
  
  net.on('message', function (message, remote) {
    console.log('Message from ' + remote.address + ':' + remote.port +': ' + message);
  });
  
  net.on('listening', function () {
    var address = net.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
  });

  net.send(message, 0, message.length, tsPORT, tsHOST, function () {
      console.log("Nachricht [[" + message + "]] abgesetzt");
  });
 
}
sendMessage( '<deviceinformationrequest>');

sendMessage('<authenticationRequest pin="' + tsPIN +'" />');
sendMessage('<rcuButtonRequest code="1" state="pressed" />');
sendMessage('<rcuButtonRequest code="1" state="released" />');

sendMessage( '<rcuButtonRequest code="11" state="pressed" />');
sendMessage( '<rcuButtonRequest code="11" state="pressed" />');
