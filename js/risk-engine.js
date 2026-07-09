// =====================================
// NeuroGuard v2 - Personalized Risk Engine
// Works on a HEALTH SCORE (0-10)
// Higher score = healthier
// =====================================

export function calculateFinalRisk(baseScore, healthData) {

    let deduction = 0;

    if (healthData.hypertension) deduction += 0.30;
if (healthData.diabetes) deduction += 0.30;
if (healthData.previousStroke) deduction += 1.00;
if (healthData.heartDisease) deduction += 0.40;
if (healthData.atrialFibrillation) deduction += 0.60;
if (healthData.highCholesterol) deduction += 0.20;
if (healthData.kidneyDisease) deduction += 0.25;
if (healthData.obesity) deduction += 0.15;
if (healthData.smoker) deduction += 0.20;
if (healthData.alcohol) deduction += 0.10;
if (healthData.familyHistory) deduction += 0.20;
    deduction = Math.min(deduction, 2.0);

    // ----------------------------
    // Reduce effect when AI thinks
    // the person is healthy
    // ----------------------------

    let multiplier;

    if (baseScore >= 8)
    multiplier = 0.25;
else if (baseScore >= 6)
    multiplier = 0.60;
else if (baseScore >= 4)
    multiplier = 0.85;
else
    multiplier = 1.00;

    let finalScore = baseScore - (deduction * multiplier);

    finalScore = Math.max(0, Math.min(10, finalScore));

    return Number(finalScore.toFixed(1));
}
