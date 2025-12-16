const API_URL = "https://script.google.com/macros/s/AKfycbzUUplwbq7Zu3Q--OISPOqLrTSZ4TAdaTs5VL2k8UoH1DCvYSAtgioFF3-qn4YaPu40/exec"; // حط رابط الـ Web App النهائي هنا

let models = [];
let editRowIndex = null;

// تحميل البيانات عند فتح الصفحة
window.onload = async () => {
    try {
        const res = await fetch(API_URL);
        const text = await res.text();
        models = text ? text.split("\n").map(r => r.split("|")) : [];
        renderTable();
    } catch (err) {
        alert("Error loading data: " + err.message);
    }
};

// عرض البيانات في الجدول
function renderTable() {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    models.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row[0] || ""}</td>
            <td>${row[3] || ""}</td>
            <td>${row[4] || ""}</td>
            <td>${row[7] || ""}</td>
            <td>${row[8] || ""}</td>
        `;
        tr.onclick = () => openDetails(index);
        tbody.appendChild(tr);
    });
}

// فتح التفاصيل في الفورم
function openDetails(index) {
    const row = models[index];
    editRowIndex = index + 1; // رقم الصف في Google Sheet
    fillForm(row);
    document.getElementById("formModal").style.display = "block";
}

// ملء الفورم
function fillForm(row) {
    const ids = ["modelName", "brand", "supplier", "openCell", "tcon", "pcb", "led", "swVersion", "status",
        "sqa", "sqa2", "pq", "pq2", "ass", "ass2", "mech", "mech2", "blu", "blu2"];
    ids.forEach((id, i) => {
        document.getElementById(id).value = row[i] || "";
    });
}

// فورم فاضي عند الضغط على Add
document.getElementById("add").onclick = () => {
    document.getElementById("dataForm").reset();
    editRowIndex = null;
    document.getElementById("formModal").style.display = "block";
};

// حفظ البيانات (POST)
document.getElementById("dataForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {};
    const ids = ["modelName", "brand", "supplier", "openCell", "tcon", "pcb", "led", "swVersion", "status",
        "sqa", "sqa2", "pq", "pq2", "ass", "ass2", "mech", "mech2", "blu", "blu2"];
    ids.forEach(id => payload[id] = document.getElementById(id).value || "");

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        if (text === "SUCCESS") {
            alert("Data saved successfully!");
            location.reload();
        } else {
            alert("Error saving data: " + text);
        }
    } catch (err) {
        alert("Network error. Please check your internet or deployment: " + err.message);
    }
});
