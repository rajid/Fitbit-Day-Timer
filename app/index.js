import document from "document";
import clock from "clock";
import * as msg from "messaging";
import { memory } from "system";
import * as util from "../common/utils";
import { display } from "display";
import { goals } from "user-activity";
import { today } from "user-activity";
import { units } from "user-settings";
import { battery,charger } from "power";
import { me as device } from "device";


// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
    let hourAngle = (360 / 24) * hours;
    let minAngle = (360 / 24 / 60) * minutes;
    return ((hourAngle + minAngle) + 180) % 360;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes,hourangle) {
    let minangle = ((360 / 60) * minutes);
    let val = minangle - hourangle;
    return val;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
    return (360 / 60) * seconds;
}

//=====================

if (!device.screen) device.screen = {
    width: 348,
    height: 250
};
const screenWidth = device.screen.width;
const screenHeight = device.screen.height;

var now;

clock.granularity = "minutes";
clock.ontick = (evt) => {
    const now=evt.date;

    if (now.getHours() == 0 && now.getMinutes() == 1
       && msg.peersocket.OPEN) {
        fetchCompanionData("sun");
        fetchCompanionData("calendar");
    }

    updateClock(evt.date);

    updateGoals();
}

let useTicks = false;
let tk = document.getElementById("ticks");
let nm = document.getElementById("numbers");
function updateClock(now) {

    if (useTicks == 'true') {
        tk.style.display = "inline";
        nm.style.display = "none";
    } else {
        nm.style.display = "inline";
        tk.style.display = "none";
    }
    let orbit = document.getElementById("orbit");
    let hour_angle = hoursToAngle(now.getHours(), now.getMinutes());
    console.log(`hour_angle = ${hour_angle}`);
    orbit.groupTransform.rotate.angle = hour_angle % 360;
    let hourDot = document.getElementById("earth");
    try{hourDot.style.fill = hourColor}catch(e){}

    let moonorbit = orbit.getElementById("moonorbit");
    let moonangle = (now.getMinutes() * 360) / 60;
    moonangle -= hour_angle;
    console.log(`minute angle = ${moonangle}`);
    moonorbit.groupTransform.rotate.angle = moonangle;
    let minDot = document.getElementById("moon");
    try{minDot.style.fill = minColor}catch(e){}

    let grad = document.getElementById("battery");
    let level = battery.chargeLevel;
    console.log(`battery is at ${battery.chargeLevel}`);
    level = ((level * screenHeight/2) / 100) + (screenHeight/2);
    console.log(`x2,y2 = ${level}`);
    grad.gradient.x2 = level;
    grad.gradient.y2 = level;
}

const stepsArc = document.getElementById("stepsArc");
const stepsRect = document.getElementById("stepsRect");
const stepsLabelbg = document.getElementById("stepsLabelbg");
const stepsLabel = document.getElementById("stepsLabel");
const stepsImage = document.getElementById("stepsImage");
const calsArc = document.getElementById("cals");
const calsRect = document.getElementById("calsRect");
const calsLabelbg = document.getElementById("calsLabelbg");
const calsLabel = document.getElementById("calsLabel");
const calsImage = document.getElementById("calsImage");
const floorsArc = document.getElementById("floorsArc");
const floorsRect = document.getElementById("floorsRect");
const floorsLabelbg = document.getElementById("floorsLabelbg");
const floorsLabel = document.getElementById("floorsLabel");
const floorsImage = document.getElementById("floorsImage");
const activityArc = document.getElementById("activityArc");
const activityRect = document.getElementById("activityRect");
const activityLabelbg = document.getElementById("activityLabelbg");
const activityLabel = document.getElementById("activityLabel");
const activityImage = document.getElementById("activityImage");
function updateGoals() {

    // Steps
    console.log(`today steps = ${today.adjusted.steps}, goal = ${goals.steps}`);
    console.log(`steps = ${((today.adjusted.steps || 0) * 300) / goals.steps}`);
    stepsRect.width = ((today.adjusted.steps || 0) * 300) / goals.steps;
    updateArc(stepsArc, stepsLabel, stepsLabelbg, (goals.steps || 0), (today.adjusted.steps || 0), "Steps");

    // Calories
    calsRect.width = ((today.adjusted.calories || 0) * 300) / goals.calories;
    updateArc(calsArc, calsLabel, calsLabelbg, (goals.calories || 0), today.adjusted.calories, "Calories");

    // Floors
    if (typeof(today.adjusted.elevationGain) !== 'undefined') {
        floorsRect.width = ((today.adjusted.elevationGain || 0) * 300) / goals.elevationGain;
        updateArc(floorsArc, floorsLabel, floorsLabelbg, (goals.elevationGain || 0), today.adjusted.elevationGain, "Floors");
    } else {
        let today_dist = today.adjusted.distance;
        let goal_dist = goals.distance;
        if (units.distance == "metric") {
            today_dist = Math.round(today_dist * 0.001);
            goal_dist = Math.round(goal_dist * 0.001);
        } else {
            today_dist = Math.round(today_dist * 0.000621371);
            goal_dist = Math.round(goal_dist * 0.000621371);
        }
        floorsRect.width = ((today_dist || 0) * 300) / goals_dist;
        updateArc(floorsArc, floorsLabel, floorsLabelbg, (goal_dist || 0), today_dist, "Dist.");
    }

    // Active Minutes
    activityRect.width = ((today.adjusted.activeMinutes || 0) * 300) / goals.activeMinutes;
    updateArc(activityArc, activityLabel, activityLabelbg, (goals.activeMinutes || 0),
              today.adjusted.activeMinutes, "Active");
}
charger.onchange=function() {

    if (!charger.connected) {
        stepsArc.style.display = "inline";
        stepsImage.style.display = "inline";
    } else {
        stepsArc.style.display = "none";
        stepsImage.style.display = "none";
    }        
}

