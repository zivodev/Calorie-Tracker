document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  const progressContainer = document.getElementById("progressContainer");
  const progressText = document.getElementById("progressText");
  const progressCircle = document.getElementById("calorieProgress");
  const manualCalories = document.getElementById("manualCalories");
  const addCaloriesBtn = document.getElementById("addCaloriesBtn");
  const forgetGoalBtn = document.getElementById("forgetGoalBtn");
  const imageInput = document.getElementById("mealImage");
  const uploadBtn = document.getElementById("uploadBtn");
  const sendImageBtn = document.getElementById("sendImage");
  const uploadStatus = document.getElementById("uploadStatus");
  const imagePreview = document.getElementById("imagePreview");
  const themeSelector = document.getElementById("themeSelector");
  const themeCircles = document.querySelectorAll(".theme-circle");
  const panel = document.getElementById("userPanel");
  const panelToggle = document.getElementById("panelToggle");
  const langSegment = document.querySelector(".langSegment");
  const langButtons = langSegment?.querySelectorAll(".segOption") ?? [];
  const segHighlight = document.querySelector(".segHighlight");
  const container = document.querySelector(".container");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingBar = document.getElementById("loadingBar");
  const tabButtons = document.querySelectorAll(".tabBtn");
  const pages = document.querySelectorAll(".page");
  const mediaPanel = document.querySelector(".mediaPanel");
  const macroMiniValue = {
    protein: document.getElementById("proteinMiniValue"),
    carbs: document.getElementById("carbsMiniValue"),
    fat: document.getElementById("fatMiniValue")
  };
  const macroMiniCircle = {
    protein: document.getElementById("proteinCircle"),
    carbs: document.getElementById("carbsCircle"),
    fat: document.getElementById("fatCircle")
  };
  const allowSelection = (target) =>
    target.closest("input, textarea, select, button, [contenteditable='true']");

  document.body.classList.add("locked");
  ["contextmenu", "dragstart"].forEach((evt) =>
    document.addEventListener(evt, (event) => event.preventDefault())
  );
  document.addEventListener("selectstart", (event) => {
    if (!allowSelection(event.target)) {
      event.preventDefault();
    }
  });

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
        incomplete: "Please complete every field to continue."
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
        note: "Changes are saved locally so you can pick up where you left off.",
        reset: "Reset data",
        resetDone: "Data reset!"
      },
      macro: {
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fats"
      },
      nav: {
        goal: "Progress",
        capture: "Capture",
        settings: "Settings"
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
        incomplete: "رجاءً أكمل جميع الحقول للمتابعة."
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
        note: "نحفظ تغييراتك محلياً لتكمل لاحقاً.",
        reset: "إعادة ضبط البيانات",
        resetDone: "تمت إعادة الضبط!"
      },
      macro: {
        protein: "البروتين",
        carbs: "الكربوهيدرات",
        fat: "الدهون"
      },
      nav: {
        goal: "التقدم",
        capture: "التسجيل",
        settings: "الإعدادات"
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
  const microCircumference = 2 * Math.PI * 26;
  let calorieGoal = 0;
  let currentCalories = 0;
  let macroTargets = { protein: 0, carbs: 0, fat: 0 };
  let currentLang = "en";
  let uploadState = "idle";
  let uploadFileName = "";
  let resetFeedbackTimer = null;
  let resetConfirmed = false;

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
    const macroData = [
      ["protein", consumedProtein],
      ["carbs", consumedCarbs],
      ["fat", consumedFat]
    ];

    macroData.forEach(([key, consumed]) => {
      const target = macroTargets[key] || 0;
      const ratio = target ? clamp(consumed / target, 0, 1.2) : 0;
      const circle = macroMiniCircle[key];
      const valueEl = macroMiniValue[key];
      if (circle) {
        circle.style.strokeDashoffset = microCircumference - ratio * microCircumference;
      }
      if (valueEl) {
        valueEl.textContent = `${formatNumber(consumed)}${gramUnit}`;
        valueEl.setAttribute(
          "title",
          target ? `${formatNumber(consumed)} / ${formatNumber(target)}${gramUnit}` : ""
        );
      }
    });
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
      form.reportValidity();
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

        progressContainer.style.display = "flex";
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

  const setResetFeedback = (state) => {
    resetConfirmed = state;
    if (forgetGoalBtn) {
      forgetGoalBtn.classList.toggle("confirmed", state);
      forgetGoalBtn.textContent = translate(
        state ? "settings.resetDone" : "settings.reset"
      );
    }
  };

  const resetAll = () => {
    form.reset();
    progressContainer.style.display = "none";
    calorieGoal = 0;
    currentCalories = 0;
    macroTargets = { protein: 0, carbs: 0, fat: 0 };
    setTheme("default");
    imagePreview.src = "";
    imagePreview.classList.remove("has-image");
    imageInput.value = "";
    uploadFileName = "";
    uploadState = "idle";
    mediaPanel?.classList.remove("has-photo");
    renderUploadStatus();
    updateCircleProgress();
    updateMacroUI();
    if (resetFeedbackTimer) clearTimeout(resetFeedbackTimer);
    setResetFeedback(true);
    resetFeedbackTimer = setTimeout(() => setResetFeedback(false), 2200);
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

  const handleUploadPreview = () => {
    const file = imageInput.files?.[0];
    if (!file) {
      imagePreview.src = "";
      imagePreview.classList.remove("has-image");
      uploadFileName = "";
      uploadState = "idle";
      renderUploadStatus();
      mediaPanel?.classList.remove("has-photo");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result || "";
      imagePreview.src = result;
      imagePreview.classList.toggle("has-image", Boolean(result));
      uploadFileName = file.name;
      uploadState = "ready";
      renderUploadStatus();
      if (result) {
        mediaPanel?.classList.add("has-photo");
      }
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
      if (["uploadStatus", "forgetGoalBtn"].includes(el.id)) return;
      const text = translate(el.dataset.i18n);
      if (text) el.textContent = text;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const placeholder = translate(el.dataset.i18nPlaceholder);
      if (placeholder) el.placeholder = placeholder;
    });

    renderUploadStatus();
    updateCircleProgress();
    updateMacroUI();
    if (forgetGoalBtn) {
      forgetGoalBtn.textContent = translate(
        resetConfirmed ? "settings.resetDone" : "settings.reset"
      );
    }
  };

  const setLanguage = (lang) => {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
    container.dir = lang === "ar" ? "rtl" : "ltr";
    if (langSegment) {
      langSegment.dataset.active = lang;
      langButtons.forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.lang === lang)
      );
      if (segHighlight) {
        const index = lang === "ar" ? 1 : 0;
        segHighlight.style.transform = `translateX(${index * 100}%)`;
      }
    }
    container.classList.remove("language-fade");
    void container.offsetWidth;
    container.classList.add("language-fade");
    applyTranslations();
  };

  const setActivePage = (target) => {
    pages.forEach((page) =>
      page.classList.toggle("active", page.dataset.page === target)
    );
    tabButtons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.target === target)
    );
  };

  form.addEventListener("submit", handleFormSubmit);
  addCaloriesBtn.addEventListener("click", handleManualAdd);
  forgetGoalBtn.addEventListener("click", resetAll);
  panelToggle.addEventListener("click", togglePanel);
  themeCircles.forEach((circle) =>
    circle.addEventListener("click", handleThemeCircleClick)
  );
  langButtons.forEach((btn) =>
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang))
  );
  uploadBtn.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", handleUploadPreview);
  sendImageBtn.addEventListener("click", fakeUpload);
  tabButtons.forEach((btn) =>
    btn.addEventListener("click", () => setActivePage(btn.dataset.target))
  );

  setTheme("default");
  setActivePage("goal");
  setLanguage("en");
  progressContainer.style.display = "none";
  renderUploadStatus();
});
