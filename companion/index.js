console.log('Hello world!');

    
import * as cbor from "cbor";
import { outbox } from "file-transfer";
import * as messaging from "messaging";
import * as util from "../common/utils";



// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
    console.log(`********** Companion received message: ${evt.data.command}`);
    sendSetting("ack", 0, ""); // ack the request
    switch (evt.data.command) {
    case "sun":
        getRiseSet();
        break;
    case "calendar":
        getEvents();
        break;
    case "lite":
        console.log(`>>>>>>>>>>>>>>>>> Got Lite`);
        settingsStorage.setItem('isLite', 'true');
        break;
    }
}

let delayedEvents = false;
function sendEvents(data) {
    if (!finishInit) {
        // If not done with init, wait until then
        console.log("Waiting for init to finish");
        delayedEvents = true;
    }

    console.log("Sending events");
    outbox.enqueue("events", cbor.encode(data)).catch(error => {
        console.warn(`Failed to enqueue data. Error: ${error}`);
    });
}

function sendSetting(item, num, value) {
    console.log(`sendsetting ${item},${num},${value}`);
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log(`Sending settings data... key=${item}, num=${num}, value=${value}`);
        messaging.peerSocket.send({
            key: item,
            number: num,
            value: value
        });
    } else {
        console.log("No peerSocket connection");
    }  
}


//=======================
// Calendar info

import calendars from "calendars";
import { me as companion } from "companion";
var sendCal =[];
var calId = [];
var calIdx = [];

//if (me.permissions.granted("access_calendar")) {

let events = [];
function getEvents() {
    
    calendars
        .searchSources()
        .then(sources => {
            console.log("All calendar data sources");
            return calendars.searchCalendars();
        })
        .then(results => {
            console.log("All calendars");
            let idx;
            for (let i in results) {
                console.log(`Calendar: Id ${results[i].id} index [${i}] ${results[i].title}`);
                console.log(`Looking at calIdx[${results[i].id}] = '${calIdx[results[i].id]}'`);
                if (sendCal[calIdx[results[i].id]] === null) {
                    sendCal[calIdx[results[i].id]] = true;
                    console.log(`forcing to show this calendar`);
                }
                if (typeof(calIdx[results[i].id]) !== 'undefined') {
                    console.log(`Found calendar ID - index = ${calIdx[results[i].id]}`);
                    idx = parseInt(calIdx[`${results[i].id}`]);
//                    calIdx[results[i].id] = i;
//                    calId[i] = results[i].id;
                } else {
                    idx = ++maxCalId;
                    calId[idx] = results[i].id;
                    calIdx[results[i].id] = `${idx}`;
                    settingsStorage.setItem(`calId${idx}`, results[i].id);
                    settingsStorage.setItem(`calname${idx}`, `${results[i].title}`);
                    settingsStorage.setItem(`cal${idx}`, 'true');
                    sendCal[idx] = 'true';
                    console.log(`New calendar ID - index ${i} = ${calIdx[results[i].id]}`);
                }
            }
            const start = new Date();
            const end = new Date();
            
            // 48hr window
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            const eventsQuery = {
                startDate: start,
                endDate: end
            };
            
            return calendars.searchEvents(eventsQuery);
        })
        .then(eventData => {
            // All events
            events = [];
            eventData.forEach(event => {
                let index = event.calendarId;
                console.log(`Event is on calendar ${index} ${calIdx[`${index}`]} - display is ${sendCal[calIdx[index]]}`);
                if (`${sendCal[calIdx[index]]}` == 'true') {
                    console.log(`send this says ${sendCal[calIdx[index]]}`);
                    if (!event.isAllDay) {
                        console.log(`${event.sourceId} [calendar calIdx[${event.calendarId}] - ${event.title}: ${event.startDate} - ${event.endDate}`);
                        events.push({c: calIdx[event.calendarId],
                                     s: event.startDate.getTime(),
                                     e: event.endDate.getTime(),
                                     t: event.title});
                    }
                }
            });
//            if (events && events.length > 0) {
                sendEvents(events);
//            }
        })
        .catch(error => {
            // Inform the user about the error
            console.error(error);
            console.error(error.stack);
        });
//}
}

