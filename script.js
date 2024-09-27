import { pages } from "./components/pages.js";
import { loadSVG } from "./components/icons.js";

let currentPage = 0;

const answers = {};

const scriptURL =
  "https://script.google.com/macros/s/AKfycbxHwCOOncc28aylchvjT5CtYKLfXizx49GLWXzqhuaOPm42D0bYMTyXOkmW505O9J8c/exec";

const quizContainer = document.getElementById("quiz-container");
const prevBtn = document.getElementById("prevBtn");
const resultDiv = document.getElementById("result");
const background = document.querySelector(".background");

/**
 * Ersetzt die spezielle Syntax \g...g\ durch <span class="highlight">...</span>
 * @param {string} text - Der ursprüngliche Text mit der speziellen Syntax
 * @returns {string} - Der verarbeitete HTML-Text
 */
function highlightText(text) {
  return text.replace(/\\g(.*?)g\\/g, '<span class="highlight">$1</span>');
}

/**
 * Fügt das SVG-Icon in den Button ein.
 * @param {HTMLElement} button - Der Button, in den das Icon eingefügt werden soll.
 * @param {string} iconName - Der Name der SVG-Datei ohne .svg Erweiterung.
 */
async function insertIcon(button, iconName) {
  const svg = await loadSVG(iconName);
  if (svg) {
    button.insertBefore(svg, button.firstChild);
  }
}

/**
 * Setzt den Weiter-Button auf den Standardzustand zurück.
 * @param {HTMLElement} navigationDiv - Das Navigations-Element, in dem der Button enthalten ist.
 * @param {string} [buttonText] - Optionaler Text für den Button. Standard ist "Weiter".
 */
function resetNextButton(navigationDiv, buttonText = "Weiter") {
  const nextBtn = navigationDiv.querySelector("#nextBtn");
  nextBtn.textContent = buttonText;
  nextBtn.style.display = "inline-block";
  nextBtn.disabled = false;
}

/**
 * Setzt den Zurück-Button auf den Standardzustand zurück.
 */
function resetPrevButton() {
  prevBtn.innerHTML = "";

  loadSVG("back").then((svg) => {
    if (svg) {
      prevBtn.appendChild(svg);
    }
  });
}

/**
 * Entfernt die Ja/Nein-Buttons aus der Navigation.
 * @param {HTMLElement} navigationDiv - Das Navigations-Element.
 */
function removeChoiceButtons(navigationDiv) {
  const existingChoiceButtons =
    navigationDiv.querySelectorAll(".choice-nav-button");
  existingChoiceButtons.forEach((btn) => btn.remove());
}

/**
 * Erstellt die Ja/Nein-Buttons im Navigationsbereich.
 * @param {HTMLElement} navigationDiv - Das Navigations-Element.
 */
function createChoiceButtons(navigationDiv) {
  removeChoiceButtons(navigationDiv);

  const jaButton = document.createElement("button");
  jaButton.type = "button";
  jaButton.classList.add("choice-nav-button", "ja-button");
  jaButton.textContent = pages[currentPage].options[0];

  jaButton.addEventListener("click", () => {
    const page = pages[currentPage];
    answers[page.name] = page.options[0];
    if (currentPage < pages.length - 2) {
      currentPage++;
      renderPage(currentPage);
    } else {
      submitAnswers();
    }
  });

  const neinButton = document.createElement("button");
  neinButton.type = "button";
  neinButton.classList.add("choice-nav-button", "nein-button");
  neinButton.textContent = pages[currentPage].options[1];

  neinButton.addEventListener("click", () => {
    const page = pages[currentPage];
    answers[page.name] = page.options[1];
    const endPageIndex = pages.findIndex((p) => p.type === "end");
    if (endPageIndex !== -1) {
      currentPage = endPageIndex;
      renderPage(currentPage);
    } else {
      console.error("Keine Seite vom Typ 'end' gefunden.");
    }
  });

  navigationDiv.appendChild(jaButton);
  navigationDiv.appendChild(neinButton);
}

/**
 * Bestimmt den nächsten Seitenindex basierend auf der aktuellen Seite und den Antworten.
 * @param {number} currentIndex - Der aktuelle Seitenindex.
 * @returns {number} - Der nächste Seitenindex.
 */
