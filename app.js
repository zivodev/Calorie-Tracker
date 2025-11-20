// Extracted JavaScript

function calculateCalories() {
    let gender = document.getElementById("gender").value;
    let age = parseInt(document.getElementById("age").value);
    let weight = parseFloat(document.getElementById("weight").value);
    let height = parseFloat(document.getElementById("height").value);
    let activity = parseFloat(document.getElementById("activity").value);

    if (!age || !weight || !height || !activity) {
        alert("Please fill in all fields.");
        return;
    }

    let bmr;
    if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let tdee = bmr * activity;

    document.getElementById("calories").innerText = Math.round(tdee);
    animateBars(tdee);
}

function animateBars(calories) {
    const protein = (calories * 0.3) / 4;
    const carbs = (calories * 0.4) / 4;
    const fats = (calories * 0.3) / 9;

    setBarWidth("protein-bar", protein, 150);
    setBarWidth("carbs-bar", carbs, 300);
    setBarWidth("fats-bar", fats, 70);

    document.getElementById("protein-grams").innerText = Math.round(protein) + "g";
    document.getElementById("carbs-grams").innerText = Math.round(carbs) + "g";
    document.getElementById("fats-grams").innerText = Math.round(fats) + "g";
}

function setBarWidth(barId, value, max) {
    let percentage = Math.min((value / max) * 100, 100);
    document.getElementById(barId).style.width = percentage + "%";
}

// THEME SWITCHING

document.getElementById("theme-default").addEventListener("click", () => setTheme("default"));
document.getElementById("theme-dark").addEventListener("click", () => setTheme("dark"));
document.getElementById("theme-amoled").addEventListener("click", () => setTheme("amoled"));

defaultTheme();

function setTheme(theme) {
    document.body.classList.remove("dark", "amoled");
    if (theme !== "default") document.body.classList.add(theme);
}

function defaultTheme() {
    document.body.classList.remove("dark", "amoled");
}
