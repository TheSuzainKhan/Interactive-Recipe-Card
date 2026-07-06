const toggleIngredientsButton = document.getElementById("toggleIngredients");
const toggleStepsButton = document.getElementById("toggleSteps");
const startCookingButton = document.getElementById("startCooking");
const nextStepButton = document.getElementById("nextStep");
const ingredientsPanel = document.getElementById("ingredientsPanel");
const stepsPanel = document.getElementById("stepsPanel");
const steps = Array.from(document.querySelectorAll("#stepsList li"));
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const timerDisplay = document.getElementById("timer");

const totalMinutes = 45;
const totalSeconds = totalMinutes * 60;
let currentStepIndex = -1;
let remainingSeconds = totalSeconds;
let timerId = null;

function formatTime(total) {
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateToggleButton(button, panel, label) {
  const collapsed = panel.classList.contains("is-collapsed");
  button.setAttribute("aria-expanded", String(!collapsed));
  button.textContent = `${collapsed ? "Show" : "Hide"} ${label}`;
}

function togglePanel(panel, button, label) {
  panel.classList.toggle("is-collapsed");
  updateToggleButton(button, panel, label);
}

function updateProgress() {
  const completedSteps = currentStepIndex + 1;
  const progressPercent = completedSteps <= 0 ? 0 : (completedSteps / steps.length) * 100;
  progressFill.style.width = `${progressPercent}%`;

  if (currentStepIndex < 0) {
    progressText.textContent = `Start cooking to guide your way through ${steps.length} steps.`;
    return;
  }

  if (currentStepIndex >= steps.length) {
    progressText.textContent = "Recipe complete. Let the cake cool, frost it, and serve.";
    return;
  }

  progressText.textContent = `Step ${currentStepIndex + 1} of ${steps.length}: ${steps[currentStepIndex].textContent}`;
}

function syncStepStates() {
  steps.forEach((step, index) => {
    step.classList.toggle("active-step", index === currentStepIndex);
    step.classList.toggle("completed-step", index < currentStepIndex);
  });
}

function startTimer() {
  if (timerId) {
    return;
  }

  timerId = window.setInterval(() => {
    if (remainingSeconds <= 0) {
      window.clearInterval(timerId);
      timerId = null;
      timerDisplay.textContent = "00:00";
      return;
    }

    remainingSeconds -= 1;
    timerDisplay.textContent = formatTime(remainingSeconds);
  }, 1000);
}

function advanceToStep(stepIndex) {
  currentStepIndex = stepIndex;
  syncStepStates();
  updateProgress();

  if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
    steps[currentStepIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (currentStepIndex >= steps.length) {
    nextStepButton.disabled = true;
    startCookingButton.disabled = false;
    startCookingButton.textContent = "Cook Again";
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }
}

toggleIngredientsButton.addEventListener("click", () => {
  togglePanel(ingredientsPanel, toggleIngredientsButton, "Ingredients");
});

toggleStepsButton.addEventListener("click", () => {
  togglePanel(stepsPanel, toggleStepsButton, "Steps");
});

startCookingButton.addEventListener("click", () => {
  if (stepsPanel.classList.contains("is-collapsed")) {
    stepsPanel.classList.remove("is-collapsed");
    updateToggleButton(toggleStepsButton, stepsPanel, "Steps");
  }

  steps.forEach((step) => {
    step.classList.remove("active-step", "completed-step");
  });

  remainingSeconds = totalSeconds;
  timerDisplay.textContent = formatTime(remainingSeconds);

  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }

  nextStepButton.disabled = false;
  startCookingButton.textContent = "Restart Cooking";
  advanceToStep(0);
  startTimer();
});

nextStepButton.addEventListener("click", () => {
  if (currentStepIndex < 0) {
    return;
  }

  const nextIndex = currentStepIndex + 1;
  advanceToStep(nextIndex);
});

updateToggleButton(toggleIngredientsButton, ingredientsPanel, "Ingredients");
updateToggleButton(toggleStepsButton, stepsPanel, "Steps");
timerDisplay.textContent = formatTime(remainingSeconds);
updateProgress();