function getNextPageIndex(currentIndex) {
  const currentPageObj = pages[currentIndex];

  if (currentPageObj.name === "quiz3") {
    const answer = answers[currentPageObj.name];
    let nextIndex;
    switch (answer) {
      case "Option 1":
        nextIndex = pages.findIndex((page) => page.name === "quiz4a");
        break;
      case "Option 2":
        nextIndex = pages.findIndex((page) => page.name === "quiz4b");
        break;
      case "Option 3":
        nextIndex = pages.findIndex((page) => page.name === "quiz4c");
        break;
      default:
        nextIndex = pages.findIndex((page) => page.name === "quiz4d");
        break;
    }

    if (nextIndex === -1) {
      console.error(
        `Seite mit name 'quiz4${answer.toLowerCase()}' nicht gefunden.`
      );
      return currentIndex + 1;
    }

    return nextIndex;
  }

  if (currentIndex < pages.length - 1) {
    return currentIndex + 1;
  } else {
    return currentIndex;
  }
}

/**
 * Funktion zum Rendern der aktuellen Seite.
 * @param {number} index - Der Index der aktuellen Seite.
 */
async function renderPage(index) {
  background.classList.remove("end");
  background.classList.remove("quiz");

  // Leere nur den quiz-container
  quizContainer.innerHTML = "";
  const page = pages[index];
  console.log(`Rendering page index: ${index}, type: ${page.type}`);

  const pageDiv = document.createElement("div");
  pageDiv.classList.add("page", "active");

  if (page.icon) {
    const iconName = page.icon;
    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon");
    const svg = await loadSVG(iconName);
    if (svg) {
      iconContainer.appendChild(svg);
      pageDiv.appendChild(iconContainer);
    }
  }

  if (page.type === "quiz" && page.name !== "i3") {
    background.classList.add("quiz");
  } else if (page.type === "end") {
    background.classList.add("end");
  }

  if (page.type === "quiz") {
    const questionText = document.createElement("p");
    questionText.innerHTML = highlightText(page.question);
    pageDiv.appendChild(questionText);

    if (page.typeInput === "radio") {
      const optionsContainer = document.createElement("div");
      optionsContainer.classList.add("options-container");

      page.options.forEach((option) => {
        const label = document.createElement("label");
        label.classList.add("option-label");
        const input = document.createElement("input");
        input.type = page.typeInput;
        input.name = page.name;
        input.value = option;
        input.required = true;

        if (answers[page.name] === option) {
          input.checked = true;
          label.classList.add("selected");
        }

        label.appendChild(input);

        const span = document.createElement("span");
        span.textContent = option;
        label.appendChild(span);

        label.addEventListener("click", () => {
          const allLabels = optionsContainer.querySelectorAll(".option-label");
          allLabels.forEach((lbl) => lbl.classList.remove("selected"));
          label.classList.add("selected");
        });

        optionsContainer.appendChild(label);
      });

      pageDiv.appendChild(optionsContainer);
    } else if (page.typeInput === "text") {
      const optionsContainer = document.createElement("div");
      optionsContainer.classList.add("options-container");

      page.optionen.forEach((option) => {
        const fieldDiv = document.createElement("div");
        fieldDiv.classList.add("input-field");

        const label = document.createElement("label");
        label.setAttribute("for", `${page.name}_${option}`);
        label.textContent = option + ": ";

        const input = document.createElement("input");
        input.type = page.typeInput;
        input.name = `${page.name}_${option}`;
        input.id = `${page.name}_${option}`;
        input.value = answers[`${page.name}_${option}`] || "";
        input.required = true;
        input.placeholder = page.placeholder || `Введіть текст...`;

        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        optionsContainer.appendChild(fieldDiv);
      });

      pageDiv.appendChild(optionsContainer);
    } else if (page.typeInput === "arbeitszeiten") {
      // Gemeinsamer div-Container für die Optionen
      const optionsContainer = document.createElement("div");
      optionsContainer.classList.add("options-container"); // Verwende dieselbe Klasse

      // Variablen für die Zeitfelder außerhalb der Schleife deklarieren
      let selectVon, selectBis;

      // Erstellt zwei Optionen: "Ich will arbeiten von ___ bis ___" und "Ich habe flexible Arbeitszeiten"
      page.optionen.forEach((option, index) => {
        const label = document.createElement("label");
        label.classList.add("option-label");

        const input = document.createElement("input");
        input.type = "radio"; // Radio-Button
        input.name = page.name;
        input.value = option;
        input.required = true;

        // Event Listener für den Radio-Button
        input.addEventListener("change", () => {
          if (input.checked) {
            const allLabels =
              optionsContainer.querySelectorAll(".option-label");
            allLabels.forEach((lbl) => lbl.classList.remove("selected"));
            label.classList.add("selected");

            // Aktiviere oder deaktiviere die Zeitfelder basierend auf der Auswahl
            if (option === "З ___ до ___") {
              if (selectVon) selectVon.disabled = false;
              if (selectBis) selectBis.disabled = false;
            } else {
              if (selectVon) selectVon.disabled = true;
              if (selectBis) selectBis.disabled = true;
            }
          }
        });

        if (answers[page.name] === option) {
          input.checked = true;
          label.classList.add("selected"); // Setze 'selected' Klasse, wenn bereits ausgewählt
        }

        label.appendChild(input);

        const span = document.createElement("span");

        if (option === "З ___ до ___") {
          console.log("HIIII");
          // Erstelle das Label mit den Zeitfeldern direkt darin
          span.textContent = "З ";

          // Erstelle 'von' Select-Element
          selectVon = createTimeSelect(`${page.name}_von`);
          // Setze den gespeicherten Wert, falls vorhanden
          const savedVonValue = answers[`${page.name}_von`];
          if (savedVonValue) {
            selectVon.value = savedVonValue;
          }
          span.appendChild(selectVon);

          span.appendChild(document.createTextNode(" до "));

          // Erstelle 'bis' Select-Element
          selectBis = createTimeSelect(`${page.name}_bis`);

          // Setze den gespeicherten Wert, falls vorhanden
          const savedBisValue = answers[`${page.name}_bis`];
          if (savedBisValue) {
            selectBis.value = savedBisValue;
          }
          span.appendChild(selectBis);

          // Disable the time selects if this option is not selected
          if (answers[page.name] !== option) {
            selectVon.disabled = true;
            selectBis.disabled = true;
          } else {
            selectVon.disabled = false;
            selectBis.disabled = false;
          }
        } else {
          // Für andere Optionen
          span.textContent = option;

          // Deaktiviere die Zeitfelder, falls eine andere Option ausgewählt ist
          if (answers[page.name] !== "З ___ до ___") {
            if (selectVon) selectVon.disabled = true;
            if (selectBis) selectBis.disabled = true;
          }
        }

        label.appendChild(span);

        // Füge das Label dem optionsContainer hinzu
        optionsContainer.appendChild(label);
      });

      // Füge den optionsContainer dem pageDiv hinzu
      pageDiv.appendChild(optionsContainer);

      // Hilfsfunktion zum Erstellen der Zeitfelder
      function createTimeSelect(name) {
        const select = document.createElement("select");
        select.classList.add("custom-select");
        select.name = name;
        select.id = name;
        select.required = true;
        console.log(
          `Select "${name}" erstellt. Disabled-Status: ${select.disabled}`
        );

        // Optionen von 00:00 bis 23:30 in 30-Minuten-Intervallen
        for (let hour = 0; hour < 24; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const time = `${String(hour).padStart(2, "0")}:${String(
              minute
            ).padStart(2, "0")}`;
            const optionElem = document.createElement("option");
            optionElem.value = time;
            optionElem.textContent = time;
            select.appendChild(optionElem);
          }
        }

        // Setze den gespeicherten Wert, falls vorhanden
        if (answers[name]) {
          select.value = answers[name];
        }

        // Event-Listener hinzufügen
        select.addEventListener("change", (event) => {
          console.log(`Select ${name} geändert zu: ${event.target.value}`);
          answers[name] = event.target.value;
        });

        return select;
      }
    } else if (page.typeInput === "slider") {
      const sliderSection = document.createElement("div");
      sliderSection.classList.add("slider-container");

      const amountFrequencyContainer = document.createElement("div");
      amountFrequencyContainer.classList.add("amount-frequency-container");

      const amountDisplay = document.createElement("div");
      amountDisplay.classList.add("amount-display");
      const unit = page.unit || "";

      const slider = document.createElement("input");
      slider.type = "range";
      slider.name = page.name;
      slider.min = page.min || 0;
      slider.max = page.max || 100;
      slider.step = page.step || 1;
      slider.value = answers[page.name] || page.min || 0;

      amountDisplay.textContent = `${slider.value}${unit}`;

      const frequencySelect = document.createElement("select");
      frequencySelect.name = `${page.name}_frequency`;
      frequencySelect.classList.add("frequency-select");

      const frequencies = ["одноразово", "щодня", "щотижня", "щомісяця"];
      frequencies.forEach((freq) => {
        const option = document.createElement("option");
        option.value = freq;
        option.textContent = freq;
        frequencySelect.appendChild(option);
      });

      if (answers[frequencySelect.name]) {
        frequencySelect.value = answers[frequencySelect.name];
      }

      slider.addEventListener("input", () => {
        amountDisplay.textContent = `${slider.value}${unit}`;
        setBackgroundSize(slider);
      });

      function setBackgroundSize(input) {
        const size = getBackgroundSize(input);
        input.style.setProperty("--background-size", `${size}%`);
      }

      function getBackgroundSize(input) {
        const min = +input.min || 0;
        const max = +input.max || 100;
        const value = +input.value;
        return ((value - min) / (max - min)) * 100;
      }

      setBackgroundSize(slider);

      amountFrequencyContainer.appendChild(amountDisplay);
      amountFrequencyContainer.appendChild(frequencySelect);

      sliderSection.appendChild(amountFrequencyContainer);
      sliderSection.appendChild(slider);

      pageDiv.appendChild(sliderSection);
    }
  } else if (page.type === "info") {
    const infoText = document.createElement("p");
    infoText.innerHTML = highlightText(page.text);
    pageDiv.appendChild(infoText);
  } else if (page.type === "choice") {
    const questionText = document.createElement("p");
    questionText.innerHTML = highlightText(page.question);
    pageDiv.appendChild(questionText);
  } else if (page.type === "end") {
    const endText = document.createElement("p");
    endText.innerHTML = highlightText(page.text);
    pageDiv.appendChild(endText);
  }

  const navigationDiv = document.createElement("div");
  navigationDiv.classList.add("navigation");

  const nextBtn = document.createElement("button");
  nextBtn.id = "nextBtn";
  nextBtn.textContent =
    page.type !== "end" ? page.buttonText || "Далі" : "Відправити";

  navigationDiv.appendChild(nextBtn);

  quizContainer.appendChild(pageDiv);

  quizContainer.appendChild(navigationDiv);

  prevBtn.disabled = index === 0;

  if (page.type === "choice") {
    createChoiceButtons(navigationDiv);
    nextBtn.style.display = "none";
    console.log("Choice page: Hiding nextBtn");
  } else if (page.type === "end") {
    nextBtn.style.display = "none";
    console.log("End page: Hiding nextBtn");
  } else {
    removeChoiceButtons(navigationDiv);
    resetNextButton(navigationDiv, page.buttonText || "Weiter");
    console.log("Displaying nextBtn with text:", nextBtn.textContent);
  }

  resetPrevButton();

  // Event-Listener für den "Weiter"-Button innerhalb der Seite hinzufügen
  nextBtn.addEventListener("click", () => {
    handleNextButtonClick();
  });
}