console.log("End of companion");

//========== Reading Settings Info ===========
import { settingsStorage } from "settings";

settingsStorage.onchange = updateSetting;

function updateSetting(evt, updateConfigStr) {
    console.log(`Got settings storage change ${evt.key} to ${evt.newValue}`);
    let data = {
        key: evt.key,
        newValue: evt.newValue
    };
    
    if (saveVal(data, true)) {
        sendVal(data);
    }
}

var now;
function saveVal(evt, fromSettings) {
    
    now = new Date();
    
    console.log(`saveVal got ${evt.key} = ${evt.newValue}`);
    
    var newName;
    try {
        newName = JSON.parse(evt.newValue).name.trim().toLowerCase();
    }catch(e){newName = ''}

    switch (evt.key) {
    case "ticks":
        let toggleValue = settingsStorage.getItem("ticks");
        sendSetting("ticks", 0, toggleValue);
        if (fromSettings)
            sendSetting("clock");
        return;
        
    case "dayColor":
        if (newName == '') newName = 'lightgrey';
    case "nightColor":
        if (newName == '') newName = "steelblue";
    case "hourColor":
        if (newName == '') newName = "blue";
    case "minColor":
        if (newName == '') newName = "blue";
    case "hourLColor":
        if (newName == '') newName = "red";
    case "minLColor":
        if (newName == '') newName = "red";
    case "bgColor":
        if (newName == '') newName = "lightgrey";
    case "tickColor":
        if (newName == '') newName = "white";
    case "batColor":
        if (newName == '') newName = "blue";
        sendSetting(evt.key, 0, newName);
        if (fromSettings)
            sendSetting("clock");
        return;

    case "stepsColor":
        if (newName == '') newName = "brown";
    case "caloriesColor":
        if (newName == '') newName = "red";
    case "floorsColor":
        if (newName == '') newName = "sienna";
    case "activityColor":
        if (newName == '') newName = "orange";
        sendSetting(evt.key, 0, newName);
        if (fromSettings)
            sendSetting("goals");
        return;

    case "calall":
        if (evt.newValue == 'true') {
            for (let i in sendCal) {
                console.log(`i = ${i}`);
                sendCal[i] = 'true';
                console.log(`sendCal[${i}] now set to ${sendCal[i]}`);
                settingsStorage.setItem(`cal${i}`, 'true');
            }
        } else if (evt.newValue == 'false') {
            for (let i in sendCal) {
                console.log(`i = ${i}`);
                sendCal[i] = 'false';
                console.log(`sendCal[${i}] now set to ${sendCal[i]}`);
                settingsStorage.setItem(`cal${i}`, 'false');
            }
        }
        settingsStorage.removeItem("calall");
        sendSetting("cal");
    }

    if (evt.key.slice(0,8) === "calcolor") {
        sendSetting("calColor", parseInt(evt.key.slice(8)),
                    JSON.parse(evt.newValue).name.trim().toLowerCase());
        if (fromSettings)
            getEvents();
    } else if (evt.key.slice(0,3) === "cal") {
        let index = parseInt(evt.key.slice(3));
        console.log(`Display calendar ${index}  ${evt.newValue}`);
        sendCal[index] = evt.newValue;
        console.log(`sendCal[calId[${index}]] is set to ${evt.newValue}`);
        if (fromSettings)
            getEvents();
    }
}

//============ Sunrise & Sunset =============
import { geolocation } from "geolocation";


