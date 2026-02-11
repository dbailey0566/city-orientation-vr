// js/hotspots.js
"use strict";

(function () {
  // Content for each hotspot
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
    const confidence = confidence
