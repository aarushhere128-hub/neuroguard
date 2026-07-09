import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const tableBody = document.getElementById("tableBody");

async function loadAssessments() {
    let currentFilter = "all";
    let total = 0;
let high = 0;
let moderate = 0;
let low = 0;
    tableBody.innerHTML = "";

    const q = query(
        collection(db, "assessments"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {

        const data = doc.data();
        total++;

if (data.risk.includes("High"))
    high++;

else if (data.risk.includes("Moderate"))
    moderate++;

else if (data.risk.includes("Low"))
    low++;

       const row = `
<tr class="summary-row" data-risk="${data.risk}">

    <td>${data.name}</td>
    <td>${data.age}</td>
    <td>${data.gender}</td>
    <td>${data.faceScore}</td>
    <td>${data.armScore}</td>
    <td>${data.speechScore}</td>
    <td>${data.overallScore}</td>
    <td>${data.risk}</td>
    <td>${data.createdAt?.toDate().toLocaleString() || "-"}</td>
    <td class="expand-arrow">▶</td>

</tr>

<tr class="details-row" data-risk="${data.risk}" style="display:none;">

    <td colspan="9">

        <h3>Patient Details</h3>

        <p><strong>Email:</strong> ${data.email}</p>

        <p><strong>Recommendation:</strong> ${data.recommendation}</p>

        <p><strong>Symptom Time:</strong> ${data.symptomTime}</p>

    </td>

</tr>
`;

        tableBody.innerHTML += row;
        const summaryRows = document.querySelectorAll(".summary-row");

let openedRow = null;

summaryRows.forEach((summaryRow) => {

    summaryRow.onclick = () => {

        const detailsRow = summaryRow.nextElementSibling;
        const arrow = summaryRow.querySelector(".expand-arrow");

        // Close previously opened row
        if (openedRow && openedRow !== detailsRow) {

            openedRow.style.display = "none";

            openedRow.previousElementSibling
                .querySelector(".expand-arrow")
                .textContent = "▶";
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

    };

});

    });
    document.getElementById("totalAssessments").textContent = total;
document.getElementById("highRisk").textContent = high;
    function filterAssessments(risk, activeCard) {
        currentFilter = risk;
        document.querySelectorAll(".card").forEach(card=>{
    card.classList.remove("active");
});
        activeCard.classList.add("active");

    const summaryRows = document.querySelectorAll(".summary-row");

    summaryRows.forEach((summaryRow) => {

        const detailsRow = summaryRow.nextElementSibling;

        const rowRisk = summaryRow.dataset.risk;

        const show =
            risk === "all" || rowRisk === risk;

        summaryRow.style.display = show ? "table-row" : "none";
        detailsRow.style.display = "none";

        summaryRow.querySelector(".expand-arrow").textContent = "▶";

    });

}
document.getElementById("moderateRisk").textContent = moderate;
document.getElementById("lowRisk").textContent = low;
document.getElementById("totalCard").onclick = () => {



    filterAssessments("all", document.getElementById("totalCard"));

};
 

document.getElementById("lowCard").onclick = () => {



    filterAssessments("🟢 Low Risk", document.getElementById("lowCard"));

};

document.getElementById("moderateCard").onclick = () => {



    filterAssessments("🟡 Moderate Risk", document.getElementById("moderateCard"));

};

document.getElementById("highCard").onclick = () => {



    filterAssessments("🔴 High Risk", document.getElementById("highCard"));

};
}
async function loadUsers() {

    alert("loadUsers started");

    const usersBody = document.getElementById("usersBody");
    usersBody.innerHTML = "";

    const snapshot = await getDocs(collection(db, "users"));

    alert("Users found: " + snapshot.size);

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
}
loadAssessments();
loadUsers();