/**
 * Funktion zur Handhabung des Klicks auf den "Weiter"-Button
 */
function handleNextButtonClick() {
  const current = pages[currentPage];

  if (current.type === "end") {
    return;
  }

  if (current.type === "quiz") {
    if (
      current.typeInput === "radio" ||
      current.typeInput === "arbeitszeiten"
    ) {
      const selectedOption = document.querySelector(
        `input[name="${current.name}"]:checked`
      );
      if (selectedOption) {
        answers[current.name] = selectedOption.value;

        if (
          current.typeInput === "arbeitszeiten" &&
          selectedOption.value === "З ___ до ___"
        ) {
          // Erfasse die Zeiten
          const vonSelect = document.querySelector(
            `select[name="${current.name}_von"]`
          );
          const bisSelect = document.querySelector(
            `select[name="${current.name}_bis"]`
          );

          if (
            vonSelect &&
            bisSelect &&
            !vonSelect.disabled &&
            !bisSelect.disabled
          ) {
            answers[`${current.name}_von`] = vonSelect.value;
            answers[`${current.name}_bis`] = bisSelect.value;
          } else {
            alert("Bitte wähle gültige Zeiten aus.");
            return;
          }
        }
      } else {
        alert("Bitte wähle eine Antwort aus.");
        return;
      }
    } else if (current.typeInput === "text") {
      // Iteriere über die optionen und speichere jede Eingabe
      let allFilled = true;
      current.optionen.forEach((option) => {
        const inputName = `${current.name}_${option}`;
        const inputField = document.querySelector(`input[name="${inputName}"]`);
        if (inputField && inputField.value.trim() !== "") {
          answers[inputName] = inputField.value.trim();
        } else {
          allFilled = false;
        }
      });

      if (!allFilled) {
        alert("Bitte fülle alle Felder aus.");
        return;
      }
    } else if (current.typeInput === "arbeitszeiten") {
      const selectedOption = document.querySelector(
        `input[name="${current.name}"]:checked`
      );
      if (selectedOption) {
        answers[current.name] = selectedOption.value;
        if (selectedOption.value === "З ___ до ___") {
          const vonSelect = document.querySelector(
            `select[name="${current.name}_von"]`
          );
          const bisSelect = document.querySelector(
            `select[name="${current.name}_bis"]`
          );

          if (
            vonSelect &&
            bisSelect &&
            !vonSelect.disabled &&
            !bisSelect.disabled
          ) {
            answers[`${current.name}_von`] = vonSelect.value;
            answers[`${current.name}_bis`] = bisSelect.value;
          } else {
            alert("Bitte wähle gültige Zeiten aus.");
            return;
          }
        }
      } else {
        alert("Bitte wähle eine Antwort aus.");
        return;
      }
    }
  }

  // Bestimme den nächsten Seitenindex
  const nextPageIndex = getNextPageIndex(currentPage);

  const nextPage = pages[nextPageIndex];
  if (nextPage.type === "end") {
    submitAnswers();
    return;
  }

  currentPage = nextPageIndex;
  renderPage(currentPage);
}

