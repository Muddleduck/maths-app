const menu = document.getElementById("menu");
const exerciseScreen = document.getElementById("exercise-screen");
const parentScreen = document.getElementById("parent-screen");
const userScreen = document.getElementById("user-screen");

const exerciseList = document.getElementById("exercise-list");

const answerBox = document.getElementById("answer");
const submitButton = document.getElementById("submit");
const backButton = document.getElementById("back-button");

const parentButton = document.getElementById("parent-button");
const parentBackButton = document.getElementById("parent-back-button");

const resetTodayButton = document.getElementById("reset-today-button");
const resetExerciseSelect = document.getElementById("reset-exercise-select");
const resetExerciseButton = document.getElementById("reset-exercise-button");

const unlimitedButton = document.getElementById("unlimited-button");

const changeUserButton = document.getElementById("change-user-button");

const keypad = document.querySelector(".keypad");


// ==========================================
// USERS
// ==========================================

const USERS = ["WMM", "MNM", "LRM"];

function exerciseUser(exercise) {
    const id = String(exercise.id);

    if (!id.includes(".")) {
        return null;
    }

    const prefix = id.split(".")[0];

    if (prefix === "0") return "LRM";
    if (prefix === "1") return "WMM";
    if (prefix === "2") return "MNM";

    return null;
}

function exerciseAvailableToCurrentUser(exercise) {
    return exerciseUser(exercise) === currentUser;
}

function displayMenu() {
    exerciseList.innerHTML = "";

    exercises
        .filter(exercise => exerciseAvailableToCurrentUser(exercise))
        .forEach(exercise => {
            const button = document.createElement("button");

            button.textContent = exercise.title;

            const savedProgress =
                localStorage.getItem(storageKey(exercise.id));

            if (savedProgress) {
                const saved = JSON.parse(savedProgress);

                if (isExerciseComplete(saved)) {
                    button.classList.add("exercise-complete");
                    button.textContent =
                        "✓ " + exercise.title;
                }

                else if (
                    !unlimitedAnswers() &&
                    isExerciseDoneForToday(saved)
                ) {
                    button.classList.add(
                        "exercise-done-today"
                    );
                }
            }

            button.addEventListener("click", () => {
                startExercise(exercise);
            });

            exerciseList.appendChild(button);
        });
}


function exerciseAvailableToCurrentUser(exercise) {
    return exerciseUser(exercise) === currentUser;
}

let currentUser = localStorage.getItem("maths-app-current-user");


// ==========================================
// TIMER
// ==========================================

const timerModal = document.getElementById("timer-modal");
const timerYes = document.getElementById("timer-yes");
const timerNo = document.getElementById("timer-no");

let timerInterval = null;
let timerRunning = false;
let timerStoppedByUser = false;

let activeSeconds = 0;
let lastActivityTime = null;


// Start or resume the timer
function startTimer() {
    if (timerStoppedByUser) return;

    if (timerRunning) return;

    timerRunning = true;
    lastActivityTime = Date.now();

    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
}


// Record activity from a keypad selection
function timerActivity() {
    if (timerStoppedByUser) return;

    const now = Date.now();

    // If this is the first activity, start the timer.
    if (!timerRunning) {
        startTimer();
        return;
    }

    // Resume after a pause.
    lastActivityTime = now;
}


// Timer is checked once per second.
function updateTimer() {
    if (!timerRunning || !lastActivityTime) return;

    const now = Date.now();
    const inactiveSeconds =
        (now - lastActivityTime) / 1000;

    // Two minutes of inactivity:
    // completely reset the current 10-minute period.
    if (inactiveSeconds >= 120) {
        activeSeconds = 0;
        timerRunning = false;
        lastActivityTime = null;
        return;
    }

    // Thirty seconds of inactivity:
    // pause the timer but retain accumulated time.
    if (inactiveSeconds >= 30) {
        timerRunning = false;
        return;
    }

    // Active time has passed since the last check.
    activeSeconds++;

    lastActivityTime = now;

    // Ten active minutes reached.
    if (activeSeconds >= 600) {
        timerRunning = false;
        lastActivityTime = null;
        showTimerPopup();
    }
}


function showTimerPopup() {
    timerModal.style.display = "flex";
}


function hideTimerPopup() {
    timerModal.style.display = "none";
}


function resetTimerBlock() {
    activeSeconds = 0;
    timerRunning = false;
    lastActivityTime = null;
}


// Yes: start a completely new 10-minute period.
timerYes.addEventListener("click", () => {
    hideTimerPopup();

    timerStoppedByUser = false;
    resetTimerBlock();
    startTimer();
});


