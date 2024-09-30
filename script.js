import { pages } from "./components/pages.js";
import { loadSVG } from "./components/icons.js";

let currentPage = 0;

const answers = {};

const scriptURL =
  "https://script.google.com/macros/s/AKfycbwPJyfEiCSps6ptOoZ7FkS6j9DTKvbak0znj6Z_16eBdnYKAJqqYNenkiZeVA_CJX9U/exec";

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
function resetNextButton(navigationDiv, buttonText = "Далі") {
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

  if (currentPageObj.name === "q3") {
    const answer = answers[currentPageObj.name];
    let nextIndex;
    switch (answer) {
      case "Так, але важко знайти виконавця":
        nextIndex = pages.findIndex((page) => page.name === "q4a");
        break;
      case "Так, але вона поки не потребує виконання":
        nextIndex = pages.findIndex((page) => page.name === "q4b");
        break;
      default:
        nextIndex = pages.findIndex((page) => page.name === "q4с");
        break;
    }

    if (nextIndex === -1) {
      console.error(`Страниця не знайдена`);
      return currentIndex + 1;
    }

    return nextIndex;
  }

  if (currentPageObj.name === "q5bef") {
    const answer = answers[currentPageObj.name];
    let nextIndex;
    switch (answer) {
      case "Ні":
        nextIndex = pages.findIndex((page) => page.name === "q5befno");
        break;
      default:
        nextIndex = pages.findIndex((page) => page.name === "q5");
        break;
    }

    if (nextIndex === -1) {
      console.error(`Страниця не знайдена`);
      return currentIndex + 1;
    }

    return nextIndex;
  }

  if (currentPageObj.name?.startsWith("q4")) {
    return pages.findIndex((page) => page.name === "q5bef");
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
        input.type = "radio";
        input.name = page.name;
        input.value = option;
        input.required = true;

        const isOtherOption = option.startsWith("Інша відповідь:");

        if (isOtherOption) {
          const textInput = document.createElement("input");
          textInput.classList.add("another-option");
          textInput.type = "text";
          textInput.name = `${page.name}_other`;

          if (answers[`${page.name}_other`]) {
            textInput.value = answers[`${page.name}_other`];
          } else {
            textInput.disabled = true;
          }

          textInput.addEventListener("input", (event) => {
            answers[`${page.name}_other`] = event.target.value.trim();
          });

          input.addEventListener("change", () => {
            const allLabels =
              optionsContainer.querySelectorAll(".option-label");
            allLabels.forEach((lbl) => lbl.classList.remove("selected"));
            label.classList.add("selected");

            if (input.checked) {
              textInput.disabled = false;
              textInput.focus();
            } else {
              textInput.disabled = true;
              textInput.value = "";
              delete answers[`${page.name}_other`];
            }
          });

          label.appendChild(input);
          const staticText = option.split(":")[0] + ": ";
          const span = document.createElement("span");
          span.textContent = staticText;
          span.appendChild(textInput);
          label.appendChild(span);
        } else {
          input.addEventListener("change", () => {
            const allLabels =
              optionsContainer.querySelectorAll(".option-label");
            allLabels.forEach((lbl) => lbl.classList.remove("selected"));
            label.classList.add("selected");
          });

          if (answers[page.name] === option) {
            input.checked = true;
            label.classList.add("selected");
          }

          label.appendChild(input);

          const span = document.createElement("span");
          span.textContent = option;

          label.appendChild(span);
        }

        // Vorherige Überprüfung, ob die Option ausgewählt ist
        if (!isOtherOption && answers[page.name] === option) {
          input.checked = true;
          label.classList.add("selected");
        }

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

        const input = document.createElement("textarea");
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
          span.textContent = "З ";

          selectVon = createTimeSelect(`${page.name}_von`);
          const savedVonValue = answers[`${page.name}_von`];
          if (savedVonValue) {
            selectVon.value = savedVonValue;
          }
          span.appendChild(selectVon);

          span.appendChild(document.createTextNode(" до "));

          selectBis = createTimeSelect(`${page.name}_bis`);

          const savedBisValue = answers[`${page.name}_bis`];
          if (savedBisValue) {
            selectBis.value = savedBisValue;
          }
          span.appendChild(selectBis);

          if (answers[page.name] !== option) {
            selectVon.disabled = true;
            selectBis.disabled = true;
          } else {
            selectVon.disabled = false;
            selectBis.disabled = false;
          }
        } else {
          span.textContent = option;

          if (answers[page.name] !== "З ___ до ___") {
            if (selectVon) selectVon.disabled = true;
            if (selectBis) selectBis.disabled = true;
          }
        }

        label.appendChild(span);

        optionsContainer.appendChild(label);
      });

      pageDiv.appendChild(optionsContainer);

      function createTimeSelect(name) {
        const select = document.createElement("select");
        select.classList.add("custom-select");
        select.name = name;
        select.id = name;
        select.required = true;
        console.log(
          `Select "${name}" erstellt. Disabled-Status: ${select.disabled}`
        );

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

        if (answers[name]) {
          select.value = answers[name];
        }

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
        answers[page.name] = slider.value;
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
    resetNextButton(navigationDiv, page.buttonText || "Далі");
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
        let value = selectedOption.value;

        // Überprüfen, ob die ausgewählte Option eine „Інша відповідь“ ist
        if (value.startsWith("Інша відповідь:")) {
          const otherValue = answers[`${current.name}_other`] || "";
          if (otherValue === "") {
            alert("Введіть іншу відповідь");
            return;
          }
          value = otherValue;
        }

        answers[current.name] = value;

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
            return;
          }
        }
      } else {
        alert("Обери одну з відповідей");
        return;
      }
    } else if (current.typeInput === "text") {
      // Iteriere über die optionen und speichere jede Eingabe
      let allFilled = true;
      current.optionen.forEach((option) => {
        const inputName = `${current.name}_${option}`;
        // Suche nach <input> oder <textarea> mit dem entsprechenden Namen
        const inputField = document.querySelector(`[name="${inputName}"]`);
        if (inputField) {
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
  } else if (pages[currentPage]?.name?.startsWith("q4")) {
    currentPage = pages.findIndex((page) => page.name === "q3");
    renderPage(currentPage);
  } else if (pages[currentPage]?.name === "q5") {
    currentPage = pages.findIndex((page) => page.name === "q5bef");
    renderPage(currentPage);
  } else if (pages[currentPage]?.name === "q5bef") {
    const answer = answers["q3"];
    let nextPage = pages.findIndex((page) => page.name === "q4a");
    switch (answer) {
      case "Так, але вона поки не потребує виконання":
        nextPage = pages.findIndex((page) => page.name === "q4b");
        break;
      case "Hi":
        nextPage = pages.findIndex((page) => page.name === "q4c");
        break;
    }
    currentPage = nextPage;
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
        const isOtherOption = page.options.some((option) =>
          option.startsWith("Інша відповідь:")
        );

        if (isOtherOption) {
          if (answers[page.name] && page.options.includes(answers[page.name])) {
            quizAnswers[page.name] = answers[page.name] || "";
          } else if (answers[`${page.name}_other`]) {
            quizAnswers[page.name] = answers[`${page.name}_other`];
          } else {
            quizAnswers[page.name] = "";
          }
        } else {
          quizAnswers[page.name] = answers[page.name] || "";
        }
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
      } else if (page.typeInput === "slider") {
        quizAnswers[page.name] = answers[page.name] || "";
      }
    }
  });

  console.log("Sending quizAnswers:", quizAnswers);

  // Erstellen der URL mit Query-Parametern
  const queryParams = new URLSearchParams(quizAnswers).toString();
  const requestURL = `${scriptURL}?${queryParams}`;

  // Senden der GET-Anfrage ohne zusätzliche Header
  fetch(requestURL, {
    method: "GET",
    // Keine Header setzen
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Fehler beim Absenden der Antworten:", error);
      resultDiv.innerText = "Es gab einen Fehler. Bitte versuche es erneut.";
    });

  const endPageIndex = pages.findIndex((p) => p.type === "end");
  currentPage = endPageIndex;
  renderPage(currentPage);
}

renderPage(currentPage);
