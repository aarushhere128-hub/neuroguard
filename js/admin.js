import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const tableBody = document.getElementById("tableBody");

async function loadAssessments() {

    tableBody.innerHTML = "";

    const q = query(
        collection(db, "assessments"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {

        const data = doc.data();

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

}

loadAssessments();
