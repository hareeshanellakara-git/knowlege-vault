


fetch('https://knowledge-vault-backend-u9t7.onrender.com/data')
    .then(res => res.json())
    .then(data => {

        const subjects = data.subjects || [];
        const stats = data.stats || {};
        const activities = data.activities || [];


        /* ---------- STREAK ---------- */


        const streak = data.streak || 0;

        const streakEl = document.getElementById("streakCount");
        if (streakEl) {
            streakEl.textContent = streak;

            if (streak >= 7) {
                streakEl.classList.add("golden");
            }
            else {
                streakEl.classList.remove("golden");
            }
        }

        /* ---------- STATS ---------- */

        document.getElementById("totalSubjects").textContent = stats.total || 0;
        document.getElementById("completedSubjects").textContent = stats.completed || 0;
        document.getElementById("pendingSubjects").textContent = stats.pending || 0;

        /* ---------- OVERALL BAR ---------- */

        const overall = stats.overall || 0;

        document.getElementById("overallBar").style.width = overall + "%";
        document.getElementById("overallText").textContent = overall + "% syllabus completed";

        /* ---------- TODAY FOCUS ---------- */

        if (subjects.length > 0) {
            const sorted = [...subjects].sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
            const focus = sorted[0];

            document.getElementById("todayFocus").textContent = focus.name;
            document.getElementById("focusPriority").textContent = focus.priority;
        }

        /* ---------- UPCOMING ---------- */

        const upcomingList = document.getElementById("upcomingList");

        subjects
            .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
            .slice(0, 5)
            .forEach(sub => {
                const li = document.createElement("li");
                li.innerHTML = `${sub.name} <span class="date">${sub.examDate}</span>`;
                upcomingList.appendChild(li);
            });

        /* ---------- ACTIVITY ---------- */

        const actList = document.getElementById("activityList");

        activities.forEach(act => {
            const li = document.createElement("li");
            li.textContent = act;
            actList.appendChild(li);
        });

    });



