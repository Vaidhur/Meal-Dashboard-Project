const initialCenters = [
    {
        id: 1,
        name: "Central Community Kitchen",
        location: "City Center, Block A",
        needed: 400,
        stock: 320,
        volunteer: "Arjun Kumar",
        status: "In progress"
    },
    {
        id: 2,
        name: "Sunrise Shelter",
        location: "Green Park, Sector 4",
        needed: 250,
        stock: 250,
        volunteer: "Riya Sharma",
        status: "Completed"
    },
    {
        id: 3,
        name: "Green Park Center",
        location: "Green Park, Lane 2",
        needed: 300,
        stock: 180,
        volunteer: "Mohit Patel",
        status: "Pending"
    },
    {
        id: 4,
        name: "Riverside Food Point",
        location: "Riverside Road",
        needed: 200,
        stock: 90,
        volunteer: "Neha Singh",
        status: "Pending"
    }
];

let centers = [...initialCenters];
let nextId = 5;

let prepared = 1240;
let distributed = 860;
let totalSupply = 1540;

let schedules = [
    {
        time: "09:00 AM",
        title: "Prepare and pack meals",
        sub: "Central Community Kitchen - 400 meals",
        status: "Completed"
    },
    {
        time: "11:30 AM",
        title: "Sunrise Shelter delivery",
        sub: "Riya Sharma - 250 meals",
        status: "In progress"
    },
    {
        time: "01:00 PM",
        title: "Green Park distribution",
        sub: "Mohit Patel - 300 meals",
        status: "Upcoming"
    },
    {
        time: "03:30 PM",
        title: "Riverside food drop",
        sub: "Neha Singh - 200 meals",
        status: "Upcoming"
    }
];

function getElement(id) {
    return document.getElementById(id);
}

function formatNumber(value) {
    return value.toLocaleString("en-IN");
}

function escapeHTML(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value).replace(/[&<>"']/g, function (character) {
        return characters[character];
    });
}

function getStockStatus(center) {
    if (center.stock >= center.needed) {
        return "Sufficient";
    }

    if (center.stock > 0) {
        return "Low stock";
    }

    return "Out of stock";
}

function getStatusClass(status) {
    if (status === "Completed") {
        return "done";
    }

    if (status === "In progress") {
        return "progress";
    }

    return "pending";
}

