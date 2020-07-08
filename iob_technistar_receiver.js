//// CONFIGURATION 
///////////////////////////////////////////////////////
const STATE_PATH = "javascript.0.TechniSat.";
const tsHOST="127.0.0.1";
const tsPORT=8090;
const tsPIN=0000;
const net = require("dgram").createSocket("udp4");
const tsLOG = true;  // true or false

///////////////////////////////////////////////////////
//// FUNCTIONALITY - DO NOT CHANGE BELOW THIS LINE ////
///////////////////////////////////////////////////////
let remoteMessage = "";
let tsAUTH = "ERROR";

// XML-Strings ...
const ts_deviceDiscoveryRequest    = '<deviceDiscoveryRequest/>';
const ts_deviceInformationRequest  = '<deviceInformationRequest/>';
const ts_keepAliveRequest          = '<keepAliveRequest/>';
const ts_keepAliveResponse         = '<keepAliveResponse/>';

let pCommands = [];
var inc = 0;
pCommands['Button: 0']          = [inc++]; // 0
pCommands['Button: 1']          = [inc++]; // 1
pCommands['Button: 2']          = [inc++];
pCommands['Button: 3']          = [inc++];
pCommands['Button: 4']          = [inc++];
pCommands['Button: 5']          = [inc++];
pCommands['Button: 6']          = [inc++];
pCommands['Button: 7']          = [inc++];
pCommands['Button: 8']          = [inc++];
pCommands['Button: 9']          = [inc++];
pCommands['Switch Dec']         = [inc++]; // 10
pCommands['Standby']            = [inc++];
pCommands['Mute']               = [inc++]; // 12
pCommands['NotUsed_13']         = [inc++]; // 13
pCommands['List']               = [inc++];
pCommands['Volume Up']          = [inc++]; // 15
pCommands['Volume Down']        = [inc++];
pCommands['Help']               = [inc++];
pCommands['Program Up']         = [inc++];
pCommands['Program Down']       = [inc++];
pCommands['Back']               = [inc++]; // 20
pCommands['Audio']              = [inc++];
pCommands['Still']              = [inc++];
pCommands['EPG']                = [inc++];
pCommands['EXT']                = [inc++];
pCommands['TXT']                = [inc++]; // 25
pCommands['OFF']                = [inc++]; 
pCommands['Toggle IRC']         = [inc++];
pCommands['TV SAT']             = [inc++];
pCommands['Info']               = [inc++];
pCommands['Up']                 = [inc++]; // 30
pCommands['Down']               = [inc++]; 
pCommands['Menu']               = [inc++];
pCommands['TV Radio']           = [inc++];
pCommands['Left']               = [inc++];
pCommands['Right']              = [inc++]; // 35
pCommands['OK']                 = [inc++]; 
pCommands['Red']                = [inc++];
pCommands['Green']              = [inc++];
pCommands['Yellow']             = [inc++];
pCommands['Blue']               = [inc++]; // 40
pCommands['Option']             = [inc++]; 
pCommands['Sleep']              = [inc++];
pCommands['Rec']                = [inc++];
pCommands['PIP']                = [inc++];
pCommands['Zoom']               = [inc++]; // 45
pCommands['Genre']              = [inc++]; 
pCommands['HDMI']               = [inc++];
pCommands['More']               = [inc++];
pCommands['Rewind']             = [inc++];
pCommands['Stop']               = [inc++]; // 50
pCommands['Play Pause']         = [inc++]; 
pCommands['Wind']               = [inc++];

init();

