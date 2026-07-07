import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const tableBody = document.getElementById("tableBody");

async function loadAssessments() {
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
<tr class="summary-row">

    <td>${data.name}</td>
    <td>${data.age}</td>
    <td>${data.gender}</td>
    <td>${data.faceScore}</td>
    <td>${data.armScore}</td>
    <td>${data.speechScore}</td>
    <td>${data.overallScore}</td>
    <td>${data.risk}</td>
    <td>${data.createdAt?.toDate().toLocaleString() || "-"}</td>

</tr>

<tr class="details-row" style="display:none;">

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

summaryRows.forEach((summaryRow) => {

    summaryRow.onclick = () => {

        const detailsRow = summaryRow.nextElementSibling;

        if (detailsRow.style.display === "none") {
            detailsRow.style.display = "table-row";
        } else {
            detailsRow.style.display = "none";
        }

    };

});

    });
    document.getElementById("totalAssessments").textContent = total;
document.getElementById("highRisk").textContent = high;
document.getElementById("moderateRisk").textContent = moderate;
document.getElementById("lowRisk").textContent = low;

}

loadAssessments();