function renderCenters() {
    const tableBody = getElement("centersBody");

    tableBody.innerHTML = centers.map(function (center) {
        const stockStatus = getStockStatus(center);
        const stockClass = stockStatus === "Sufficient"
            ? "stock-ok"
            : "stock-low";

        return `
            <tr>
                <td>
                    <div class="center-cell">
                        <div class="center-symbol">⌖</div>

                        <div>
                            <div class="center-name">
                                ${escapeHTML(center.name)}
                            </div>

                            <div class="center-location">
                                ${escapeHTML(center.location)}
                            </div>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="meal-number">
                        ${formatNumber(center.needed)}
                    </span>
                </td>

                <td>
                    <span class="stock-tag ${stockClass}">
                        ${stockStatus}
                    </span>
                </td>

                <td>
                    <span class="volunteer-name">
                        ${escapeHTML(center.volunteer)}
                    </span>
                </td>

                <td>
                    <button
                        class="status-tag status-${getStatusClass(center.status)}"
                        data-id="${center.id}"
                        title="Click to update status">
                        ${escapeHTML(center.status)}
                    </button>
                </td>

                <td>
                    <button
                        class="row-menu"
                        data-delete="${center.id}"
                        title="Remove center">
                        •••
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    getElement("emptyCenters").classList.toggle(
        "hidden",
        centers.length > 0
    );

    getElement("centerCount").textContent = centers.length;
    getElement("mealsPrepared").textContent = formatNumber(prepared);
    getElement("mealsDistributed").textContent = formatNumber(distributed);

    getElement("availableMeals").innerHTML =
        `${formatNumber(totalSupply)} <small>meals</small>`;

    const readyMeals = centers.reduce(function (total, center) {
        return total + Math.min(center.stock, center.needed);
    }, 0);

    const restockMeals = Math.max(0, totalSupply - readyMeals);

    getElement("readyMeals").textContent = formatNumber(readyMeals);
    getElement("restockMeals").textContent = formatNumber(restockMeals);

    const supplyTotal = Math.max(totalSupply, 1);

    getElement("readyBar").style.width =
        Math.min(100, readyMeals / supplyTotal * 100) + "%";

    getElement("restockBar").style.width =
        Math.min(100, restockMeals / supplyTotal * 100) + "%";

    const progress = Math.min(
        100,
        Math.round(distributed / Math.max(prepared, 1) * 100)
    );

    getElement("distributionProgress").style.width = progress + "%";
    getElement("progressText").textContent = progress + "%";
}

function renderSchedule() {
    const scheduleList = getElement("scheduleList");

    scheduleList.innerHTML = schedules.map(function (task, index) {
        let statusClass = "waiting";

        if (task.status === "Completed") {
            statusClass = "completed";
        } else if (task.status === "In progress") {
            statusClass = "progress";
        }

        return `
            <div class="schedule-item">
                <div class="schedule-time">
                    ${escapeHTML(task.time)}
                </div>

                <div class="timeline">
                    <span class="timeline-dot"></span>
                </div>

                <div>
                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-sub">
                        ${escapeHTML(task.sub)}
                    </div>
                </div>

                <button
                    class="task-status ${statusClass}"
                    data-task="${index}">
                    ${escapeHTML(task.status)}
                </button>
            </div>
        `;
    }).join("");
}

function showMessage(message) {
    const notification = getElement("toast");

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(showMessage.timer);

    showMessage.timer = setTimeout(function () {
        notification.classList.remove("show");
    }, 2600);
}

function openModal() {
    getElement("centerModal").classList.remove("hidden");
    getElement("centerForm").elements.name.focus();
}

function closeModal() {
    getElement("centerModal").classList.add("hidden");
    getElement("centerForm").reset();
}

getElement("todayLabel").textContent =
    new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date());

renderCenters();
renderSchedule();

getElement("openModal").addEventListener("click", openModal);
getElement("closeModal").addEventListener("click", closeModal);
getElement("cancelModal").addEventListener("click", closeModal);

getElement("centerModal").addEventListener("click", function (event) {
    if (event.target === getElement("centerModal")) {
        closeModal();
    }
});


document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

getElement("centerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const center = {
        id: nextId++,
        name: formData.get("name").trim(),
        location: formData.get("location").trim(),
        needed: Number(formData.get("needed")),
        stock: Number(formData.get("stock")),
        volunteer: formData.get("volunteer"),
        status: "Pending"
    };

    centers.push(center);

    prepared += center.needed;
    totalSupply += center.stock;

    renderCenters();
    closeModal();

    showMessage("Distribution center added successfully.");
});

getElement("centersBody").addEventListener("click", function (event) {
    const statusButton = event.target.closest("[data-id]");
    const deleteButton = event.target.closest("[data-delete]");

    if (statusButton) {
        const centerId = Number(statusButton.dataset.id);

        const center = centers.find(function (item) {
            return item.id === centerId;
        });

        if (!center) {
            return;
        }

        if (center.status === "Pending") {
            center.status = "In progress";
        } else if (center.status === "In progress") {
            center.status = "Completed";
            distributed += center.needed;

            showMessage(center.name + " marked completed.");
        } else {
            center.status = "Pending";
        }

        renderCenters();
    }

    if (deleteButton) {
        const centerId = Number(deleteButton.dataset.delete);

        const center = centers.find(function (item) {
            return item.id === centerId;
        });

        if (!center) {
            return;
        }

        const confirmed = confirm(
            'Remove "' + center.name + '" from distribution centers?'
        );

        if (confirmed) {
            centers = centers.filter(function (item) {
                return item.id !== centerId;
            });

            totalSupply = Math.max(0, totalSupply - center.stock);

            renderCenters();
            showMessage("Distribution center removed.");
        }
    }
});

getElement("viewAllCenters").addEventListener("click", function () {
    getElement("centers").scrollIntoView({
        behavior: "smooth"
    });

    showMessage(centers.length + " distribution center(s) listed.");
});

getElement("updateSupply").addEventListener("click", function () {
    const answer = prompt(
        "How many meals should be added to the available food supply?"
    );

    if (answer === null || answer.trim() === "") {
        return;
    }

    const amount = Number(answer);

    if (!Number.isInteger(amount) || amount < 0 || amount > 100000) {
        showMessage("Enter a whole number from 0 to 100000.");
        return;
    }

    totalSupply += amount;
    prepared += amount;

    renderCenters();

    showMessage(formatNumber(amount) + " meals added to supplies.");
});

getElement("addSchedule").addEventListener("click", function () {
    const title = prompt("Enter the distribution task name:");

    if (!title || !title.trim()) {
        return;
    }

    const time = prompt(
        "Enter the task time, for example 04:30 PM:",
        "04:30 PM"
    );

    if (!time || !time.trim()) {
        return;
    }

    schedules.push({
        time: time.trim(),
        title: title.trim(),
        sub: "New distribution task - Volunteer to be assigned",
        status: "Upcoming"
    });

    renderSchedule();
    showMessage("New schedule task added.");
});

getElement("scheduleList").addEventListener("click", function (event) {
    const button = event.target.closest("[data-task]");

    if (!button) {
        return;
    }

    const task = schedules[Number(button.dataset.task)];

    if (!task) {
        return;
    }

    if (task.status === "Upcoming") {
        task.status = "In progress";
    } else if (task.status === "In progress") {
        task.status = "Completed";
    } else {
        task.status = "Upcoming";
    }

    renderSchedule();
    showMessage("Schedule status updated.");
});

getElement("menuToggle").addEventListener("click", function () {
    getElement("sidebar").classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
        document.querySelectorAll(".nav-link").forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
        getElement("sidebar").classList.remove("open");
    });
});
