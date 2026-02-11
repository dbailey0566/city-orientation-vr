// js/hotspots.js
"use strict";

(function () {

  const content = {
    airport: {
      title: "Airport Arrival",
      info: "Immigration officers expect direct, concise answers. Avoid humor.",
      question: "Which behavior is most appropriate at immigration?",
      options: ["Make small talk", "Answer briefly and directly", "Ask about their day"],
      correct: 1
    },
    metro: {
      title: "Metro Station",
      info: "Tickets must be validated before boarding.",
      question: "Where should you validate your metro ticket?",
      options: ["On the train", "Before entering platform", "After arrival"],
      correct: 1
    },
    campus: {
      title: "Campus Check In",
      info: "Visit the international office first for documentation.",
      question: "Where should you go first upon arrival?",
      options: ["Dormitory", "Cafeteria", "International office"],
      correct: 2
    }
  };

  const completedLocations = new Set();
  const locationOrder = ["airport", "metro", "campus"];
  let orientationComplete = false;

  let currentLocation = null;
  let openTimeMs = null;

  function getOverlayEls() {
    return {
      overlay: document.getElementById("overlay"),
      titleEl: document.getElementById("locationTitle"),
      infoEl: document.getElementById("locationInfo"),
      questionBlock: document.getElementById("questionBlock")
    };
  }

  function updateProgress() {
    const progressEl = document.getElementById("progressTracker");
    if (!progressEl) return;

    const total = Object.keys(content).length;
    const completed = completedLocations.size;

    progressEl.textContent = `Progress: ${completed} / ${total} completed`;
  }

  function isUnlocked(loc) {
    const index = locationOrder.indexOf(loc);
    if (index === 0) return true;

    const previousLoc = locationOrder[index - 1];
    return completedLocations.has(previousLoc);
  }

  function updateLockedVisuals() {
    document.querySelectorAll(".hotspot").forEach(el => {
      const loc = el.getAttribute("data-location");

      if (!isUnlocked(loc)) {
        el.setAttribute("opacity", 0.4);
      } else {
        el.setAttribute("opacity", 1);
      }
    });
  }

  function showCompletionScreen() {
    orientationComplete = true;

    const { overlay, titleEl, infoEl, questionBlock } = getOverlayEls();

    titleEl.textContent = "Orientation Complete";
    infoEl.textContent = "You have completed all required locations.";

    questionBlock.innerHTML = "";

    const confLabel = document.createElement("p");
    confLabel.textContent = "Overall, how prepared do you feel for arrival? (1 low - 5 high)";
    questionBlock.appendChild(confLabel);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "1";
    slider.max = "5";
    slider.value = "3";
    slider.id = "finalConfidence";
    questionBlock.appendChild(slider);

    const reflectionLabel = document.createElement("p");
    reflectionLabel.textContent = "What concerns or questions remain?";
    questionBlock.appendChild(reflectionLabel);

    const textarea = document.createElement("textarea");
    textarea.id = "finalReflection";
    textarea.rows = 4;
    textarea.style.width = "100%";
    questionBlock.appendChild(textarea);

    const finishBtn = document.createElement("button");
    finishBtn.className = "btn";
    finishBtn.textContent = "Finish Orientation";
    finishBtn.addEventListener("click", saveFinalReflection);
    questionBlock.appendChild(finishBtn);

    overlay.style.display = "block";
  }

  function saveFinalReflection() {
    const finalConfidence = Number(document.getElementById("finalConfidence").value);
    const finalReflection = document.getElementById("finalReflection").value;

    window.AppData.sessionData.finalReflection = {
      finalConfidence,
      finalReflection
    };

    const { overlay } = getOverlayEls();
    overlay.style.display = "none";

    alert("Orientation complete. You may now download your results.");
  }

  function openLocation(loc) {
    const data = content[loc];
    if (!data) return;

    currentLocation = loc;
    openTimeMs = Date.now();

    const { overlay, titleEl, infoEl, questionBlock } = getOverlayEls();

    titleEl.textContent = data.title;
    infoEl.textContent = data.info;
    questionBlock.innerHTML = "";

    const q = document.createElement("p");
    q.textContent = data.question;
    questionBlock.appendChild(q);

    data.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "btn";
      btn.addEventListener("click", () => submitAnswer(index));
      questionBlock.appendChild(btn);
    });

    overlay.style.display = "block";
  }

  function submitAnswer(selectedIndex) {
    const data = content[currentLocation];
    if (!data) return;

    const correct = selectedIndex === data.correct;
    const timeSpentSec = Math.floor((Date.now() - openTimeMs) / 1000);

    const { questionBlock } = getOverlayEls();
    questionBlock.innerHTML = "";

    const p = document.createElement("p");
    p.textContent = "Confidence level (1 low - 5 high):";
    questionBlock.appendChild(p);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "1";
    slider.max = "5";
    slider.value = "3";
    slider.id = "confidence";
    questionBlock.appendChild(slider);

    const submitBtn = document.createElement("button");
    submitBtn.className = "btn";
    submitBtn.textContent = "Submit";
    submitBtn.addEventListener("click", () => saveResponse(correct, timeSpentSec));
    questionBlock.appendChild(submitBtn);
  }

  function saveResponse(correct, timeSpentSec) {
    const confidenceEl = document.getElementById("confidence");
    const confidence = confidenceEl ? Number(confidenceEl.value) : 3;

    window.AppData.addEvent({
      location: currentLocation,
      correct,
      confidence,
      timeSpent: timeSpentSec
    });

    completedLocations.add(currentLocation);
    updateProgress();
    updateLockedVisuals();

    if (completedLocations.size === locationOrder.length && !orientationComplete) {
      showCompletionScreen();
      return;
    }

    const { overlay } = getOverlayEls();
    overlay.style.display = "none";
  }

  function attachHotspotListeners() {
    const nodes = document.querySelectorAll(".hotspot");

    nodes.forEach((el) => {
      el.addEventListener("click", () => {
        const loc = el.getAttribute("data-location");

        if (!isUnlocked(loc)) {
          alert("Complete the previous location first.");
          return;
        }

        openLocation(loc);
      });
    });
  }

  function attachExportButton() {
    const exportBtn = document.getElementById("exportBtn");
    if (!exportBtn) return;

    exportBtn.addEventListener("click", () => window.AppData.downloadResults());
  }

  function initHotspots() {
    attachHotspotListeners();
    attachExportButton();
    updateProgress();
    updateLockedVisuals();
  }

  window.AppHotspots = { initHotspots };

})();
