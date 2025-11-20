document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  const goalDisplay = document.getElementById("goalDisplay");
  const progressContainer = document.getElementById("progressContainer");
  const progressText = document.getElementById("progressText");
  const progressCircle = document.getElementById("calorieProgress");
  const proteinText = document.getElementById("proteinText");
  const carbsText = document.getElementById("carbsText");
  const fatText = document.getElementById("fatText");
  const proteinBar = document.getElementById("proteinBar");
  const carbsBar = document.getElementById("carbsBar");
  const fatBar = document.getElementById("fatBar");
  const manualCalories = document.getElementById("manualCalories");
  const addCaloriesBtn = document.getElementById("addCaloriesBtn");
  const forgetGoalBtn = document.getElementById("forgetGoalBtn");
  const imageInput = document.getElementById("mealImage");
  const uploadBtn = document.getElementById("uploadBtn");
  const sendImageBtn = document.getElementById("sendImage");
  const uploadStatus = document.getElementById("uploadStatus");
  const imagePreview = document.getElementById("imagePreview");
  const themeSelector = document.getElementById("themeSelector");
  const themeToggle = document.getElementById("themeToggle");
  const themeCircles = document.querySelectorAll(".theme-circle");
  const panel = document.getElementById("userPanel");
  const panelToggle = document.getElementById("panelToggle");
  const langBtn = document.getElementById("langBtn");
  const container = document.querySelector(".container");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingBar = document.getElementById("loadingBar");

  const activityMap = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const goalAdjustments = {
    maintain: 0,
    lose: -400,
    gain: 350,
    muscle: 250,
    cut: -500
  };

  const macroRatios = {
    protein: 0.3,
    carbs: 0.45,
    fat: 0.25
  };

  const circleCircumference = 439.82;
  let calorieGoal = 0;
  let currentCalories = 0;
  let macroTargets = { protein: 0, carbs: 0, fat: 0 };
  let isArabic = false;

  const formatNumber = (value) => Number(value).toLocaleString();

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateLoadingBar = (progress) => {
    loadingBar.style.width = `${progress}%`;
  };

  const toggleLoading = (state) => {
    loadingOverlay.style.display = state ? "flex" : "none";
    updateLoadingBar(state ? 35 : 100);
    if (!state) {
      setTimeout(() => updateLoadingBar(0), 400);
    }
  };

  const setTheme = (theme) => {
    document.body.dataset.theme = theme === "default" ? "" : theme;
    themeCircles.forEach((circle) =>
      circle.classList.toggle("active", circle.dataset.theme === theme)
    );
  };

  const updateCircleProgress = () => {
    if (!calorieGoal) return;
    const progress = clamp((currentCalories / calorieGoal) * 100, 0, 130);
    const dashOffset = circleCircumference - (progress / 100) * circleCircumference;
    progressCircle.style.strokeDashoffset = dashOffset;
    progressCircle.style.stroke = progress >= 100 ? "var(--success)" : "var(--accent)";
    progressText.textContent = `${formatNumber(currentCalories)} / ${formatNumber(
      calorieGoal
    )} kcal`;
  };

  const updateMacroUI = () => {
    const consumedProtein = Math.round((currentCalories * macroRatios.protein) / 4);
    const consumedCarbs = Math.round((currentCalories * macroRatios.carbs) / 4);
    const consumedFat = Math.round((currentCalories * macroRatios.fat) / 9);

    proteinText.textContent = `Protein: ${consumedProtein}g / ${macroTargets.protein}g`;
    carbsText.textContent = `Carbs: ${consumedCarbs}g / ${macroTargets.carbs}g`;
    fatText.textContent = `Fats: ${consumedFat}g / ${macroTargets.fat}g`;

    proteinBar.style.width = `${clamp(
      (consumedProtein / macroTargets.protein) * 100 || 0,
      0,
      120
    )}%`;
    carbsBar.style.width = `${clamp(
      (consumedCarbs / macroTargets.carbs) * 100 || 0,
      0,
      120
    )}%`;
    fatBar.style.width = `${clamp((consumedFat / macroTargets.fat) * 100 || 0, 0, 120)}%`;
  };

  const resetProgress = () => {
    currentCalories = 0;
    updateCircleProgress();
    updateMacroUI();
  };

  const calculateGoal = (details) => {
    const { gender, age, weight, height, activity, goal } = details;
    const base =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    const activityMultiplier = activityMap[activity] || 1.2;
    const adjustment = goalAdjustments[goal] ?? 0;
    return Math.round(base * activityMultiplier + adjustment);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData);
    if (Object.values(entries).some((value) => !value)) {
      goalDisplay.textContent = "Please complete every field to continue.";
      return;
    }

    toggleLoading(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        calorieGoal = clamp(calculateGoal(entries), 1200, 4500);
        macroTargets = {
          protein: Math.round((calorieGoal * macroRatios.protein) / 4),
          carbs: Math.round((calorieGoal * macroRatios.carbs) / 4),
          fat: Math.round((calorieGoal * macroRatios.fat) / 9)
        };

        goalDisplay.textContent = `Your daily target is ${formatNumber(
          calorieGoal
        )} kcal. Stay consistent and listen to your body.`;

        progressContainer.style.display = "grid";
        resetProgress();
        toggleLoading(false);
      }, 650);
    });
  };

  const handleManualAdd = () => {
    const value = Number(manualCalories.value);
    if (!value || value <= 0) return;
    currentCalories = clamp(currentCalories + value, 0, 6000);
    updateCircleProgress();
    updateMacroUI();
    manualCalories.value = "";
  };

  const resetAll = () => {
    form.reset();
    goalDisplay.textContent = "Fill in your details to generate a tailored calorie plan.";
    progressContainer.style.display = "none";
    calorieGoal = 0;
    currentCalories = 0;
    themeCircles.forEach((circle) => circle.classList.remove("active"));
    setTheme("default");
  };

  const togglePanel = () => {
    panel.classList.toggle("collapsed");
    const expanded = panel.classList.contains("collapsed");
    panelToggle.setAttribute("aria-expanded", String(!expanded));
  };

  const toggleLang = () => {
    isArabic = !isArabic;
    document.documentElement.lang = isArabic ? "ar" : "en";
    container.dir = isArabic ? "rtl" : "ltr";
    langBtn.textContent = isArabic ? "En" : "ع";
  };

  const handleThemeCircleClick = (event) => {
    const selectedTheme = event.currentTarget.dataset.theme;
    setTheme(selectedTheme);
  };

  const handleThemeToggle = () => {
    themeSelector.classList.toggle("collapsed");
    const expanded = !themeSelector.classList.contains("collapsed");
    themeToggle.setAttribute("aria-expanded", String(expanded));
  };

  const handleUploadPreview = () => {
    const file = imageInput.files?.[0];
    if (!file) {
      imagePreview.src = "";
      uploadStatus.textContent = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target?.result || "";
      uploadStatus.textContent = `Ready: ${file.name}`;
    };
    reader.readAsDataURL(file);
  };

  const fakeUpload = () => {
    if (!imageInput.files?.length) {
      uploadStatus.textContent = "Select a photo first.";
      return;
    }
    toggleLoading(true);
    uploadStatus.textContent = "Analyzing meal…";
    setTimeout(() => {
      toggleLoading(false);
      uploadStatus.textContent = "Meal logged successfully!";
    }, 1200);
  };

  form.addEventListener("submit", handleFormSubmit);
  addCaloriesBtn.addEventListener("click", handleManualAdd);
  forgetGoalBtn.addEventListener("click", resetAll);
  panelToggle.addEventListener("click", togglePanel);
  langBtn.addEventListener("click", toggleLang);
  themeToggle.addEventListener("click", handleThemeToggle);
  themeCircles.forEach((circle) =>
    circle.addEventListener("click", handleThemeCircleClick)
  );
  uploadBtn.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", handleUploadPreview);
  sendImageBtn.addEventListener("click", fakeUpload);

  // Initial state
  setTheme("default");
  updateCircleProgress();
  updateMacroUI();
  goalDisplay.textContent = "Fill in your details to generate a tailored calorie plan.";
});
