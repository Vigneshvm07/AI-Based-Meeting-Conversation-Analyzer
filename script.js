const transcript = document.getElementById("transcript");
const wordCount = document.getElementById("wordCount");

transcript.addEventListener("input", countWords);

function countWords() {
    const text = transcript.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCount.textContent = `${words} words`;
}

function scrollToAnalyzer() {
    document.getElementById("analyzer").scrollIntoView({
        behavior: "smooth"
    });
}

function loadDemo() {
    transcript.value = `Sarah: Good morning everyone. Let's discuss the project deadline and current progress.

John: Good morning. I think we can complete the development by Friday if we finish the remaining modules today.

Sarah: Great. Please make sure the testing is completed before deployment.

Mike: I agree. I will prepare the testing report and share it tomorrow.

John: There is one issue with the payment module, but I believe we can resolve it today.

Sarah: Thank you. Please keep everyone updated about the progress.

Mike: I will also prepare the final documentation before the next review.

Sarah: Perfect. Let's schedule another review meeting next week and discuss the final results.`;

    countWords();
    scrollToAnalyzer();
}

function getSentiment(text) {
    const positive = [
        "good", "great", "excellent", "happy", "agree",
        "perfect", "thank", "thanks", "helpful", "success",
        "resolved", "solution", "appreciate", "progress",
        "complete", "completed"
    ];

    const negative = [
        "bad", "angry", "problem", "issue", "delay",
        "failed", "failure", "difficult", "disappointed",
        "worst", "frustrated", "complaint", "risk"
    ];

    const words = text.toLowerCase().split(/\W+/);

    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
        if (positive.includes(word)) positiveCount++;
        if (negative.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount + 2) {
        return {
            name: "Positive",
            score: Math.min(96, 70 + positiveCount * 4)
        };
    }

    if (negativeCount > positiveCount) {
        return {
            name: "Negative",
            score: Math.max(42, 68 - negativeCount * 5)
        };
    }

    return {
        name: "Neutral",
        score: 70
    };
}

function getParticipation(text) {
    const speakerMatches = text.match(/(?:^|\n)\s*[A-Za-z][A-Za-z0-9 _-]{1,25}:/g) || [];
    const speakers = new Set(
        speakerMatches.map(item =>
            item.replace(/\n/g, "")
                .trim()
                .replace(/:$/, "")
                .toLowerCase()
        )
    );

    const speakerCount = speakers.size;
    const lines = text.split(/\n+/).filter(line => line.trim());

    if (speakerCount >= 4) return 94;
    if (speakerCount === 3) return 88;
    if (speakerCount === 2) return 76;
    if (lines.length >= 5) return 68;

    return 55;
}

function getCommunication(text) {
    const professionalWords = [
        "please", "thank", "thanks", "agree", "sorry",
        "appreciate", "understand", "certainly", "help",
        "support", "discuss", "update", "share", "prepare"
    ];

    const words = text.toLowerCase().split(/\W+/);
    let count = 0;

    words.forEach(word => {
        if (professionalWords.includes(word)) count++;
    });

    return Math.min(97, 65 + count * 3);
}

function getEngagement(text) {
    const engagementWords = [
        "discuss", "agree", "think", "believe", "suggest",
        "will", "prepare", "share", "update", "schedule",
        "review", "complete", "let's", "progress"
    ];

    const lower = text.toLowerCase();
    let count = 0;

    engagementWords.forEach(word => {
        if (lower.includes(word)) count++;
    });

    return Math.min(96, 60 + count * 3);
}

function getOverall(sentiment, participation, communication, engagement) {
    return Math.round(
        sentiment * 0.25 +
        participation * 0.25 +
        communication * 0.25 +
        engagement * 0.25
    );
}

function analyzeMeeting() {
    const text = transcript.value.trim();

    if (!text) {
        alert("Please enter a meeting transcript first.");
        return;
    }

    const sentiment = getSentiment(text);
    const participation = getParticipation(text);
    const communication = getCommunication(text);
    const engagement = getEngagement(text);

    const overall = getOverall(
        sentiment.score,
        participation,
        communication,
        engagement
    );

    document.getElementById("overallScore").textContent = overall;
    document.getElementById("sentimentValue").textContent = sentiment.name;
    document.getElementById("participationValue").textContent = participation + "%";
    document.getElementById("communicationValue").textContent = communication + "%";
    document.getElementById("engagementValue").textContent = engagement + "%";

    const ring = document.getElementById("scoreRing");
    ring.style.background =
        `conic-gradient(var(--primary) ${overall * 3.6}deg, #eceaf4 ${overall * 3.6}deg)`;

    const status = document.getElementById("statusPill");
    const title = document.getElementById("qualityTitle");
    const description = document.getElementById("qualityText");

    if (overall >= 90) {
        status.textContent = "Excellent";
        title.textContent = "Excellent Meeting";
        description.textContent =
            "The conversation shows strong communication, engagement, and positive interaction.";
    } else if (overall >= 80) {
        status.textContent = "Good";
        title.textContent = "Good Meeting";
        description.textContent =
            "The meeting demonstrates effective communication with useful collaboration.";
    } else if (overall >= 65) {
        status.textContent = "Needs Improvement";
        title.textContent = "Meeting Needs Improvement";
        description.textContent =
            "Some communication and engagement areas could be improved.";
    } else {
        status.textContent = "Review";
        title.textContent = "Requires Review";
        description.textContent =
            "The conversation contains patterns that may require additional attention.";
    }
}

let qualityChart;
let sentimentChart;

function createCharts() {
    const qualityCanvas = document.getElementById("qualityChart");

    qualityChart = new Chart(qualityCanvas, {
        type: "line",
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
            datasets: [{
                label: "Meeting Score",
                data: [72, 76, 78, 83, 81, 88],
                borderColor: "#6956e8",
                backgroundColor: "rgba(105, 86, 232, 0.08)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 50,
                    max: 100
                }
            }
        }
    });

    const sentimentCanvas = document.getElementById("sentimentChart");

    sentimentChart = new Chart(sentimentCanvas, {
        type: "doughnut",
        data: {
            labels: ["Positive", "Neutral", "Negative"],
            datasets: [{
                data: [68, 23, 9],
                backgroundColor: [
                    "#00b894",
                    "#6956e8",
                    "#f39c42"
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", createCharts);