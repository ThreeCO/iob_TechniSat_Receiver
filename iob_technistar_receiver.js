//// CONFIGURATION 
///////////////////////////////////////////////////////
const STATE_PATH = "javascript.0.TechniStar.";
const tsHOST="0.0.0.0";
const tsPORT=8090;
const tsPIN=0000;
const net = require("dgram").createSocket("udp4");
const tsLOG = true;  // true or false

///////////////////////////////////////////////////////
//// FUNCTIONALITY - DO NOT CHANGE BELOW THIS LINE ////
///////////////////////////////////////////////////////
let remoteMessage = "";

// XML-Strings ...
const ts_deviceDiscoveryRequest    = '<deviceDiscoveryRequest/>';
const ts_deviceInformationRequest  = '<deviceInformationRequest/>';
const ts_keepAliveRequest          = '<keepAliveRequest/>';
const ts_keepAliveResponse         = '<keepAliveResponse/>';

let pCommands = [];
//        0.Command Name                       1.Path              2. curl Command
//pCommands['Cmd: Ambilight Hue On'] = ['menuitems/settings/update',   '{"values":[{"value":{"Nodeid":2131230774,"Controllable":"true","Available":"true","data":{"value":"true"}}}]}'];
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
//pCommands['']         = [inc++];
//pCommands['']         = [inc++];
//pCommands['']         = [inc++]; // 55
//pCommands['']         = [inc++]; 
//pCommands['']         = [inc++];
//pCommands['']         = [inc++];
//pCommands['']         = [inc++];
//pCommands['']         = [inc++]; // 60

//      (Code:   53; Name: 'BTN_CODESAT1';   Description: 'CODE SAT1'),
//      (Code:   54; Name: 'BTN_CODESAT2';   Description: 'CODE SAT2'),
//      (Code:   55; Name: 'BTN_CODETV1';    Description: 'CODE TV1'),
//      (Code:   56; Name: 'BTN_CODETV2';    Description: 'CODE TV2'),
//      (Code:   57; Name: 'BTN_CODEVCR1';   Description: 'CODE VCR1'),
//      (Code:   58; Name: 'BTN_CODEVCR2';   Description: 'CODE VCR2'),
//      (Code:   59; Name: 'BTN_FREESATBACK';Description: 'FREESAT BACK'),
//      (Code:   60; Name: 'BTN_AD';         Description: 'AD'),
//      (Code:   61; Name: 'BTN_SUBTITLE';   Description: 'SUBTITLE'),
//      (Code:   62; Name: 'BTN_NAV';        Description: 'NAVIGATION'),
//      (Code:   63; Name: 'BTN_PAGEUP';     Description: 'PAGE UP'),
//      (Code:   64; Name: 'BTN_PAGEDOWN';   Description: 'PAGE DOWN'),
//      (Code:   65; Name: 'BTN_PVR';        Description: 'PVR'),
//      (Code:   66; Name: 'BTN_WWW';        Description: 'WWW'),
//      (Code:   67; Name: 'BTN_TIMER';      Description: 'TIMER'),
//      (Code:   68; Name: 'BTN_NOTUSED68';  Description: 'BUTTON 68 NOT USED'),
//      (Code:  105; Name: 'BTN_NOTUSED105';  Description: 'BUTTON 105 NOT USED'),
//      (Code:  106; Name: 'BTN_KBDF1';       Description: 'KEYBOARD F1'),
//      (Code:  107; Name: 'BTN_KBDF2';       Description: 'KEYBOARD F2'),
//      (Code:  108; Name: 'BTN_KBDF3';       Description: 'KEYBOARD F3'),
//      (Code:  109; Name: 'BTN_KBDF4';       Description: 'KEYBOARD F4'),
//      (Code:  110; Name: 'BTN_KBDF5';       Description: 'KEYBOARD F5'),
//      (Code:  111; Name: 'BTN_KBDF6';       Description: 'KEYBOARD F6'),
//      (Code:  112; Name: 'BTN_KBDF7';       Description: 'KEYBOARD F7'),
//      (Code:  113; Name: 'BTN_KBDF8';       Description: 'KEYBOARD F8'),
//      (Code:  114; Name: 'BTN_KBDF9';       Description: 'KEYBOARD F9'),
//      (Code:  115; Name: 'BTN_KBDF10';      Description: 'KEYBOARD F10'),
//      (Code:  116; Name: 'BTN_KBDF11';      Description: 'KEYBOARD F11'),
//      (Code:  117; Name: 'BTN_KBDF12';      Description: 'KEYBOARD F12'),
//      (Code:  118; Name: 'BTN_SOFTKEY1';    Description: 'SOFTKEY 1'),
//      (Code:  119; Name: 'BTN_SOFTKEY2';    Description: 'SOFTKEY 2'),
//      (Code:  120; Name: 'BTN_SOFTKEY3';    Description: 'SOFTKEY 3'),
//      (Code:  121; Name: 'BTN_SOFTKEY4';    Description: 'SOFTKEY 4'),
//      (Code:  122; Name: 'BTN_KBDINFO';     Description: 'KEYBOARD INFO'),
//      (Code:  123; Name: 'BTN_KBDDOWN';     Description: 'KEYBOARD DOWN'),
//      (Code:  124; Name: 'BTN_KBDUP';       Description: 'KEYBOARD UP'),
//      (Code:  125; Name: 'BTN_KBDMODE';     Description: 'KEYBOARD MODE'),
//      (Code:  126; Name: 'BTN_DOFLASH';     Description: 'DO FLASH RESET'),
//      (Code:  127; Name: 'BTN_NOTDEFINED';  Description: 'BUTTON NOT DEFINED'),
//      (Code:  128; Name: 'BTN_INVALID';     Description: 'BUTTON INVALID')


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
    createState(STATE_PATH + 'On',  {'name':'Turn Receiver On',  'type':'boolean', 'read':false, 'write':true, 'role':'button', 'def':false }, () => !--createCount && callback && callback());
    createCount++;
    createState(STATE_PATH + 'Off', {'name':'Turn Receiver Off', 'type':'boolean', 'read':false, 'write':true, 'role':'button', 'def':false }, () => !--createCount && callback && callback());

    createCount++;
    createState(STATE_PATH + 'Power State',  {'name':'PowerStatus',  'type':'boolean', 'read':false, 'write':false, 'role':'state', 'def':false }, () => !--createCount && callback && callback());


    // listen to Changes
    ////////////////////////////////////////////////////////
    // Command pull-down menu state
    on({id: STATE_PATH + 'Command', change: 'any', ack: false}, function (obj) {
        sendMessage(obj.state.val);
    });
 
    // TechniStar on/off buttons
    on({id: STATE_PATH + 'TvOn', val: true, ack: false}, function (obj) {
        //powerPhilipsTv(true);
    });
    on({id: STATE_PATH + 'TvOff', val: true, ack: false}, function (obj) {
        powerPhilipsTv(false);
    });
 
    // Get Device Information
    ////////////////////////////////////////////////////////
    sendMessage(ts_deviceInformationRequest);

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

        } else if message.indexOf("authenticationResponse") >0 ) {
            // Answer: Authentication

        } else if {
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
    msg = "<rcuButtonRequest code='"+ message +"' state='pressed' />";
  else 
    msg = message;
  net.send(message, 0, message.length, tsPORT, tsHOST, function () {
      console.log("Nachricht [[" + msg + "]] abgesetzt");
  });
}

function doAuth() {
    if (tsPIN != "") {
        sendMessage('<authenticationRequest pin="' + tsPIN +'" />');
        
    } else
        return false;
}