// No: stop the timer for this practice session.
timerNo.addEventListener("click", () => {
    hideTimerPopup();

    timerStoppedByUser = true;
    resetTimerBlock();
});


// ==========================================
// DAILY / PARENT
// ==========================================

function getToday() {
    const now = new Date();

    return now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");
}


function unlimitedAnswers() {
    return localStorage.getItem("maths-app-unlimited") === "true";
}


function attemptedToday(question) {
    if (unlimitedAnswers()) return false;

    return question.lastAttemptDate === getToday();
}


function hasQuestionsAvailableToday(progress) {
    return progress.some(question =>
        !question.complete &&
        !attemptedToday(question)
    );
}


function isExerciseComplete(progress) {
    return progress.every(question =>
        question.complete
    );
}


function isExerciseDoneForToday(progress) {
    return progress.every(question =>
        question.complete ||
        attemptedToday(question)
    );
}


// ==========================================
// STORAGE
// ==========================================

function storageKey(exerciseId) {
    return "maths-app-" +
        currentUser +
        "-exercise-" +
        exerciseId;
}

// ==========================================
// MENU
// ==========================================

function displayMenu() {
    exerciseList.innerHTML = "";

    exercises
        .filter(exercise => exerciseAvailableToCurrentUser(exercise))
        .forEach(exercise => {
            const button = document.createElement("button");

        button.textContent = exercise.title;

        const savedProgress =
            localStorage.getItem(storageKey(exercise.id));

        if (savedProgress) {
            const saved = JSON.parse(savedProgress);

            if (isExerciseComplete(saved)) {
                button.classList.add("exercise-complete");
                button.textContent =
                    "✓ " + exercise.title;
            }

            else if (
                !unlimitedAnswers() &&
                isExerciseDoneForToday(saved)
            ) {
                button.classList.add(
                    "exercise-done-today"
                );
            }
        }

        button.addEventListener("click", () => {
            startExercise(exercise);
        });

        exerciseList.appendChild(button);
    });
}


// ==========================================
// START EXERCISE
// ==========================================

function startExercise(exercise) {
    currentExercise = exercise;

    const key = storageKey(exercise.id);
    const savedProgress = localStorage.getItem(key);

    if (savedProgress) {
        progress = JSON.parse(savedProgress);
    }

    else {
        progress = exercise.questions.map(question => ({
            ...question,
            marks: [],
            streak: 0,
            complete: false,
            lastAttemptDate: null,
            wrongAnswer: null,
            wrongAnswerDate: null
        }));
    }

    // Remove old answer reveals when a new day begins.
    const today = getToday();

    progress.forEach(question => {
        if (
            question.wrongAnswerDate &&
            question.wrongAnswerDate !== today
        ) {
            question.wrongAnswer = null;
            question.wrongAnswerDate = null;
        }
    });

    localStorage.setItem(
        key,
        JSON.stringify(progress)
    );

    document.getElementById("skill-title").textContent =
        exercise.skill;

    document.getElementById("exercise-title").textContent =
        exercise.title;

    menu.style.display = "none";
    parentScreen.style.display = "none";
    userScreen.style.display = "none";
    exerciseScreen.style.display = "block";

    answerBox.style.display = "";
    submitButton.style.display = "";
    keypad.style.display = "";

    // A new exercise session can use the timer again.
    timerStoppedByUser = false;
    resetTimerBlock();

    if (isExerciseComplete(progress)) {
        displayQuestions();
        showFinishedMessage("Complete!");
        return;
    }

    if (!hasQuestionsAvailableToday(progress)) {
        displayQuestions();
        showFinishedMessage("Done for today");
        return;
    }

    currentQuestion = progress.findIndex(question =>
        !question.complete &&
        !attemptedToday(question)
    );

    displayQuestions();
}


// ==========================================
// FINISHED
// ==========================================

function showFinishedMessage(message) {
    const questionElement =
        document.getElementById("question");

    questionElement.textContent = message;
    questionElement.classList.add("complete-message");

    answerBox.style.display = "none";
    submitButton.style.display = "none";
    keypad.style.display = "none";
}


// ==========================================
// DISPLAY QUESTIONS
// ==========================================

