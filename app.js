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
  const langToggle = document.getElementById("langToggle");
  const langToggleLabel = document.getElementById("langToggleLabel");
  const container = document.querySelector(".container");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingBar = document.getElementById("loadingBar");

  const translations = {
    en: {
      panel: { title: "Body Details" },
      form: {
        age: "Age",
        weight: "Weight (kg)",
        height: "Height (cm)",
        genderPlaceholder: "Select Gender",
        male: "Male",
        female: "Female",
        activityPlaceholder: "Activity Level",
        activity: {
          sedentary: "Sedentary (little or no exercise)",
          light: "Lightly Active (1–3 days/week)",
          moderate: "Moderately Active (3–5 days/week)",
          active: "Active (6–7 days/week)",
          very_active: "Very Active (hard daily exercise)"
        },
        goalPlaceholder: "Goal",
        goal: {
          maintain: "Maintain weight",
          lose: "Lose weight",
          gain: "Gain weight",
          muscle: "Muscle gain",
          cut: "Fat loss (cut)"
        },
        submit: "Get Calorie Goal"
      },
      goal: {
        placeholder: "Fill in your details to generate a tailored calorie plan.",
        incomplete: "Please complete every field to continue.",
        result: ({ calories }) =>
          `Your daily target is ${calories} kcal. Stay consistent and listen to your body.`
      },
      progress: {
        label: "Calorie goal",
        empty: "Waiting for goal…"
      },
      media: {
        title: "Meal capture",
        lead: "Log a photo when you add calories",
        addPhoto: "⬆ Add a photo",
        caption: "Add info about this meal (optional)",
        manual: "Add calories manually",
        status: {
          idle: "Waiting for a photo",
          ready: ({ name }) => `Ready: ${name}`,
          analyzing: "Analyzing meal…",
          success: "Meal logged successfully!",
          missing: "Select a photo first."
        }
      },
      settings: {
        title: "Personalize",
        language: "Language",
        languageCurrent: "English",
        languageAria: "Toggle app language",
        theme: "Themes",
        note: "Changes are saved locally so you can pick up where you left off."
      },
      macro: {
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fats"
      },
      units: {
        grams: "g",
        kcal: "kcal"
      }
    },
    ar: {
      panel: { title: "بيانات الجسم" },
      form: {
        age: "العمر",
        weight: "الوزن (كجم)",
        height: "الطول (سم)",
        genderPlaceholder: "اختر الجنس",
        male: "ذكر",
        female: "أنثى",
        activityPlaceholder: "مستوى النشاط",
        activity: {
          sedentary: "خامل (بدون تمارين تقريباً)",
          light: "نشاط خفيف (1-3 أيام/أسبوع)",
          moderate: "نشاط متوسط (3-5 أيام/أسبوع)",
          active: "نشاط عالٍ (6-7 أيام/أسبوع)",
          very_active: "نشاط مكثف (تمارين يومية شاقة)"
        },
        goalPlaceholder: "الهدف",
        goal: {
          maintain: "حافظ على الوزن",
          lose: "اخسر الوزن",
          gain: "اكسب الوزن",
          muscle: "زيادة العضلات",
          cut: "خسارة الدهون"
        },
        submit: "احسب السعرات"
      },
      goal: {
        placeholder: "أدخل بياناتك لتحصل على خطة سعرات مخصصة.",
        incomplete: "رجاءً أكمل جميع الحقول للمتابعة.",
        result: ({ calories }) => `هدفك اليومي هو ${calories} سعرة. التزم واستمع لجسمك.`
      },
      progress: {
        label: "هدف السعرات",
        empty: "بانتظار الهدف…"
      },
      media: {
        title: "توثيق الوجبة",
        lead: "أضف صورة عند تسجيل السعرات",
        addPhoto: "⬆ أضف صورة",
        caption: "أضف وصفاً عن الوجبة (اختياري)",
        manual: "إضافة سعرات يدوياً",
        status: {
          idle: "بانتظار صورة",
          ready: ({ name }) => `جاهز: ${name}`,
          analyzing: "يتم تحليل الوجبة…",
          success: "تم تسجيل الوجبة!",
          missing: "اختر صورة أولاً."
        }
      },
      settings: {
        title: "التخصيص",
        language: "اللغة",
        languageCurrent: "العربية",
        languageAria: "تبديل لغة التطبيق",
        theme: "السِمات",
        note: "نحفظ تغييراتك محلياً لتكمل لاحقاً."
      },
      macro: {
        protein: "البروتين",
        carbs: "الكربوهيدرات",
        fat: "الدهون"
      },
      units: {
        grams: "غ",
        kcal: "سعرة"
      }
    }
  };

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
  let currentLang = "en";
  let goalState = "placeholder";
  let goalMessageArgs = {};
  let uploadState = "idle";
  let uploadFileName = "";

  const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString(currentLang === "ar" ? "ar-EG" : "en-US");

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const translate = (key, params = {}) => {
    const parts = key.split(".");
    let result = translations[currentLang];
    for (const part of parts) {
      result = result?.[part];
    }
    if (result === undefined) return "";
    return typeof result === "function" ? result(params) : result;
  };

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
    if (theme === "default") {
      delete document.body.dataset.theme;
    } else {
      document.body.dataset.theme = theme;
    }
    themeCircles.forEach((circle) =>
      circle.classList.toggle("active", circle.dataset.theme === theme)
    );
  };

  const renderGoalMessage = () => {
    if (goalState === "result") {
      goalDisplay.textContent = translate("goal.result", {
        calories: formatNumber(goalMessageArgs.calories)
      });
    } else if (goalState === "incomplete") {
      goalDisplay.textContent = translate("goal.incomplete");
    } else {
      goalDisplay.textContent = translate("goal.placeholder");
    }
  };

  const renderUploadStatus = () => {
    uploadStatus.textContent = translate(`media.status.${uploadState}`, {
      name: uploadFileName
    });
  };

  const updateCircleProgress = () => {
    if (!calorieGoal) {
      progressCircle.style.strokeDashoffset = circleCircumference;
      progressCircle.style.stroke = "var(--accent)";
      progressText.textContent = translate("progress.empty");
      return;
    }
    const progress = clamp((currentCalories / calorieGoal) * 100, 0, 130);
    const dashOffset = circleCircumference - (progress / 100) * circleCircumference;
    progressCircle.style.strokeDashoffset = dashOffset;
    progressCircle.style.stroke = progress >= 100 ? "var(--success)" : "var(--accent)";
    progressText.textContent = `${formatNumber(currentCalories)} / ${formatNumber(
      calorieGoal
    )} ${translate("units.kcal")}`;
  };

  const updateMacroUI = () => {
    const consumedProtein = calorieGoal
      ? Math.round((currentCalories * macroRatios.protein) / 4)
      : 0;
    const consumedCarbs = calorieGoal
      ? Math.round((currentCalories * macroRatios.carbs) / 4)
      : 0;
    const consumedFat = calorieGoal
      ? Math.round((currentCalories * macroRatios.fat) / 9)
      : 0;

    const gramUnit = translate("units.grams");

    proteinText.textContent = `${translate("macro.protein")}: ${formatNumber(
      consumedProtein
    )}${gramUnit} / ${formatNumber(macroTargets.protein)}${gramUnit}`;
    carbsText.textContent = `${translate("macro.carbs")}: ${formatNumber(
      consumedCarbs
    )}${gramUnit} / ${formatNumber(macroTargets.carbs)}${gramUnit}`;
    fatText.textContent = `${translate("macro.fat")}: ${formatNumber(
      consumedFat
    )}${gramUnit} / ${formatNumber(macroTargets.fat)}${gramUnit}`;

    proteinBar.style.width = `${clamp(
      (consumedProtein / (macroTargets.protein || 1)) * 100 || 0,
      0,
      120
    )}%`;
    carbsBar.style.width = `${clamp(
      (consumedCarbs / (macroTargets.carbs || 1)) * 100 || 0,
      0,
      120
    )}%`;
    fatBar.style.width = `${clamp(
      (consumedFat / (macroTargets.fat || 1)) * 100 || 0,
      0,
      120
    )}%`;
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
      goalState = "incomplete";
      renderGoalMessage();
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

        goalState = "result";
        goalMessageArgs = { calories: calorieGoal };
        progressContainer.style.display = "flex";
        resetProgress();
        renderGoalMessage();
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
    goalState = "placeholder";
    goalMessageArgs = {};
    progressContainer.style.display = "none";
    calorieGoal = 0;
    currentCalories = 0;
    macroTargets = { protein: 0, carbs: 0, fat: 0 };
    setTheme("default");
    imagePreview.src = "";
    imageInput.value = "";
    uploadFileName = "";
    uploadState = "idle";
    renderGoalMessage();
    renderUploadStatus();
    updateCircleProgress();
    updateMacroUI();
  };

  const togglePanel = () => {
    panel.classList.toggle("collapsed");
    const expanded = panel.classList.contains("collapsed");
    panelToggle.setAttribute("aria-expanded", String(!expanded));
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
      uploadFileName = "";
      uploadState = "idle";
      renderUploadStatus();
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target?.result || "";
      uploadFileName = file.name;
      uploadState = "ready";
      renderUploadStatus();
    };
    reader.readAsDataURL(file);
  };

  const fakeUpload = () => {
    if (!imageInput.files?.length) {
      uploadState = "missing";
      renderUploadStatus();
      return;
    }
    toggleLoading(true);
    uploadState = "analyzing";
    renderUploadStatus();
    setTimeout(() => {
      toggleLoading(false);
      uploadState = "success";
      renderUploadStatus();
    }, 1200);
  };

  const applyTranslations = () => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.id === "goalDisplay" || el.id === "uploadStatus") return;
      const text = translate(el.dataset.i18n);
      if (text) el.textContent = text;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const placeholder = translate(el.dataset.i18nPlaceholder);
      if (placeholder) el.placeholder = placeholder;
    });

    langToggleLabel.textContent = translate("settings.languageCurrent");
    const langSwitch = langToggle.closest(".switch");
    if (langSwitch) {
      langSwitch.setAttribute("aria-label", translate("settings.languageAria"));
    }

    renderGoalMessage();
    renderUploadStatus();
    updateCircleProgress();
    updateMacroUI();
  };

  const setLanguage = (lang) => {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
    container.dir = lang === "ar" ? "rtl" : "ltr";
    langToggle.checked = lang === "ar";
    applyTranslations();
  };

  form.addEventListener("submit", handleFormSubmit);
  addCaloriesBtn.addEventListener("click", handleManualAdd);
  forgetGoalBtn.addEventListener("click", resetAll);
  panelToggle.addEventListener("click", togglePanel);
  themeToggle.addEventListener("click", handleThemeToggle);
  themeCircles.forEach((circle) =>
    circle.addEventListener("click", handleThemeCircleClick)
  );
  langToggle.addEventListener("change", (event) =>
    setLanguage(event.target.checked ? "ar" : "en")
  );
  uploadBtn.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", handleUploadPreview);
  sendImageBtn.addEventListener("click", fakeUpload);

  setTheme("default");
  setLanguage("en");
  progressContainer.style.display = "none";
  renderGoalMessage();
  renderUploadStatus();
});