/**
 * Navigation: Zurück
 */
prevBtn.addEventListener("click", () => {
  const current = pages[currentPage];
  if (current.type === "end") {
    currentPage = 0;
    renderPage(currentPage);
  } else if (currentPage > 0) {
    currentPage--;
    renderPage(currentPage);
  }
});

/**
 * Antworten absenden an Google Sheets
 */
function submitAnswers() {
  const quizAnswers = {};
  pages.forEach((page) => {
    if (page.type === "quiz" || page.type === "choice") {
      if (page.typeInput === "radio") {
        quizAnswers[page.name] = answers[page.name] || "";
      } else if (page.typeInput === "text") {
        if (page.optionen && Array.isArray(page.optionen)) {
          page.optionen.forEach((option) => {
            const key = `${page.name}_${option}`;
            quizAnswers[key] = answers[key] || "";
          });
        }
      } else if (page.typeInput === "arbeitszeiten") {
        quizAnswers[page.name] = answers[page.name] || "";
        if (answers[page.name] === "З ___ до ___") {
          quizAnswers[`${page.name}_von`] = answers[`${page.name}_von`] || "";
          quizAnswers[`${page.name}_bis`] = answers[`${page.name}_bis`] || "";
        }
      }
    }
  });

  console.log(quizAnswers);

  fetch(scriptURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizAnswers),
  })
    .then(() => {
      const endPageIndex = pages.findIndex((p) => p.type === "end");
      if (endPageIndex !== -1) {
        currentPage = endPageIndex;
        renderPage(currentPage);
      } else {
        resultDiv.innerText = "Danke für deine Teilnahme!";
        quizContainer.innerHTML = ""; // Nur den Quiz-Inhalt leeren
        // Da die Navigation jetzt Teil jeder Seite ist, musst du hier nichts mehr ausblenden
      }
    })
    .catch((error) => {
      console.error("Fehler:", error);
      resultDiv.innerText = "Es gab einen Fehler. Bitte versuche es erneut.";
    });
}

renderPage(currentPage);