const updateArc =(arc, label, labelbg, goal, burned, text) => {
    let myGoal = (goal || 0);
    let myBurned = (burned);
    if (myBurned > myGoal) { myBurned = myGoal;}
    arc.sweepAngle = (myBurned * 360) / myGoal;
    label.text = `${text}: ${util.numberWithCommas(burned)}/${util.numberWithCommas(goal)}`;
    labelbg.text = `${text}: ${util.numberWithCommas(burned)}/${util.numberWithCommas(goal)}`;
}

//=====================================
// Receiving calendar info:

import { inbox } from "file-transfer";
import { readFileSync } from "fs";
import { writeFileSync } from "fs";

var calColor = [];
var hourColor, minColor;

function fileHandler() {
    console.log("Got new file from companion");
    let fileName;
    while (fileName = inbox.nextFile()) {
        let data = loadData(fileName);
        updatedData(data);
    } while (fileName);
}

function loadData(fileName) {
    console.log(`loadData: ${fileName}`);
    try {
        return readFileSync(fileName, 'cbor');
    } catch (ex) {
        console.error(`Appointment: loadData() failed. ${ex}`);
        return;
    }
}

function existsData() {
    if (data === undefined) {
        console.warn("Appointment: No data found.");
        return false;
    }
    return true;
}

var titles = [];
var times = [];

