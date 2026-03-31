const form = document.getElementById("examForm");
const grid = document.getElementById("subjectsGrid");
const searchBox = document.getElementById("searchBox");

let subjects = [];
let activities = [];

let streak = 0;
let lastActiveDate = null;

// Load from backend
fetch('http://localhost:3000/data')
    .then(res => res.json())
    .then(data => {
        streak = data.streak || 0;
        lastActiveDate = data.lastActiveDate || null;

        document.getElementById("streakCount").textContent = streak;
    });


// Load from backend
fetch('http://localhost:3000/data')
    .then(res => res.json())
    .then(data => {
        subjects = data.subjects || [];
        activities = data.activities || [];
        renderSubjects();
    });

renderSubjects();


form.addEventListener("submit", function (e) {
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
    showToast("Subject Added ✅");
    save();
    form.reset();
});

searchBox.addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = subjects.filter(sub =>
        sub.name.toLowerCase().includes(value)
    );

    renderFiltered(filtered);
});

function renderSubjects() {

    grid.innerHTML = "";

    subjects.forEach((sub, index) => {

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

function completeSub(i) {
    subjects[i].progress = 100;
    addActivity(`Completed ${subjects[i].name}`);
    showToast("Marked as Done 🎉");
    updateStreak();
    save();
}

function reviseSub(i) {
    subjects[i].progress = 50;
    addActivity(`Revised ${subjects[i].name}`);
    showToast("Revision Updated 🔁");
    updateStreak();
    save();
}

function deleteSub(i) {
    addActivity(`Deleted ${subjects[i].name}`);
    showToast("Deleted ❌");
    subjects.splice(i, 1);
    save();
}

/* ---------- SAVE + SYNC ---------- */

function save() {

    const total = subjects.length;
    const completed = subjects.filter(s => s.progress === 100).length;
    const pending = total - completed;

    const overall = total === 0 ? 0 :
        Math.round(subjects.reduce((a, b) => a + b.progress, 0) / total);

    const stats = { total, completed, pending, overall };

    // FIRST get existing data
    fetch('http://localhost:3000/data')
        .then(res => res.json())
        .then(data => {

            fetch('http://localhost:3000/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subjects,
                    activities,
                    bookmarks: data.bookmarks || [],
                    uploads: data.uploads || [],
                    stats,
                    streak,
                    lastActiveDate
                })
            });

        });

    renderSubjects();
}

/* ---------- ACTIVITY ---------- */

function addActivity(text) {
    activities.unshift(text);
    if (activities.length > 5) activities.pop();
}

/* ---------- DASHBOARD SYNC ---------- */

function syncDashboard() {

    const total = subjects.length;
    const completed = subjects.filter(s => s.progress === 100).length;
    const pending = total - completed;

    const overall = total === 0 ? 0 :
        Math.round(subjects.reduce((a, b) => a + b.progress, 0) / total);

    const stats = {
        total,
        completed,
        pending,
        overall
    };

    localStorage.setItem("stats", JSON.stringify(stats));
}

/* ---------- COUNTDOWN ---------- */

function countdown(date) {

    if (!date) return "";

    const today = new Date();
    const exam = new Date(date);

    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

    if (diff > 0) return `⏳ ${diff} days left`;
    if (diff === 0) return "⚡ Exam Today";
    return "✅ Completed";
}

/* ---------- SEARCH AND FILTER ---------- */
function renderFiltered(list) {

    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = "<p class='empty-state'>No subjects found 🔍</p>";
        return;
    }

    list.forEach((sub) => {

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
                <button class="complete-btn" onclick="completeSub(${subjects.indexOf(sub)})">Done</button>
                <button class="revise-btn" onclick="reviseSub(${subjects.indexOf(sub)})">Revise</button>
                <button class="delete-btn" onclick="deleteSub(${subjects.indexOf(sub)})">Delete</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function clearSearch() {
    searchBox.value = "";
    renderSubjects();
}

// STREAK



function updateStreak() {

    const today = new Date().toDateString();

    // First time
    if (!lastActiveDate) {
        streak = 1;
    }
    else {
        const last = new Date(lastActiveDate);
        const now = new Date(today);

        const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
            streak++;
            showStreakPopup(); // 🔥 ADD THIS
        }
        else if (diff > 1) {
            streak = 1; // streak broken
        }
        // if same day → no increment
    }

    lastActiveDate = today;

    document.getElementById("streakCount").textContent = streak;
    const el = document.getElementById("streakCount");

    if (streak >= 7) {
        el.classList.add("golden");
    }
    else {
        el.classList.remove("golden");
    }
    if (streak === 7) {
        showConfetti();
    }
    animateStreak();

}


    function animateStreak() {

        const el = document.getElementById("streakCount");

        el.classList.add("streak-animate");

        setTimeout(() => {
            el.classList.remove("streak-animate");
        }, 600);
    }

    function showStreakPopup() {

        const pop = document.createElement("div");
        pop.className = "streak-popup";
        pop.textContent = "+1 🔥";

        document.body.appendChild(pop);

        setTimeout(() => pop.remove(), 1500);
    }

    function showConfetti() {

        for (let i = 0; i < 20; i++) {

            const c = document.createElement("div");
            c.className = "confetti";

            c.style.left = Math.random() * 100 + "vw";
            c.style.animationDuration = (Math.random() * 2 + 2) + "s";

            document.body.appendChild(c);

            setTimeout(() => c.remove(), 3000);
        }
    }


    function demoNormal() {
        streak = 3;
        document.getElementById("streakCount").textContent = streak;
        document.getElementById("streakCount").classList.remove("golden");
    }

    function demoGolden() {
        streak = 10;
        document.getElementById("streakCount").textContent = streak;
        document.getElementById("streakCount").classList.add("golden");
        showConfetti();
    }


    function showToast(msg) {
        const t = document.createElement("div");
        t.className = "toast";
        t.textContent = msg;
        document.body.appendChild(t);

        setTimeout(() => t.remove(), 2000);
    }