import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists() || userDoc.data().role !== "admin") {

        alert("Access Denied. Admins only.");

        window.location.href = "index.html";

        return;
    }

    // User is an admin
    loadAssessments();
    loadUsers();

});

const tableBody = document.getElementById("tableBody");

async function loadAssessments() {
    const totalEl = document.getElementById("totalAssessments");
    const highEl = document.getElementById("highRisk");
    const moderateEl = document.getElementById("moderateRisk");
    const lowEl = document.getElementById("lowRisk");

    let openedRow = null;

    // Expand/collapse assessment details.
    // Add this listener only once, outside the snapshot loop.
    tableBody.addEventListener("click", (event) => {
        const summaryRow = event.target.closest(".summary-row");

        if (!summaryRow) return;

        const detailsRow = summaryRow.nextElementSibling;
        const arrow = summaryRow.querySelector(".expand-arrow");

        if (openedRow && openedRow !== detailsRow) {
            openedRow.style.display = "none";

            const previousArrow = openedRow.previousElementSibling
                ?.querySelector(".expand-arrow");

            if (previousArrow) previousArrow.textContent = "▶";
        }

        if (detailsRow.style.display === "none") {
            detailsRow.style.display = "table-row";
            arrow.textContent = "▼";
            openedRow = detailsRow;
        } else {
            detailsRow.style.display = "none";
            arrow.textContent = "▶";
            openedRow = null;
        }
    });

    function filterAssessments(risk, activeCard) {
        document.querySelectorAll(".card").forEach((card) => {
            card.classList.remove("active");
        });

        activeCard.classList.add("active");

        // Close any expanded details when changing filters.
        openedRow = null;

        document.querySelectorAll(".summary-row").forEach((row) => {
            const detailsRow = row.nextElementSibling;
            const label = row.dataset.risk || "";

            const show =
                risk === "all" ||
                (risk === "low" && label.includes("Low Concern")) ||
                (risk === "moderate" &&
                    label.includes("Neurological Signs Detected")) ||
                (risk === "high" &&
                    label.includes("Urgent Neurological Signs"));

            row.style.display = show ? "table-row" : "none";
            detailsRow.style.display = "none";

            const arrow = row.querySelector(".expand-arrow");
            if (arrow) arrow.textContent = "▶";
        });
    }

    // Connect the cards once, not every time Firestore updates.
    document.getElementById("totalCard").onclick = () =>
        filterAssessments("all", document.getElementById("totalCard"));

    document.getElementById("lowCard").onclick = () =>
        filterAssessments("low", document.getElementById("lowCard"));

    document.getElementById("moderateCard").onclick = () =>
        filterAssessments("moderate", document.getElementById("moderateCard"));

    document.getElementById("highCard").onclick = () =>
        filterAssessments("high", document.getElementById("highCard"));

    const q = query(
        collection(db, "assessments"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(
        q,
        (snapshot) => {
            tableBody.innerHTML = "";
            openedRow = null;

            let total = 0;
            let high = 0;
            let moderate = 0;
            let low = 0;

            snapshot.forEach((assessmentDoc) => {
                const data = assessmentDoc.data();
                const risk = data.risk || "";

                total++;

                if (risk.includes("Urgent Neurological Signs")) {
                    high++;
                } else if (risk.includes("Neurological Signs Detected")) {
                    moderate++;
                } else if (risk.includes("Low Concern")) {
                    low++;
                }

                const createdAt = data.createdAt?.toDate
                    ? data.createdAt.toDate().toLocaleString()
                    : "-";

                tableBody.innerHTML += `
                    <tr class="summary-row" data-risk="${risk}">
                        <td>${data.name ?? "-"}</td>
                        <td>${data.age ?? "-"}</td>
                        <td>${data.gender ?? "-"}</td>
                        <td>${data.faceScore ?? "-"}</td>
                        <td>${data.armScore ?? "-"}</td>
                        <td>${data.speechScore ?? "-"}</td>
                        <td>${data.overallScore ?? "-"}</td>
                        <td>${risk || "-"}</td>
                        <td>${createdAt}</td>
                        <td class="expand-arrow">▶</td>
                    </tr>

                    <tr class="details-row" style="display:none;">
                        <td colspan="10">
                            <h3>Patient Details</h3>
                            <p><strong>Email:</strong> ${data.email ?? "-"}</p>
                            <p><strong>Recommendation:</strong>
                                ${data.recommendation ?? "-"}</p>
                            <p><strong>Symptom Time:</strong>
                                ${data.symptomTime ?? "-"}</p>
                        </td>
                    </tr>
                `;
            });

            totalEl.textContent = total;
            highEl.textContent = high;
            moderateEl.textContent = moderate;
            lowEl.textContent = low;
        },
        (error) => {
            console.error("Error loading assessments:", error);
        }
    );
}
function loadUsers() {


    const usersBody = document.getElementById("usersBody");
    usersBody.innerHTML = "";

    onSnapshot(collection(db, "users"), (snapshot) => {

    usersBody.innerHTML = "";

    document.getElementById("totalUsers").textContent = snapshot.size;

    snapshot.forEach((doc) => {
        const user = doc.data();

        usersBody.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.age}</td>
                <td>${user.gender}</td>
            </tr>
        `;
    });
         });
}

const assessmentTab = document.getElementById("assessmentTab");
const usersTab = document.getElementById("usersTab");

const assessmentSection = document.getElementById("assessmentSection");
const usersSection = document.getElementById("usersSection");

assessmentTab.addEventListener("click", () => {

    assessmentSection.style.display = "block";
    usersSection.style.display = "none";

    assessmentTab.classList.add("active");
    usersTab.classList.remove("active");

});

usersTab.addEventListener("click", () => {

    assessmentSection.style.display = "none";
    usersSection.style.display = "block";

    usersTab.classList.add("active");
    assessmentTab.classList.remove("active");

});