function updatedData(data) {
    console.log(`updatedData: length=${data.length} ${data}`);

    let events=document.getElementsByClassName("events");

    for (let i = 0 ; i < events.length ; i++) {
        events[i].startAngle = 0;
        events[i].sweepAngle = 0;
    }

    console.log(`Data length = ${data.length}`);
    titles = [];
    times = [];

    let eventLaps = []; // number of events which are overlapping
    let eventDone = [];
    for (let i = 0 ; i < data.length && i < events.length; i++ ) {
        let s = new Date(data[i].s);
        let e = new Date(data[i].e);
        let c = parseInt(data[i].c);

        let startAngle = hoursToAngle(s.getHours(), s.getMinutes());
        let endAngle = hoursToAngle(e.getHours(), e.getMinutes());
        console.log(`Looking at event ${i}: ${data[i].t}`);
        console.log(` startTime: ${s}`);
        console.log(` endTime: ${e}`);
        console.log(` ${startAngle} - ${endAngle} = sweep of ${endAngle - startAngle}`);

        titles[i] = data[i].t;
        times[i] = s.getTime();
        events[i].startAngle = startAngle;
        let sweep = endAngle - startAngle;
        if (sweep < 0) sweep = 360 + sweep;
        if (sweep < 1) sweep = 1;
        console.log(` startangle is ${startAngle}, endangle is ${endAngle}, sweep is ${sweep}`)
        events[i].sweepAngle = sweep;

        console.log(`Calendar ${c} color ${calColor[c]}`);
        if (typeof(calColor[c]) != 'undefined') {
            console.log(`Using calendar color ${calColor[c]}`);
            events[i].style.fill = calColor[c];
        } else {
            events[i].style.fill = "purple";
        }

        if (typeof(eventDone[i]) != 'undefined' && eventDone[i]) {
            console.log(`Skipping event ${i} - ${data[i].t} because it's done already`);
            continue;
        }

        let width = 30;
        events[i].x = (screenHeight * 30) / 100;
        events[i].y = (screenHeight * 30) / 100;
        events[i].width = (screenHeight * 40) / 100;
        events[i].height = (screenHeight * 40) / 100;

        if (eventOverlaps(i, data)) {
            console.log(`Got ${overlaps.length} overlaps`);

            let saveOverlaps = 0;
            for (let i = 0 ; i < overlaps.length ; i++) {
                console.log(`Looking at overlaps[{i}]=${overlaps[i]}`);
                if (typeof(eventLaps[overlaps[i]]) == 'undefined' || overlaps.length > eventLaps[overlaps[i]]) {
                    eventLaps[i] = overlaps.length; // save greater overlaps
                    console.log(`event ${i} has overlap size of ${overlaps.length}, which is greater than before`);
                    saveOverlaps++;
                }
            }

            let width = 30 / overlaps.length;

            console.log(`saveOverlaps = ${saveOverlaps} overlaps.length = ${overlaps.length}`);
            if (saveOverlaps > 0) {
                for (let i = 0 ; i < overlaps.length ; i++) {
                    width = 30 / overlaps.length;
                    events[overlaps[i]].arcWidth = width;
                    let offset = 30 + (width * (i+1));
                    let wh =  (offset * 2);
                    let xy = (screenHeight / 2) - offset;
                    console.log(`events[${overlaps[i]}]: offset=${offset}, x,y=${xy}, width,height=${wh}, arcWidth=${width}`);
                    events[overlaps[i]].x = xy;
                    events[overlaps[i]].y = xy;
                    events[overlaps[i]].width = wh;
                    events[overlaps[i]].height = wh;
                    events[overlaps[i]].style.display = "inline";
                    console.log(`Setting event ${overlaps[i]} as done`);
                    eventDone[overlaps[i]] = 1;
                }
            }
        } else {
//        let width = (30 / (data.length + 1)) * (i + 1);
//        let width = ((6-(data.length)) * 5) * (i+1);
//        let width = 30;
            events[i].arcWidth = width;
            eventDone[i] = 1;
            events[i].style.display = "inline";
        }
        console.log(`i is now ${i}`);
    }
}

var overlaps = [];
function eventOverlaps(num, data) {

    overlaps=[];
    for (let i = 0 ; i < data.length ; i++) {
        if (i == num) {continue}
        console.log(`Comparing num=${num} ${data[num].t} with i=${i} ${data[i].t}`);
        if (
            (data[num].s >= data[i].s &&
             data[num].s <= data[i].e) ||
            (data[num].e >= data[i].s &&
             data[num].e <= data[i].e) ||

            (data[i].s >= data[num].s &&
             data[i].s <= data[num].e) ||
            (data[i].e >= data[num].s &&
             data[i].e <= data[num].e)
           ) {
            console.log(`${num} overlaps with ${i}`);
            overlaps.push(i);
        }
    }

    if (overlaps.length) {
        overlaps.push(num); // event which overlaps this
        console.log(`${num} has overlaps ${overlaps}`);
    }
    return (overlaps.length);
}

inbox.addEventListener("newfile", fileHandler);


//============ Communication with Companion =================

let lastFetch = 0; // time when last fetch was tried
let failedFetches = -1; // number of failed fetches - neg num's are indeterminate
let ackHandle = 0;
let fetchHandle = 0; // handle for regularly scheduled wakeups

/*
 * Comm channel is up - let's get started!
 */
msg.peerSocket.onopen = evt => {
    console.log("Watch is ready");

    if (device.modelId == 38) {
        // Versa Lite - switch "floors" to "distance" - allow for bigger nums
        floorsImage.href = "stat_dist_solid_24px.png";
        stepsLabelbg.style.fontSize = 25;
        floorsLabelbg.style.fontSize = 25;
        calsLabelbg.style.fontSize = 25;
        activityLabelbg.style.fontSize = 25;
        stepsLabel.style.fontSize = 25;
        floorsLabel.style.fontSize = 25;
        calsLabel.style.fontSize = 25;
        activityLabel.style.fontSize = 25;
        msg.peerSocket.send({command: "lite"});
    }
    fetchCompanionData("sun");
//    fetchCompanionData("calendar");
}