function init() {

    // createStatus ...
    let createCount = 0;
    /**
     *  Command state Drop-down
     */
    // create drop-down list
    let dropdown = '';
    for (let lpEntry of Object.keys(pCommands)) {   // 'special' loop here to get the keys
        dropdown += '"' + pCommands[lpEntry] + '":"' + lpEntry + '",'; // fill JSON string
    }
    dropdown = dropdown.substr(0, dropdown.length-1); // remove last comma ","
    dropdown = '{' + dropdown + '}'; // finalize JSON string
    let dropdownJSON = JSON.parse(dropdown); // convert to JSON
 
    // Create state. Force is set to true, so we will always update the states if e.g. configuration in this script changed.
    createCount++;
    createState(STATE_PATH + 'Command', undefined, true, {'name':'Send Command to Receiver', 'type':'string', 'read':false, 'write':true, 'role':'value', 'states': dropdownJSON}, () => !--createCount && callback && callback());

    createCount++;
    createState(STATE_PATH + 'Toggle On Off',  {'name':'Turn Receiver OnOff',  'type':'boolean', 'read':false, 'write':true, 'role':'button', 'def':false }, () => !--createCount && callback && callback());
   // createCount++;
   // createState(STATE_PATH + 'Off', {'name':'Turn Receiver Off', 'type':'boolean'});//, 'read':false, 'write':true, 'role':'button', 'def':false }, () => !--createCount && callback && callback());

    createCount++;
    createState(STATE_PATH + 'Power State',  {'name':'PowerStatus',  'type':'boolean'});//, 'read':false, 'write':false, 'role':'state', 'def':false }, () => !--createCount && callback && callback());

    createCount++;
    createState(STATE_PATH + 'Type', undefined, true, {'name':'Receiver Type'});//,  'type':'string', 'read':false, 'write':true, 'role':'value', 'def':false });

    // listen to Changes
    ////////////////////////////////////////////////////////
    // Command pull-down menu state
    on({id: STATE_PATH + 'Command', change: 'any', ack: false}, function (obj) {
        sendMessage(obj.state.val);
    });
 
    // TechniStar on/off buttons
    on({id: STATE_PATH + 'Toggle On Off', val: true, ack: false}, function (obj) {
        //powerPhilipsTv(true);
        sendMessage("Standby");
    });
 
    // Get Device Information
    ////////////////////////////////////////////////////////
    sendMessage(ts_deviceInformationRequest);

    // Discover Device(s)
    ////////////////////////////////////////////////////////
    sendMessage(ts_deviceDiscoveryRequest);

    // set Event Listeners for UDP-Socket ...
    ////////////////////////////////////////////////////////
    net.on('end', function () {
        if (tsLOG == true)
            console.log('disconnected from server');
    });

    net.on('error', function (error) {
        if (tsLOG == true)
            console.error('error: ' + error);
        net.close();
    });

    net.on('message', function (message, remote) {
        if (tsLOG == true)
            console.log('Message from ' + remote.address + ':' + remote.port +': ' + message);

        if (message.indexOf("deviceInformationResponse") > 0) {
            // Message Received Device Information ...
            // <deviceInformationResponse name="TechniStar S3 ISIO" softwareVer="2.57.0.4 (2575i)" protocolVer="1.5" hardwareVer="47.2" serial="0008c92e481028f4"><capabilities><type>STB</type><rcu/><keyboard/><mouse/></capabilities></deviceInformationResponse>

        } else if (message.indexOf("authenticationResponse") > 0 ) {
            // Answer: Authentication
            // <authenticationResponse result="SUCCESS" />
            var msg = message.toString().match(/result="(.*?)"/i);
            tsAUTH = msg[1];
            if (tsLOG == true)
              console.log("Authentication: " + msg[1]);

        } else if (message.indexOf("deviceDiscoveryResponse") > 0 ) {
            // Answer: DeviceInformation
            // <deviceDiscoveryResponse name="TechniStar S3 ISIO" type="STB" serial="0008c92e481028f4"/>
            var msg = message.toString().match(/name="(.*?)"/i);
            setState(STATE_PATH + "Type", msg[1], true);
            if (tsLOG == true)
              console.log("ReceiverType: " + msg[1]);    

        } 
        else {
            // everything else

        }
    });

    net.on('listening', function () {
        if (tsLOG == true) {
            var address = net.address();       
            console.log('UDP Server listening on ' + address.address + ":" + address.port);
        }
    });

    // first authentication
    var auth = doAuth();

    return true;
}

function sendMessage(message) {
  var msg = "";
  
  if (message.length <= 4)
    msg = "<rcuButtonRequest code='"+ message +"' state='pressed'/>";
  else 
    msg = message;

  net.send(message, 0, message.length, tsPORT, tsHOST, function () {
    if (tsLOG == true)
      console.log("Nachricht [[" + msg + "]] abgesetzt");
    if (message.length <= 4)
      sendMessage("<rcuButtonRequest code='"+ message +"' state='released'/>");
  });
}

function doAuth() {
    if (tsPIN != "") {
        sendMessage('<authenticationRequest pin="' + tsPIN +'" />');
        
    } else
        return false;
}