function displayQuestions() {
    const questionsContainer =
        document.getElementById("questions");

    const questionElement =
        document.getElementById("question");

    questionElement.classList.remove(
        "complete-message"
    );

    questionsContainer.innerHTML = "";

    const today = getToday();

    progress.forEach((item, index) => {
        const row = document.createElement("div");

        row.className = "question-row";

        if (item.complete) {
            row.classList.add("complete");
        }

        const marks = item.marks
            .map(mark =>
                mark === "correct"
                    ? "✓"
                    : "•"
            )
            .join(" ");

        const questionText =
            document.createElement("span");

        questionText.textContent = item.question;

        const marksText =
            document.createElement("span");

        marksText.className = "marks";
        marksText.textContent = marks;

        const leftSide =
            document.createElement("span");

        leftSide.appendChild(questionText);

        // Show the answer after a wrong answer,
        // but only on the day it was given.
        if (
            item.wrongAnswer !== null &&
            item.wrongAnswerDate === today
        ) {
            const answerReveal =
                document.createElement("span");

            answerReveal.className =
                "answer-reveal";

            answerReveal.textContent =
                "Answer: " + item.wrongAnswer;

            leftSide.appendChild(answerReveal);
        }

        row.appendChild(leftSide);
        row.appendChild(marksText);

        questionsContainer.appendChild(row);
    });

    if (
        progress.length > 0 &&
        currentQuestion >= 0 &&
        currentQuestion < progress.length
    ) {
        questionElement.textContent =
            progress[currentQuestion].question;
    }
}


// ==========================================
// KEYPAD
// ==========================================

document.querySelectorAll(
    ".keypad button"
).forEach(button => {

    button.addEventListener("click", () => {

        // Every keypad selection is activity.
        timerActivity();

        const value = button.textContent;

        if (value === "C") {
            answerBox.value = "";
        }

        else if (value === "←") {
            answerBox.value =
                answerBox.value.slice(0, -1);
        }

        else {
            answerBox.value += value;
        }
    });
});


// ==========================================
// SUBMIT
// ==========================================

submitButton.addEventListener("click", () => {

    // Submit also counts as activity.
    timerActivity();

    if (answerBox.value === "") return;

    const answer = Number(answerBox.value);
    const question = progress[currentQuestion];

    const today = getToday();

    question.lastAttemptDate = today;

    if (answer === question.answer) {

        question.marks.push("correct");

        question.streak++;

        // A correct answer clears any previous
        // wrong-answer display.
        question.wrongAnswer = null;
        question.wrongAnswerDate = null;

        if (question.streak === 3) {
            question.complete = true;
        }
    }

    else {

        question.marks.push("wrong");

        question.streak = 0;

        // Store the correct answer so it can be
        // displayed for the rest of today.
        question.wrongAnswer = question.answer;
        question.wrongAnswerDate = today;
    }

    localStorage.setItem(
        storageKey(currentExercise.id),
        JSON.stringify(progress)
    );

    answerBox.value = "";

    if (isExerciseComplete(progress)) {
        displayQuestions();
        showFinishedMessage("Complete!");
        return;
    }

    if (!hasQuestionsAvailableToday(progress)) {
        displayQuestions();
        showFinishedMessage("Done for today");
        return;
    }

    let nextQuestion = currentQuestion + 1;

    while (
        nextQuestion < progress.length &&
        (
            progress[nextQuestion].complete ||
            attemptedToday(progress[nextQuestion])
        )
    ) {
        nextQuestion++;
    }

    if (nextQuestion >= progress.length) {
        nextQuestion = 0;

        while (
            nextQuestion < progress.length &&
            (
                progress[nextQuestion].complete ||
                attemptedToday(progress[nextQuestion])
            )
        ) {
            nextQuestion++;
        }
    }

    currentQuestion = nextQuestion;

    displayQuestions();
});


// ==========================================
// BACK
// ==========================================

backButton.addEventListener("click", () => {

    resetTimerBlock();
    timerStoppedByUser = false;

    exerciseScreen.style.display = "none";
    menu.style.display = "block";

    displayMenu();
});


// ==========================================
// CHANGE USER
// ==========================================

changeUserButton.addEventListener("click", () => {

    resetTimerBlock();
    timerStoppedByUser = false;

    exerciseScreen.style.display = "none";
    parentScreen.style.display = "none";
    menu.style.display = "none";

    userScreen.style.display = "block";
});


// ==========================================
// USER SELECTION
// ==========================================

document.querySelectorAll(
    "#user-list button"
).forEach(button => {

    button.addEventListener("click", () => {

        currentUser =
            button.dataset.user;

        localStorage.setItem(
            "maths-app-current-user",
            currentUser
        );

        userScreen.style.display = "none";
        parentScreen.style.display = "none";
        exerciseScreen.style.display = "none";
        menu.style.display = "block";

        displayMenu();
    });
});


// ==========================================
// PARENT
// ==========================================

parentButton.addEventListener("click", () => {

    menu.style.display = "none";
    exerciseScreen.style.display = "none";
    userScreen.style.display = "none";
    parentScreen.style.display = "block";

    populateExerciseSelect();
    populateParentUserSelect();
    updateUnlimitedButton();
});