// Try to fix a comm/peerSocket communication error by exiting
// and having the OS restart us automatically
function fixComm(now) {
    var exited;
    //console.log("Looking for forceExit file");
    try {
        let s = statSync("forceExit");
        exited = true;
    } catch (err) {
        exited = false;
    }
    //console.log(`Found exited to be set as ${exited}`);
    if (!exited) {
        // give up, exit, and get restarted
        writeFileSync("forceExit", { // log that we force exited
            time: now  // This file is removed once comm works
        }, "json");
        let s = statSync("forceExit");
        //console.log(`forceexit file info ${s}`);
        watch.exit(); // Bye!
    } else {
//        vibNudge(now);
    }
}

msg.peerSocket.onmessage = evt => {
    let sunup = document.getElementById("sunup");
    let sundown = document.getElementById("sundown");

    now = new Date();

    console.log("******* mess: " + evt.data.key);

    console.log(`Pres: ${memory.monitor.pressure} ${memory.js.used} / ${memory.js.total}`);
    switch (evt.data.key) {
    case "ack":
        //console.log("Received ACK");
        
        failedFetches = 0; // Ok!  We have communication!            
        if (ackHandle) {
            clearTimeout(ackHandle); // Got our "ack"!
            ackHandle = 0;
        }
//        updateFetches();
        break;

    case "sun":
        console.log(`up: ${evt.data.value.upAngle}`);
        console.log(`down: ${evt.data.value.downAngle}`);

        sunup.startAngle = evt.data.value.upAngle;
        sunup.sweepAngle = evt.data.value.upSweep;

        sundown.startAngle = evt.data.value.downAngle;
        sundown.sweepAngle = evt.data.value.downSweep;

        break;

    case "calColor":
        calColor[evt.data.number] = evt.data.value;
        console.log(`calColor[${evt.data.number}] is ${evt.data.value}`);
        try {
            loadData("events");
        }catch(e){}
        break;

    case "dayColor":
        sunup.style.fill = evt.data.value;
        break;

    case "nightColor":
        sundown.style.fill = evt.data.value;
        break;

    case "hourColor":
        hourColor = evt.data.value;
        break;

    case "minColor":
        minColor = evt.data.value;
        break;

    case "hourLColor":
        let hourLine = document.getElementById("earthLine");
        hourLine.style.fill = evt.data.value;
        break;

    case "minLColor":
        let minLine = document.getElementById("moonLine");
        minLine.style.fill = evt.data.value;
        break;

    case "bgColor":
        let bg = document.getElementById("background");
        let grad = document.getElementById("battery");
        let cornerbg = document.getElementById("cornerbg");
        if (evt.data.value == "none") {
            bg.style.display = "none";
            grad.gradient.colors.c2 = "black";
            cornerbg.style.fill = "black";
            cornerbg.style.display = "none";
        } else {
            bg.style.display = "inline";
            bg.style.fill = evt.data.value;
            grad.gradient.colors.c2 = evt.data.value;
            cornerbg.style.fill = evt.data.value;
            cornerbg.style.display = "inline";
        }
        break;

    case "ticks":
        useTicks = evt.data.value;
        return;
        
    case "tickColor":
        tk.style.fill = evt.data.value;
        nm.style.fill = evt.data.value;
        break;

    case "batColor":
        let grad = document.getElementById("battery");
        grad.gradient.colors.c1 = evt.data.value;
        break;
        
    case "stepsColor":
        stepsArc.style.fill = evt.data.value;
        stepsImage.style.fill = evt.data.value;
        stepsRect.style.fill = evt.data.value;
        break;
    case "caloriesColor":
        calsArc.style.fill = evt.data.value;
        calsImage.style.fill = evt.data.value;
        calsRect.style.fill = evt.data.value;
        break;
    case "floorsColor":
        floorsArc.style.fill = evt.data.value;
        floorsImage.style.fill = evt.data.value;
        floorsRect.style.fill = evt.data.value;
        break;
    case "activityColor":
        activityArc.style.fill = evt.data.value;
        activityImage.style.fill = evt.data.value;
        activityRect.style.fill = evt.data.value;
        break;

    case "clock":
        updateClock(new Date());
        break;

    case "goals":
        updateGoals(new Date());
        break;
    case "cal":
        fetchCompanionData("calendar");
        break;
    }

    // Received some type of message from companion - so comm is working
    try {
        unlinkSync("forceExit"); // note that comm is now working
    } catch (err) {}

    // Write out all settings info
//    writeSettings();
}

