// js/data.js
"use strict";

(function () {
  const participantID = "P" + Math.floor(Math.random() * 100000);

  const sessionData = {
    participantID,
    startTime: new Date().toISOString(),
    events: []
  };

  function addEvent(eventObj) {
    sessionData.events.push(eventObj);
  }

  function downloadResults() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sessionData, null, 2));

    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", participantID + "_results.json");
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  }

  // Expose a small API to other files
  window.AppData = {
    participantID,
    sessionData,
    addEvent,
    downloadResults
  };
})();
