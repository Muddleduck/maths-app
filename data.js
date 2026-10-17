function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}


// Random integer
function randomInt(min, max, allowZero = true) {
    let value;

    do {
        value = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (!allowZero && value === 0);

    return value;
}


// ==============================
// ADDITION
// ==============================

// x + fixed number, with every x from 1-10 exactly once
function addingFixedNumber(fixed) {
    return shuffle(
        Array.from({ length: 10 }, (_, i) => i + 1)
    ).map(x => ({
        question: x + " + " + fixed + " = ?",
        answer: x + fixed
    }));
}


// x + y, x 1-9 and y within a specified range
function addingRestricted(yMin, yMax) {
    const questions = [];

    const xValues = shuffle(
        Array.from({ length: 9 }, (_, i) => i + 1)
    );

    const yValues = shuffle(
        Array.from(
            { length: yMax - yMin + 1 },
            (_, i) => yMin + i
        )
    );

    for (let i = 0; i < 10; i++) {
        const x = xValues[i % xValues.length];
        const y = yValues[i % yValues.length];

        questions.push({
            question: x + " + " + y + " = ?",
            answer: x + y
        });
    }

    return shuffle(questions);
}


// Single digit addition.
// Gives a deliberate mixture of small, medium and large sums.
function singleDigitAddition() {
    const candidates = [];

    for (let x = 0; x <= 9; x++) {
        for (let y = 0; y <= 9; y++) {
            candidates.push({
                question: x + " + " + y + " = ?",
                answer: x + y,
                x,
                y
            });
        }
    }

    const groups = [
        candidates.filter(q => q.answer <= 5),
        candidates.filter(q => q.answer >= 6 && q.answer <= 10),
        candidates.filter(q => q.answer >= 11 && q.answer <= 14),
        candidates.filter(q => q.answer >= 15)
    ];

    const questions = [];

    groups.forEach(group => {
        const shuffled = shuffle(group);
        questions.push(...shuffled.slice(0, 2));
    });

    const used = new Set(
        questions.map(q => q.question)
    );

    const remaining = shuffle(
        candidates.filter(q => !used.has(q.question))
    );

    questions.push(
        ...remaining.slice(0, 10 - questions.length)
    );

    return shuffle(questions).map(({ question, answer }) => ({
        question,
        answer
    }));
}


// ==============================
// MISSING SINGLE DIGIT ADDITION
// ==============================

// Both known numbers are 1-9.
// Missing answer is therefore also 1-9.
// This prevents trivial questions such as:
// 0 + ? = 6
// ? + 0 = 6
// 9 + ? = 9
function missingSingleDigitAddition() {
    const candidates = [];

    for (let x = 1; x <= 9; x++) {
        for (let y = 1; y <= 9; y++) {
            const total = x + y;

            candidates.push({
                question: x + " + ? = " + total,
                answer: y
            });

            candidates.push({
                question: "? + " + x + " = " + total,
                answer: y
            });
        }
    }

    return shuffle(candidates).slice(0, 10);
}


// ==============================
// MIXED ADDITION UP TO 20
// ==============================

// Ordinary addition can contain zero.
// Missing-number formats cannot contain zero.
function mixedAdditionUpTo20() {
    const questions = [];

    while (questions.length < 10) {
        const format = randomInt(1, 4);
        let x, y, total;

        // Ordinary addition
        if (format === 1 || format === 4) {
            x = randomInt(0, 10);
            y = randomInt(0, 10);
            total = x + y;

            if (total <= 20) {
                questions.push({
                    question: x + " + " + y + " = ?",
                    answer: total
                });
            }
        }

        // Missing second number
        else if (format === 2) {
            x = randomInt(1, 10);
            y = randomInt(1, 9);
            total = x + y;

            if (total <= 20) {
                questions.push({
                    question: x + " + ? = " + total,
                    answer: y
                });
            }
        }

        // Missing first number
        else if (format === 3) {
            x = randomInt(1, 10);
            y = randomInt(1, 9);
            total = x + y;

            if (total <= 20) {
                questions.push({
                    question: "? + " + x + " = " + total,
                    answer: y
                });
            }
        }
    }

    return shuffle(questions);
}


// ==============================
// SINGLE DIGIT + TEEN
// ==============================

function singleAndTeenAddition() {
    const candidates = [];

    for (let teen = 10; teen <= 20; teen++) {
        for (let single = 1; single <= 9; single++) {
            if (teen + single < 30) {
                candidates.push({
                    question: teen + " + " + single + " = ?",
                    answer: teen + single
                });
            }
        }
    }

    return shuffle(candidates).slice(0, 10);
}


// ==============================
// MISSING TEENS
// ==============================

function missingTeenAddition() {
    const candidates = [];

    for (let x = 1; x <= 9; x++) {
        for (let total = 10; total <= 28; total++) {
            const missing = total - x;

            if (missing >= 1 && missing <= 20) {
                candidates.push({
                    question: x + " + ? = " + total,
                    answer: missing
                });

                candidates.push({
                    question: "? + " + x + " = " + total,
                    answer: missing
                });
            }
        }
    }

    return shuffle(candidates).slice(0, 10);
}


// ==============================
// MIXED TEEN ADDITION
// ==============================

function mixedTeenAddition() {
    const candidates = [];

    for (let single = 1; single <= 9; single++) {
        for (let teen = 10; teen <= 20; teen++) {
            if (single + teen < 30) {

                candidates.push({
                    question: single + " + " + teen + " = ?",
                    answer: single + teen
                });

                candidates.push({
                    question: teen + " + " + single + " = ?",
                    answer: single + teen
                });

                candidates.push({
                    question: single + " + ? = " + (single + teen),
                    answer: teen
                });

                candidates.push({
                    question: "? + " + single + " = " + (single + teen),
                    answer: teen
                });
            }
        }
    }

    return shuffle(candidates).slice(0, 10);
}


// ==============================
// NUMBER BONDS
// ==============================

function numberBondsTo10() {
    const values = shuffle(
        Array.from({ length: 9 }, (_, i) => i + 1)
    );

    const questions = values.map(x => {
        const missing = 10 - x;

        if (Math.random() < 0.5) {
            return {
                question: "? + " + x + " = 10",
                answer: missing
            };
        }

        return {
            question: x + " + ? = 10",
            answer: missing
        };
    });

    // Add one extra question so there are 10.
    const extra = questions[
        Math.floor(Math.random() * questions.length)
    ];

    return shuffle([...questions, { ...extra }]).slice(0, 10);
}


function numberBondsTo100() {
    const values = shuffle(
        Array.from({ length: 9 }, (_, i) => i + 1)
    );

    const questions = values.map(x => {
        const known = x * 10;
        const missing = 100 - known;

        if (Math.random() < 0.5) {
            return {
                question: "? + " + known + " = 100",
                answer: missing
            };
        }

        return {
            question: known + " + ? = 100",
            answer: missing
        };
    });

    const extra = questions[
        Math.floor(Math.random() * questions.length)
    ];

    return shuffle([...questions, { ...extra }]).slice(0, 10);
}


// ==============================
// MULTIPLICATION CONCEPT
// ==============================

// Five pairs = ten questions.
// Each pair uses the same x:
//
// x + x = 2x
// 2 × x = 2x
//
// x is between 2 and 12.
function multiplicationConcept2() {
    const values = shuffle(
        Array.from({ length: 11 }, (_, i) => i + 2)
    ).slice(0, 5);

    const questions = [];

    values.forEach(x => {
        const answer = x * 2;

        questions.push({
            question: x + " + " + x + " = ?",
            answer: answer
        });

        questions.push({
            question: "2 × " + x + " = ?",
            answer: answer
        });
    });

    return questions;
}


// Five pairs = ten questions.
// Each pair uses the same x:
//
// x + x + x = 3x
// 3 × x = 3x
//
// x is between 2 and 12.
function multiplicationConcept3() {
    const values = shuffle(
        Array.from({ length: 11 }, (_, i) => i + 2)
    ).slice(0, 5);

    const questions = [];

    values.forEach(x => {
        const answer = x * 3;

        questions.push({
            question: x + " + " + x + " + " + x + " = ?",
            answer: answer
        });

        questions.push({
            question: "3 × " + x + " = ?",
            answer: answer
        });
    });

    return questions;
}


// Three complete triplets = nine questions,
// plus one additional first question to keep
// the exercise at the app's standard 10 questions.
//
// Each triplet uses the same x:
//
// x × 2 = ?
// 2x × 2 = ?
// 4 × x = ?
//
// x is between 2 and 12.
function multiplicationConcept4() {
    const values = shuffle(
        Array.from({ length: 11 }, (_, i) => i + 2)
    );

    const questions = [];

    values.slice(0, 3).forEach(x => {
        questions.push({
            question: x + " × 2 = ?",
            answer: x * 2
        });

        questions.push({
            question: (x * 2) + " × 2 = ?",
            answer: x * 4
        });

        questions.push({
            question: "4 × " + x + " = ?",
            answer: x * 4
        });
    });

    // Tenth question
    const x = values[3];

    questions.push({
        question: x + " × 4 = ?",
        answer: x * 4
    });

    return questions;
}


// ==============================
// MULTIPLICATION TABLES
// ==============================

function multiplicationTable(table) {
    const multipliers = shuffle(
        Array.from({ length: 11 }, (_, i) => i + 2)
    ).slice(0, 10);

    return multipliers.map(x => {
        const answer = table * x;

        if (Math.random() < 0.5) {
            return {
                question: table + " × " + x + " = ?",
                answer
            };
        }

        return {
            question: x + " × " + table + " = ?",
            answer
        };
    });
}


function mixedMultiplication(tables) {
    const questions = [];
    const used = new Set();

    while (questions.length < 10) {
        const table = tables[
            Math.floor(Math.random() * tables.length)
        ];

        const x = randomInt(2, 12);
        const key = table + "x" + x;

        if (used.has(key)) continue;

        used.add(key);

        const answer = table * x;

        if (Math.random() < 0.5) {
            questions.push({
                question: table + " × " + x + " = ?",
                answer
            });
        } else {
            questions.push({
                question: x + " × " + table + " = ?",
                answer
            });
        }
    }

    return shuffle(questions);
}


// ==============================
// 50s
// ==============================

function addingIn50s() {
    const values = shuffle(
        Array.from({ length: 10 }, (_, i) => i + 1)
    );

    return values.map(x => ({
        question: (x * 50) + " + 50 = ?",
        answer: (x + 1) * 50
    }));
}


// ==============================
// SUBTRACTION PAIRS
// ==============================

function subtractionPairsLow() {
    const pairs = [];
    const used = new Set();

    while (pairs.length < 5) {
        const x = randomInt(1, 9);
        const y = randomInt(x + 1, 19);
        const key = x + "-" + y;

        if (used.has(key)) continue;

        used.add(key);
        pairs.push([x, y]);
    }

    const questions = [];

    pairs.forEach(([x, y]) => {
        questions.push({
            question: x + " + ? = " + y,
            answer: y - x
        });

        questions.push({
            question: y + " - " + x + " = ?",
            answer: y - x
        });
    });

    return questions;
}


function subtractionPairsTeens() {
    const pairs = [];
    const used = new Set();

    while (pairs.length < 5) {
        const x = randomInt(1, 9);
        const y = randomInt(21, 30);
        const key = x + "-" + y;

        if (used.has(key)) continue;

        used.add(key);
        pairs.push([x, y]);
    }

    const questions = [];

    pairs.forEach(([x, y]) => {
        questions.push({
            question: x + " + ? = " + y,
            answer: y - x
        });

        questions.push({
            question: y + " - " + x + " = ?",
            answer: y - x
        });
    });

    return questions;
}


// ==============================
// EXERCISES
// ==============================

const exercises = [

    {
        id: 0.001,
        title: "Exercise 1",
        skill: "Adding 2",
        questions: addingFixedNumber(2)
    },

    {
        id: 0.002,
        title: "Exercise 2",
        skill: "Adding 3",
        questions: addingFixedNumber(3)
    },

    {
        id: 0.003,
        title: "Exercise 3",
        skill: "Adding 4",
        questions: addingFixedNumber(4)
    },

    {
        id: 0.004,
        title: "Exercise 4",
        skill: "Adding 5",
        questions: addingFixedNumber(5)
    },

    {
        id: 0.005,
        title: "Exercise 5",
        skill: "Adding up to 5",
        questions: addingRestricted(1, 5)
    },

    {
        id: 0.006,
        title: "Exercise 6",
        skill: "Number bonds to 10",
        questions: numberBondsTo10()
    },

    {
        id: 0.007,
        title: "Exercise 7",
        skill: "Adding 6",
        questions: addingFixedNumber(6)
    },

    {
        id: 0.008,
        title: "Exercise 8",
        skill: "Adding 7",
        questions: addingFixedNumber(7)
    },

    {
        id: 0.009,
        title: "Exercise 9",
        skill: "Adding 8",
        questions: addingFixedNumber(8)
    },

    {
        id: 0.010,
        title: "Exercise 10",
        skill: "Adding 9",
        questions: addingFixedNumber(9)
    },

    {
        id: 0.011,
        title: "Exercise 11",
        skill: "Adding up to 9",
        questions: addingRestricted(5, 9)
    },

    {
        id: 0.012,
        title: "Exercise 12",
        skill: "Number bonds to 10",
        questions: numberBondsTo10()
    },

    {
        id: 0.013,
        title: "Exercise 13",
        skill: "Single digit adding",
        questions: singleDigitAddition()
    },

    {
        id: 0.014,
        title: "Exercise 14",
        skill: "Single digit adding 2",
        questions: singleDigitAddition()
    },

    {
        id: 0.015,
        title: "Exercise 15",
        skill: "Missing addition up to 9",
        questions: missingSingleDigitAddition()
    },

    {
        id: 0.016,
        title: "Exercise 16",
        skill: "Missing addition up to 9",
        questions: missingSingleDigitAddition()
    },

    {
        id: 0.017,
        title: "Exercise 17",
        skill: "Mixed addition up to 20",
        questions: mixedAdditionUpTo20()
    },

    {
        id: 0.018,
        title: "Exercise 18",
        skill: "Mixed addition up to 20",
        questions: mixedAdditionUpTo20()
    },

    {
        id: 0.019,
        title: "Exercise 19",
        skill: "Adding single and teen",
        questions: singleAndTeenAddition()
    },

    {
        id: 0.020,
        title: "Exercise 20",
        skill: "Adding single and teen",
        questions: singleAndTeenAddition()
    },

    {
        id: 0.021,
        title: "Exercise 21",
        skill: "Missing teens",
        questions: missingTeenAddition()
    },

    {
        id: 0.022,
        title: "Exercise 22",
        skill: "Missing teens",
        questions: missingTeenAddition()
    },

    {
        id: 0.023,
        title: "Exercise 23",
        skill: "Mixed teen addition",
        questions: mixedTeenAddition()
    },

    {
        id: 0.024,
        title: "Exercise 24",
        skill: "Mixed teen addition",
        questions: mixedTeenAddition()
    },

    {
        id: 0.025,
        title: "Exercise 25",
        skill: "Number bonds to 100",
        questions: numberBondsTo100()
    },

    {
        id: 0.026,
        title: "Exercise 26",
        skill: "Understanding multiplication by 2",
        questions: multiplicationConcept2()
    },

    {
        id: 0.027,
        title: "Exercise 27",
        skill: "Multiplication by 2",
        questions: multiplicationTable(2)
    },

    {
        id: 0.028,
        title: "Exercise 28",
        skill: "Multiplication by 5",
        questions: multiplicationTable(5)
    },

    {
        id: 0.029,
        title: "Exercise 29",
        skill: "Multiplication by 10",
        questions: multiplicationTable(10)
    },

    {
        id: 0.030,
        title: "Exercise 30",
        skill: "Adding in 50s",
        questions: addingIn50s()
    },

    {
        id: 0.031,
        title: "Exercise 31",
        skill: "Subtracting low numbers",
        questions: subtractionPairsLow()
    },

    {
        id: 0.032,
        title: "Exercise 32",
        skill: "Subtracting low numbers",
        questions: subtractionPairsLow()
    },

    {
        id: 0.033,
        title: "Exercise 33",
        skill: "Multiplication by 2, 5 and 10",
        questions: mixedMultiplication([2, 5, 10])
    },

    {
        id: 0.034,
        title: "Exercise 34",
        skill: "Understanding multiplication by 3",
        questions: multiplicationConcept3()
    },

    {
        id: 0.035,
        title: "Exercise 35",
        skill: "Multiplication by 3",
        questions: multiplicationTable(3)
    },

    {
        id: 0.036,
        title: "Exercise 36",
        skill: "Understanding multiplication by 4",
        questions: multiplicationConcept4()
    },

    {
        id: 0.037,
        title: "Exercise 37",
        skill: "Multiplication by 4",
        questions: multiplicationTable(4)
    },

    {
        id: 0.038,
        title: "Exercise 38",
        skill: "Multiplication by 11",
        questions: multiplicationTable(11)
    },

    {
        id: 0.039,
        title: "Exercise 39",
        skill: "Subtracting teens",
        questions: subtractionPairsTeens()
    },

    {
        id: 0.040,
        title: "Exercise 40",
        skill: "Subtracting teens",
        questions: subtractionPairsTeens()
    },

    {
        id: 0.041,
        title: "Exercise 41",
        skill: "Multiplication by 3, 4 and 11",
        questions: mixedMultiplication([3, 4, 11])
    }
];