function fetchCompanionData(cmd) {
    var worked;
    now = new Date();

    if (msg.peerSocket.readyState === msg.peerSocket.OPEN) {
        // Send a command to the companion
        msg.peerSocket.send({
            command: cmd
        });
        lastFetch = now.getTime();
        if (failedFetches < 0) failedFetches--; // we hope for the best, but...
        else failedFetches = -1;
        worked = true;
    } else {
        if (failedFetches > 0) failedFetches++;
        else failedFetches = 1;
        worked = false;
    }

//    updateFetches();
    // If we have seen too many failures, we're tracking BG values,
    // and we're not in the quiet time range, and we haven't
    // snoozed comm channel warnings, then tell us about this.
    if (Math.abs(failedFetches) > 10) {
        fixComm(now);
    }
    return worked;
}

function wakeupAck() {
    clearTimeout(ackHandle);
    
    wakeupFetch();
}

/*
 * Primary routine called from a setTimeout, performing the fetch and doing retries
 */
function wakeupFetch() {

    if (!nsConfigured) return;
    
    //console.log("Wakeup and fetch data");
    
    if (!fetchCompanionData("data")) {
        // Failed - reschedule another try
        if (fetchHandle) clearTimeout(fetchHandle);
        fetchHandle = setTimeout(wakeupFetch, 10 * 1000);
    } else {
        // Even then, we still need to see an "ack"
        if (ackHandle) clearTimeout(ackHandle);
        ackHandle = setTimeout(wakeupAck, 5 * 1000);
    }
}


//=========================
// touching on the screen forces an update
// and displays numbers in the corners

let cornerEnd = 0; // init
let clicker = document.getElementById("clicker");
const cornerTimeInit = 10;      // time to remain on screen

clicker.onclick = function(e) {
    console.log("click");
    if (cornerEnd == 0) {
        cornerEnd = new Date();
        cornerEnd = cornerEnd.getTime() + (cornerTimeInit * 1000);
        setTimeout(updateCorners, cornerTimeInit * 1000);
        
        let corners = document.getElementById("corners");
        let cornerbg = document.getElementById("cornerbg");
        corners.style.display = "inline";
        cornerbg.style.display = "inline";
        updateCorners();
        fetchCompanionData("calendar");
    } else {
        cornerEnd = 0;
        updateCorners();
    }
}

function updateCorners() {
    now = new Date();

    let datebg = document.getElementById("datebg");
    let date = document.getElementById("date");
//    let timebg = document.getElementById("timebg");
    let time = document.getElementById("time");
    let corners = document.getElementById("corners");

    /*
     * Update corner numbers, if we're showing them
     */
    if (now.getTime() < cornerEnd) {
        date.text = `${now.getMonth()+1}/${now.getDate()} ${util.zeroPad(now.getHours())}:${util.zeroPad(now.getMinutes())}`;
        datebg.text = date.text;
//        timebg.text = `${util.zeroPad(now.getHours())}:${util.zeroPad(now.getMinutes())}`;
//        time.text = `${util.zeroPad(now.getHours())}:${util.zeroPad(now.getMinutes())}`;
    } else {
        corners.style.display = "none";
        cornerEnd = 0;
    }

    /* Find next calendar event */
    let saved_time = 0;
    var saved_index;

    console.log(`>>> Now is ${now.getTime()}`);
    for (let i = 0 ; i < times.length ; i++) {
        console.log(`>>> Looking at index ${i} = ${titles[i]} ${times[i]}`);
        if (times[i] >= now.getTime() && (saved_time == 0 || times[i] < saved_time)) {
            saved_time = times[i];
            saved_index = i;
        }
    }
    
    if (saved_time > 0) {
        console.log(`saved_indesx = ${saved_index}`);
        console.log(`saved_time = ${saved_time}`);
        let tbg = document.getElementById("nextbg");
        let t = document.getElementById("next");
        let m = (times[saved_index] - now.getTime()) / (60*1000);
//        console.log(`m=${m}, now is ${now}, times is ${times[saved_index]}`);
        let tm = new Date(times[saved_index]);
        t.text = `Next event: ${util.zeroPad(tm.getHours())}:${util.zeroPad(tm.getMinutes())}\n`;
        if (m > 60) {
            let h = Math.floor(m / 60);
            m = Math.floor(m % 60);
            t.text += `(in ${h} hour, ${Math.floor(m)} mins)\n${titles[saved_index]}`;
        } else {
            m = oneDecimal(m);
            t.text += `(in ${Math.floor(m)} mins)\n${titles[saved_index]}`;
        }
        tbg.text = t.text;
        t.style.display = "inline";
        tbg.style.display = "inline";
    }
}

//=================================================

let bg = document.getElementById("background");
let ticks = document.getElementById("ticks");


function oneDecimal(f) {
    return(parseFloat(Math.round(f * 10) / 10).toFixed(1));
}