function riseSet(lat, lon) {
    now = new Date();

    now.setHours(12);
    now.setMinutes(0);
    now.setSeconds(0);
    console.log(`======== timezone offset is ${now.getTimezoneOffset()}`);
    now=new Date(now.getTime()-(now.getTimezoneOffset()*1000*60));
    console.log(`======== now is ${now}`);
    let then=new Date("Jan 1 2000 12:00:00 PM GMT");
    console.log(`======== year is ${then.getYear()}`);
    then.setYear(2000);
    then.setHours(12,0,0,0);
    console.log(`then = ${then}`);
    let n = now-then;
    n = (n / (1000*60*60*24)) - 0.0008;
    console.log(`======= n = ${n}`);
    
    let jStar=n-(lon/360);
    console.log(`========== jStar = ${jStar}`);
    let M=(357.5291 + (0.98560028 * jStar) ) % 360;
    let C=(1.9148*Math.sin(util.d2r(M))) + (0.02*Math.sin(util.d2r(2*M))) + (0.0003*Math.sin(util.d2r(3*M)));
    let lambda=(M+C+180+102.9372) % 360;
    let jTransit=2451545.0+jStar+(0.0053*Math.sin(util.d2r(M)))-(0.0069*Math.sin(util.d2r(2*lambda)));
    console.log(`========= jTransit = ${jTransit}`);
    let sind=Math.sin(util.d2r(lambda)) * Math.sin(util.d2r(23.44));
    let d=Math.asin(sind);
    let cosw=(Math.sin(util.d2r(-0.83)) - Math.sin(util.d2r(lat)) * sind) / (Math.cos(util.d2r(lat)) * Math.cos(d));
    let w=Math.acos(cosw);
    let jRise=jTransit - (util.r2d(w)/360);
    let jSet=jTransit + (util.r2d(w)/360);
    
    let sunrise=new Date(then.getTime()+(jRise-2451545.0)*1000*60*60*24);
    console.log(`Sunrise: ${sunrise}`);
//    console.log(`${then} - ${sunrise.getHours()}`);
    
    let sunset=new Date(then.getTime()+(jSet-2451545.0)*1000*60*60*24);
    console.log(`Sunset: ${sunset}`);

//========================

    let startAngle=(((sunrise.getHours()*60)+sunrise.getMinutes()) * 360) / (24*60);
    console.log(`startangle=${startAngle}`);
    startAngle += 180;
    startAngle %= 360;
    
    let sweepAngle=(((sunset.getHours()*60)+sunset.getMinutes()) * 360) / (24*60);
    sweepAngle += 180;
    sweepAngle -= startAngle;
    sweepAngle %= 360;
    console.log(`sweepangle=${sweepAngle}`);
    
    let sa = (startAngle + sweepAngle) % 360;
    console.log(`sa=${sa}`);
    console.log(`sweepangle=${startAngle + sa % 360}`);

    sendSetting("sun", 0, {upAngle: startAngle,
                           upSweep: sweepAngle,
                           downAngle: sa,
                           downSweep: (startAngle - sa) % 360
                          });
}

function getRiseSet() {
    geolocation.getCurrentPosition(locationSuccess, locationError);
}

function locationSuccess(position) {
    console.log("Latitude: " + position.coords.latitude,
                "Longitude: " + position.coords.longitude);

    riseSet(position.coords.latitude, position.coords.longitude);
    
    return;
}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

var finishInit = false;
messaging.peerSocket.onopen = evt => {

    console.log("Restore Settings");
    for (let index = 0; index < settingsStorage.length; index++) {
        let key = settingsStorage.key(index);
        switch (key) {
        case "calall":
        case "isLite":
            continue;
        }
        if (key) {
            let data = {
                key: key,
                newValue: settingsStorage.getItem(key)
            };
            if (saveVal(data, false)) {
                sendVal(data);
            }
        }
    }
    
    sendSetting("clock");
    sendSetting("goals");
    
    finishInit = true;
    if (delayedEvents) {
        delayedEvents = false;
        sendEvents(events);
    }
}


// Initializations

for (let i = 0 ; i < 30 ; i++) {
    try {
        sendCal[i] = settingsStorage.getItem(`cal${i}`);
        console.log(`sendCal[${i}] = ${sendCal[i]}`);
    }catch(e){}
}

var maxCalId=0;
for (let i = 0 ; i < 30 ; i++) {
    try {
        calId[i] = settingsStorage.getItem(`calId${i}`);
        console.log(`Recovering calendar info - ${i}: ${calId[i]}`);
        calIdx[`${calId[i]}`] = `${i}`;
        if (calId[i] !== null && i > maxCalId) maxCalId = i;
    }catch(e){}
}
settingsStorage.removeItem(`calall`);
