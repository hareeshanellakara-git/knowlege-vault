const form = document.getElementById("examForm");
const grid = document.getElementById("subjectsGrid");

let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let activities = JSON.parse(localStorage.getItem("activities")) || [];

renderSubjects();
syncDashboard();

form.addEventListener("submit", function(e){
    e.preventDefault();

    const subject = {
        name: subjectName.value,
        examDate: examDate.value,
        reviseDate: reviseDate.value,
        priority: priority.value,
        progress: 0
    };

    subjects.push(subject);

    addActivity(`Added ${subject.name}`);

    save();
    form.reset();
});

function renderSubjects(){

    grid.innerHTML = "";

    subjects.forEach((sub,index)=>{

        const days = countdown(sub.examDate);

        const card = document.createElement("div");
        card.className = "subject-card";

        card.innerHTML = `
            <span class="priority-badge ${sub.priority.toLowerCase()}">${sub.priority}</span>

            <h3>${sub.name}</h3>

            <div class="subject-dates">
                📅 Exam: ${sub.examDate}<br>
                🔁 Revise: ${sub.reviseDate || "Not set"}
            </div>

            <div class="countdown">${days}</div>

            <div class="subject-progress">
                <div class="subject-progress-fill" style="width:${sub.progress}%"></div>
            </div>

            <div class="subject-buttons">
                <button class="complete-btn" onclick="completeSub(${index})">Done</button>
                <button class="revise-btn" onclick="reviseSub(${index})">Revise</button>
                <button class="delete-btn" onclick="deleteSub(${index})">Delete</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

/* ---------- ACTIONS ---------- */

function completeSub(i){
    subjects[i].progress = 100;
    addActivity(`Completed ${subjects[i].name}`);
    save();
}

function reviseSub(i){
    subjects[i].progress = 50;
    addActivity(`Revised ${subjects[i].name}`);
    save();
}

function deleteSub(i){
    addActivity(`Deleted ${subjects[i].name}`);
    subjects.splice(i,1);
    save();
}

/* ---------- SAVE + SYNC ---------- */

function save(){
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("activities", JSON.stringify(activities));
    renderSubjects();
    syncDashboard();
}

/* ---------- ACTIVITY ---------- */

function addActivity(text){
    activities.unshift(text);
    if(activities.length>5) activities.pop();
}

/* ---------- DASHBOARD SYNC ---------- */

function syncDashboard(){

    const total = subjects.length;
    const completed = subjects.filter(s=>s.progress===100).length;
    const pending = total - completed;

    const overall = total===0 ? 0 :
        Math.round(subjects.reduce((a,b)=>a+b.progress,0)/total);

    const stats = {
        total,
        completed,
        pending,
        overall
    };

    localStorage.setItem("stats", JSON.stringify(stats));
}

/* ---------- COUNTDOWN ---------- */

function countdown(date){

    if(!date) return "";

    const today = new Date();
    const exam = new Date(date);

    const diff = Math.ceil((exam - today)/(1000*60*60*24));

    if(diff>0) return `⏳ ${diff} days left`;
    if(diff===0) return "⚡ Exam Today";
    return "✅ Completed";
}
