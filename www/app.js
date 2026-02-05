document.addEventListener("DOMContentLoaded", () => {
  // helper: grab element and warn if missing (for required ones)
  const $ = (id) => document.getElementById(id);
  const warnIfMissing = (el, name) => {
    if (!el) console.warn(`[CalorieScope] Missing element: ${name}`);
    return el;
  };

  // required-ish elements (we'll early-exit if the form is missing)
  const form = warnIfMissing($("userForm"), "userForm");
  if (!form) {
    console.error("[CalorieScope] Aborting initialization because form #userForm is missing.");
    return;
  }

  // optional elements (we'll guard usage)
  const progressContainer = $("progressContainer") || null;
  const progressText = $("progressText") || null;
  const progressCircle = $("calorieProgress") || null;
  const manualCalories = $("manualCalories") || null;
  const manualProtein = $("manualProtein") || null;
  const manualCarbs = $("manualCarbs") || null;
  const manualFat = $("manualFat") || null;
  const addCaloriesBtn = $("addCaloriesBtn") || null;
  const forgetGoalBtn = $("forgetGoalBtn") || null;
  const imageInput = $("mealImage") || null;
  const uploadBtn = $("uploadBtn") || null;
  const sendImageBtn = $("sendImage") || null;
  const uploadStatus = $("uploadStatus") || null;
  const imagePreview = $("imagePreview") || null;
  const camera = $("camera") || null;
  const snapshot = $("snapshot") || null;
  const captureBtn = $("captureBtn") || null;
  let cameraStream = null;
  const themeSelector = $("themeSelector") || null;
  const themeCircles = document.querySelectorAll(".theme-circle");
  const panel = $("userPanel") || null;
  const panelToggle = $("panelToggle") || null;
  const langSegment = document.querySelector(".langSegment");
  const langButtons = langSegment?.querySelectorAll(".segOption") ?? [];
  const segHighlight = document.querySelector(".segHighlight") || null;
  const container = document.querySelector(".container") || document.body;
  const loadingOverlay = $("loadingOverlay") || null;
  const loadingBar = $("loadingBar") || null;
  const tabButtons = document.querySelectorAll(".tabBtn");
  const pages = document.querySelectorAll(".page");
  const mediaPanel = document.querySelector(".mediaPanel");
  const formFab = $("formFab") || null;
  const formOverlay = $("formOverlay") || null;
  const macroMiniValue = {
    protein: $("proteinMiniValue"),
    carbs: $("carbsMiniValue"),
    fat: $("fatMiniValue")
  };
  const macroMiniCircle = {
    protein: $("proteinCircle"),
    carbs: $("carbsCircle"),
    fat: $("fatCircle")
  };

  const allowSelection = (target) =>
    target?.closest && target.closest("input, textarea, select, button, [contenteditable='true']");

  // prevent accidental selection/context menu etc.
  document.body?.classList?.add("locked");
  ["contextmenu", "dragstart"].forEach((evt) =>
    document.addEventListener(evt, (event) => event.preventDefault())
  );
  document.addEventListener("selectstart", (event) => {
    if (!allowSelection(event.target)) {
      event.preventDefault();
    }
  });

  // ---------- data & translations ----------
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
        empty: "Scoping…"
      },
      media: {
        title: "Meal capture",
        lead: "Log a photo when you add calories",
        addPhoto: "⬆ Add a photo",
        capture: "Capture",
        caption: "Add info about this meal (optional)",
        manual: "Add calories manually",
        status: {
          idle: "Waiting for a photo",
          ready: ({ name }) => `Ready: ${name}`,
          analyzing: "Analyzing meal…",
          success: "Meal logged successfully!",
          missing: "Select a photo first.",
          cameraError: "Camera access failed"
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
        fat: "Fats",
        dailyCalories: "Daily calories",
        dailyProtein: "Protein / day",
        dailyCarbs: "Carbs / day",
        dailyFat: "Fats / day"
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
        capture: "التقاط",
        caption: "أضف وصفاً عن الوجبة (اختياري)",
        manual: "إضافة سعرات يدوياً",
        status: {
          idle: "بانتظار صورة",
          ready: ({ name }) => `جاهز: ${name}`,
          analyzing: "يتم تحليل الوجبة…",
          success: "تم تسجيل الوجبة!",
          missing: "اختر صورة أولاً.",
          cameraError: "فشل الوصول إلى الكاميرا"
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
        fat: "الدهون",
        dailyCalories: "السعرات اليومية",
        dailyProtein: "البروتين / اليوم",
        dailyCarbs: "الكربوهيدرات / اليوم",
        dailyFat: "الدهون / اليوم"
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
  let currentMacros = { protein: 0, carbs: 0, fat: 0 };
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

  // ---------- UI helpers ----------
  const updateLoadingBar = (progress) => {
    if (!loadingBar) return;
    loadingBar.style.width = `${progress}%`;
  };

  const toggleLoading = (state) => {
    if (!loadingOverlay || !loadingBar) return;
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
    if (!uploadStatus) return;
    const text = translate(`media.status.${uploadState}`, { name: uploadFileName });
    uploadStatus.textContent = text || "";

    if (sendImageBtn) {
      const ready = uploadState === "ready" && Boolean(imageInput?.files?.length);
      sendImageBtn.disabled = !ready;
      sendImageBtn.setAttribute("aria-disabled", String(!ready));
    }
  };

  const updateCircleProgress = () => {
    if (!progressText || !progressCircle) {
      // nothing to update visually, but keep state consistent
      return;
    }
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
    const gramUnit = translate("units.grams");
    const macroData = [
      ["protein", currentMacros.protein],
      ["carbs", currentMacros.carbs],
      ["fat", currentMacros.fat]
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
        const rounded = Math.round(consumed * 10) / 10;
        const targetRounded = Math.round((target || 0) * 10) / 10;
        valueEl.textContent = target
          ? `${rounded.toFixed(1)}/${targetRounded.toFixed(1)}`
          : `${rounded.toFixed(1)}${gramUnit}`;
        valueEl.removeAttribute("title");
      }
    });
  };

  const resetProgress = () => {
    currentCalories = 0;
    currentMacros = { protein: 0, carbs: 0, fat: 0 };
    updateCircleProgress();
    updateMacroUI();
  };

  // ---------- calculations ----------
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

  // ---------- event handlers ----------
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData);
    if (Object.values(entries).some((value) => !value)) {
      form.reportValidity();
      return;
    }

    if (loadingOverlay && loadingBar) toggleLoading(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        calorieGoal = clamp(calculateGoal(entries), 1200, 4500);
        macroTargets = {
          protein: Math.round((calorieGoal * macroRatios.protein) / 4),
          carbs: Math.round((calorieGoal * macroRatios.carbs) / 4),
          fat: Math.round((calorieGoal * macroRatios.fat) / 9)
        };

        if (progressContainer) progressContainer.style.display = "flex";
        resetProgress();
        if (loadingOverlay && loadingBar) toggleLoading(false);
        // close the floating form after goal is generated
        closeFormModal();
      }, 650);
    });
  };

  const handleManualAdd = () => {
    if (!manualCalories) return;
    const value = Number(manualCalories.value);
    if (!value || value <= 0) {
      manualCalories.focus();
      return;
    }
    const protein = Number(manualProtein?.value) || 0;
    const carbs = Number(manualCarbs?.value) || 0;
    const fat = Number(manualFat?.value) || 0;

    currentCalories = clamp(currentCalories + value, 0, 6000);
    currentMacros.protein = clamp(currentMacros.protein + protein, 0, 9999);
    currentMacros.carbs = clamp(currentMacros.carbs + carbs, 0, 9999);
    currentMacros.fat = clamp(currentMacros.fat + fat, 0, 9999);
    updateCircleProgress();
    updateMacroUI();
    manualCalories.value = "";
    if (manualProtein) manualProtein.value = "";
    if (manualCarbs) manualCarbs.value = "";
    if (manualFat) manualFat.value = "";
    setActivePage("goal");
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
    if (progressContainer) progressContainer.style.display = "none";
    calorieGoal = 0;
    currentCalories = 0;
    macroTargets = { protein: 0, carbs: 0, fat: 0 };
    setTheme("default");
    if (imagePreview) {
      imagePreview.src = "";
      imagePreview.classList.remove("has-image");
    }
    if (imageInput) imageInput.value = "";
    uploadFileName = "";
    uploadState = "idle";
    if (mediaPanel) mediaPanel.classList.remove("has-photo");
    stopCamera();
    // Restart camera if on media page
    if (pages && Array.from(pages).some((p) => p.classList.contains("active") && p.dataset.page === "media")) {
      startCamera();
    }
    renderUploadStatus();
    updateCircleProgress();
    updateMacroUI();
    if (resetFeedbackTimer) clearTimeout(resetFeedbackTimer);
    setResetFeedback(true);
    resetFeedbackTimer = setTimeout(() => setResetFeedback(false), 2200);
  };

  const openFormModal = () => {
    if (!panel) return;
    panel.classList.add("open");
    if (formOverlay) formOverlay.classList.add("visible");
  };

  const closeFormModal = () => {
    if (!panel) return;
    panel.classList.remove("open");
    if (formOverlay) formOverlay.classList.remove("visible");
  };

  const togglePanel = () => {
    if (!panel) return;
    if (panel.classList.contains("open")) {
      closeFormModal();
    } else {
      openFormModal();
    }
  };

  const handleThemeCircleClick = (event) => {
    const selectedTheme = event.currentTarget.dataset.theme;
    setTheme(selectedTheme);
  };

  const startCamera = async () => {
    if (!camera) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      camera.srcObject = stream;
      cameraStream = stream;
    } catch (err) {
      console.error("[CalorieScope] Camera access failed:", err);
      if (uploadStatus) {
        uploadStatus.textContent = translate("media.status.cameraError") || "Camera access failed";
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }
    if (camera) {
      camera.srcObject = null;
    }
  };

  const handleCameraCapture = () => {
    if (!camera || !snapshot || !imagePreview) return;

    const ctx = snapshot.getContext("2d");
    snapshot.width = camera.videoWidth;
    snapshot.height = camera.videoHeight;
    ctx.drawImage(camera, 0, 0);

    const dataUrl = snapshot.toDataURL("image/jpeg", 0.9);
    imagePreview.src = dataUrl;
    imagePreview.classList.add("has-image");
    uploadFileName = "captured-photo.jpg";
    uploadState = "ready";
    renderUploadStatus();

    if (mediaPanel) mediaPanel.classList.add("has-photo");

    // Stop camera after capture
    stopCamera();

    // Convert data URL to File so the fake upload flow can access it
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
        // Store in a way that fakeUpload can access it
        if (imageInput) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          imageInput.files = dataTransfer.files;
        }
      })
      .catch((err) => console.error("[CalorieScope] Failed to convert capture:", err));
  };

  const handleUploadPreview = () => {
    if (!imageInput || !imagePreview) {
      uploadState = "missing";
      renderUploadStatus();
      return;
    }
    const file = imageInput.files?.[0];
    if (!file) {
      imagePreview.src = "";
      imagePreview.classList.remove("has-image");
      uploadFileName = "";
      uploadState = "idle";
      renderUploadStatus();
      if (mediaPanel) mediaPanel.classList.remove("has-photo");
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
    if (!imageInput?.files?.length) {
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

      // After successful send, go back to progress page
      setActivePage("goal");
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
    // Start/stop camera when switching to/from media page
    if (target === "media") {
      if (!mediaPanel?.classList.contains("has-photo")) {
        startCamera();
      }
    } else {
      stopCamera();
    }
  };

  // ---------- bind events (only if elements exist) ----------
  form.addEventListener("submit", handleFormSubmit);
  // Manual add: handle Enter key on any input
  if (manualCalories) {
    manualCalories.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleManualAdd();
      }
    });
  }
  const manualMacroInputs = [manualProtein, manualCarbs, manualFat].filter(Boolean);
  manualMacroInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleManualAdd();
      }
    });
  });
  if (addCaloriesBtn) addCaloriesBtn.addEventListener("click", handleManualAdd);
  if (forgetGoalBtn) forgetGoalBtn.addEventListener("click", resetAll);
  if (panelToggle) panelToggle.addEventListener("click", togglePanel);
  if (formFab) formFab.addEventListener("click", openFormModal);
  if (formOverlay) formOverlay.addEventListener("click", closeFormModal);
  themeCircles.forEach((circle) =>
    circle.addEventListener("click", handleThemeCircleClick)
  );
  langButtons.forEach((btn) =>
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang))
  );
  if (uploadBtn && imageInput) uploadBtn.addEventListener("click", () => imageInput.click());
  if (imageInput) imageInput.addEventListener("change", handleUploadPreview);
  if (captureBtn) captureBtn.addEventListener("click", handleCameraCapture);
  if (sendImageBtn) sendImageBtn.addEventListener("click", fakeUpload);
  tabButtons.forEach((btn) =>
    btn.addEventListener("click", () => setActivePage(btn.dataset.target))
  );

  // ---------- initial state ----------
  setTheme("default");
  setActivePage("goal");
  setLanguage("en");
  if (progressContainer) progressContainer.style.display = "none";
  renderUploadStatus();

  // quick debug print of missing elements (useful while developing)
  const checkList = {
    progressCircle,
    progressText,
    manualCalories,
    forgetGoalBtn,
    imageInput,
    uploadBtn,
    sendImageBtn,
    uploadStatus,
    imagePreview,
    loadingOverlay,
    loadingBar
  };
  Object.entries(checkList).forEach(([k, v]) => {
    if (!v) console.info(`[CalorieScope] Optional element not found: ${k}`);
  });
});
