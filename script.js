let planData = [];
let currentPlanId = null;

// FORMAT TIME
function formatTime(m){
let h=Math.floor(m/60);
let min=m%60;
if(h>0 && min>0) return h+" hr "+min+" min";
if(h>0) return h+" hr";
return min+" min";
}

// LOGIN
function login(){
let email=document.getElementById("email").value;

if(!email){
alert("Enter email");
return;
}
function register(){
let email=document.querySelector("input").value;

if(!email){
alert("Enter email");
return;
}

localStorage.setItem("user",email);
alert("Registered Successfully");
window.location="login.html";
}

localStorage.setItem("user",email);
window.location="dashboard.html";
}

// ADD SUBJECT
function addSubject(){
let div=document.createElement("div");
div.innerHTML=`
<br>
Subject: <input class="subject">
<select class="difficulty">
<option value="easy">easy</option>
<option value="medium">medium</option>
<option value="hard">hard</option>
</select>
<input type="date" class="exam">
`;
document.getElementById("subjects").appendChild(div);
}

// 🔥 GENERATE PLAN (FIXED FULL LOGIC)
function generate(){

let subjects=[],difficulty=[],exams=[];

document.querySelectorAll(".subject").forEach((el,i)=>{
if(el.value){
subjects.push(el.value);
difficulty.push(document.querySelectorAll(".difficulty")[i].value);
exams.push(document.querySelectorAll(".exam")[i].value);
}
});

let slots = document.getElementById("slots").value
.replace(/\./g,",")
.split(",")
.map(s => s.trim())
.filter(s => s !== "");

let hours=parseFloat(document.getElementById("hours").value);

if(subjects.length==0 || !hours || slots.length==0){
alert("Fill all fields properly");
return;
}

let user = localStorage.getItem("user");

// 🔥 GET HISTORY
fetch("http://127.0.0.1:5000/history",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user:user})
})
.then(res=>res.json())
.then(historyData=>{

// 🔥 STEP 1: TRACK LATEST STATUS OF EACH SUBJECT
let subjectStatus = {};

historyData.forEach(plan=>{
    if(plan.plan){
        plan.plan.forEach(s=>{
            s.tasks.forEach(t=>{
                subjectStatus[t.subject] = t.done;
            });
        });
    }
});

// 🔥 STEP 2: BUILD ONLY PENDING LIST
let pending = [];

Object.keys(subjectStatus).forEach(sub=>{
    if(subjectStatus[sub] === false){
        pending.push(sub);
    }
});

// 🔥 REMOVE DUPLICATES
pending = [...new Set(pending)];

console.log("Pending:", pending);

// 🔥 MERGE INTO CURRENT SUBJECTS
pending.forEach(p=>{
    if(!subjects.includes(p)){
        subjects.push(p);
        difficulty.push("hard");
        exams.push("");
    }
});

// 🔥 CALL BACKEND
fetch("http://127.0.0.1:5000/generate",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
subjects,difficulty,slots,hours
})
})
.then(res=>res.json())
.then(data=>{
planData=data;
showPlan();
});

});
}

// SHOW PLAN
function showPlan(){
let html="";

planData.forEach((slot,i)=>{
html+=`<h3>${slot.slot}</h3>`;

slot.tasks.forEach((t,j)=>{
html+=`
<div style="${t.done?'':'background:#ffe6e6'}">
<input type="checkbox" onchange="markDone(${i},${j})">
${t.subject} - ${formatTime(t.minutes)}
</div>`;
});
});

document.getElementById("result").innerHTML=html;
}

// MARK DONE
function markDone(i,j){

planData[i].tasks[j].done = true;

let user = localStorage.getItem("user");

fetch("http://127.0.0.1:5000/history",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user:user})
})
.then(res=>res.json())
.then(data=>{

let last = data[data.length-1];
currentPlanId = last.id;

fetch("http://127.0.0.1:5000/update",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
id: currentPlanId,
plan: planData
})
});

});
}

// SAVE PLAN
function savePlan(){

let user = localStorage.getItem("user");

fetch("http://127.0.0.1:5000/save",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
user:user,
date:new Date().toLocaleString(),
plan:planData
})
})
.then(()=>alert("Saved"));
}

// LOAD HISTORY
function loadHistory(){

let user = localStorage.getItem("user");

fetch("http://127.0.0.1:5000/history",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user:user})
})
.then(res=>res.json())
.then(data=>{

let html="";
let pending=[];

data.forEach(p=>{
html+=`<hr><h3>${p.date}</h3>`;

p.plan.forEach(s=>{
html+=`<b>${s.slot}</b><br>`;

s.tasks.forEach(t=>{
html+=`${t.subject} - ${formatTime(t.minutes)}<br>`;

if(!t.done){
pending.push(t.subject);
}
});
});
});

document.getElementById("result").innerHTML=html;

pending = [...new Set(pending)];

let phtml="";
pending.forEach(x=>{
phtml+=`<div>${x}</div>`;
});

document.getElementById("pending").innerHTML=phtml;

});
}

// LOGOUT
function logout(){
localStorage.removeItem("user");
window.location="login.html";
}
