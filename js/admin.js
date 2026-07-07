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
            <tr>
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
        `;

        tableBody.innerHTML += row;

    });
    document.getElementById("totalAssessments").textContent = total;
document.getElementById("highRisk").textContent = high;
document.getElementById("moderateRisk").textContent = moderate;
document.getElementById("lowRisk").textContent = low;

}

loadAssessments();