parentBackButton.addEventListener("click", () => {

    parentScreen.style.display = "none";
    menu.style.display = "block";

    displayMenu();
});


// ==========================================
// PARENT USER SELECT
// ==========================================

function populateParentUserSelect() {

    let userSelect =
        document.getElementById(
            "parent-user-select"
        );

    if (!userSelect) return;

    userSelect.innerHTML = "";

    USERS.forEach(user => {

        const option =
            document.createElement("option");

        option.value = user;
        option.textContent = user;

        userSelect.appendChild(option);
    });
}

document.getElementById(
    "parent-user-select"
    ).addEventListener("change", () => {

    populateExerciseSelect();
});

// ==========================================
// EXERCISE SELECT
// ==========================================

function populateExerciseSelect() {

    resetExerciseSelect.innerHTML = "";

    exercises.forEach(exercise => {

        const option =
            document.createElement("option");

        option.value = exercise.id;
        option.textContent = exercise.title;

        resetExerciseSelect.appendChild(option);
    });
}


// ==========================================
// RESET TODAY
// ==========================================

resetTodayButton.addEventListener("click", () => {

    const userSelect =
        document.getElementById(
            "parent-user-select"
        );

    const selectedUser =
        userSelect ? userSelect.value : currentUser;

    const confirmed = confirm(
        "Reset today's progress for " +
        selectedUser +
        "?\n\n" +
        "This will make today's questions " +
        "available again, but will keep all " +
        "marks, streaks and mastery."
    );

    if (!confirmed) return;

    const today = getToday();

    exercises.forEach(exercise => {

        const key =
            "maths-app-" +
            selectedUser +
            "-exercise-" +
            exercise.id;

        const savedProgress =
            localStorage.getItem(key);

        if (!savedProgress) return;

        const saved =
            JSON.parse(savedProgress);

        saved.forEach(question => {

            if (question.lastAttemptDate === today) {
                question.lastAttemptDate = null;
            }
        });

        localStorage.setItem(
            key,
            JSON.stringify(saved)
        );
    });

    alert(
        "Today's progress for " +
        selectedUser +
        " has been reset."
    );

    displayMenu();
});


// ==========================================
// RESET ENTIRE EXERCISE
// ==========================================

resetExerciseButton.addEventListener("click", () => {

    const userSelect =
        document.getElementById(
            "parent-user-select"
        );

    const selectedUser =
        userSelect ? userSelect.value : currentUser;

    function populateExerciseSelect() {

    const userSelect =
        document.getElementById("parent-user-select");

    const selectedUser =
        userSelect ? userSelect.value : currentUser;

    resetExerciseSelect.innerHTML = "";

    exercises
        .filter(exercise => {
            return exerciseUser(exercise) === selectedUser;
        })
        .forEach(exercise => {

            const option =
                document.createElement("option");

            option.value = exercise.id;
            option.textContent = exercise.title;

            resetExerciseSelect.appendChild(option);
        });
}

    const exercise =
        exercises.find(
            item => item.id === exerciseId
        );

    if (!exercise) return;

    const confirmed = confirm(
        "Reset " +
        exercise.title +
        " for " +
        selectedUser +
        "?\n\n" +
        "This will permanently remove all " +
        "progress for this exercise for " +
        selectedUser +
        "."
    );

    if (!confirmed) return;

    const key =
        "maths-app-" +
        selectedUser +
        "-exercise-" +
        exercise.id;

    localStorage.removeItem(key);

    alert(
        exercise.title +
        " for " +
        selectedUser +
        " has been completely reset."
    );

    displayMenu();
});


// ==========================================
// UNLIMITED ANSWERS
// ==========================================

function updateUnlimitedButton() {

    if (unlimitedAnswers()) {
        unlimitedButton.textContent =
            "Unlimited answers: ON";
    }

    else {
        unlimitedButton.textContent =
            "Unlimited answers: OFF";
    }
}


unlimitedButton.addEventListener("click", () => {

    if (unlimitedAnswers()) {

        localStorage.setItem(
            "maths-app-unlimited",
            "false"
        );
    }

    else {

        localStorage.setItem(
            "maths-app-unlimited",
            "true"
        );
    }

    updateUnlimitedButton();
});


// ==========================================
// STARTUP
// ==========================================

if (currentUser && USERS.includes(currentUser)) {

    userScreen.style.display = "none";
    menu.style.display = "block";
    exerciseScreen.style.display = "none";
    parentScreen.style.display = "none";

    displayMenu();

} else {

    currentUser = null;

    userScreen.style.display = "block";
    menu.style.display = "none";
    exerciseScreen.style.display = "none";
    parentScreen.style.display = "none";
}