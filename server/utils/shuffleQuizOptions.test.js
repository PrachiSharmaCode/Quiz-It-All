import test from "node:test";
import assert from "node:assert/strict";
import { shuffleQuizOptions } from "./shuffleQuizOptions.js";

test("preserves the correct answer across all 24 option orders for every starting position", () => {
    for (let answer = 0; answer < 4; answer++) {
        const original = [{ question: "Example?", options: ["One", "Two", "Three", "Four"], answer }];
        const snapshot = JSON.stringify(original);
        const orders = new Set();
        const positions = [0, 0, 0, 0];

        for (let a = 0; a < 4; a++) {
            for (let b = 0; b < 3; b++) {
                for (let c = 0; c < 2; c++) {
                    const values = [(a + 0.5) / 4, (b + 0.5) / 3, (c + 0.5) / 2];
                    const [result] = shuffleQuizOptions(original, () => values.shift());
                    assert.equal(result.options[result.answer], original[0].options[answer]);
                    assert.equal(result.question, original[0].question);
                    assert.deepEqual([...result.options].sort(), [...original[0].options].sort());
                    orders.add(JSON.stringify(result.options));
                    positions[result.answer]++;
                }
            }
        }

        assert.equal(orders.size, 24);
        assert.deepEqual(positions, [6, 6, 6, 6]);
        assert.equal(JSON.stringify(original), snapshot);
    }
});

test("shuffles questions independently while preserving question order", () => {
    const quiz = [
        { question: "First?", options: ["One", "Two", "Three", "Four"], answer: 0 },
        { question: "Second?", options: ["Red", "Blue", "Green", "Yellow"], answer: 0 },
    ];
    const values = [0, 0, 0, 0.99, 0.99, 0.99];
    const result = shuffleQuizOptions(quiz, () => values.shift());
    assert.deepEqual(result.map(q => q.question), ["First?", "Second?"]);
    assert.deepEqual(result.map(q => q.answer), [3, 0]);
    assert.deepEqual(result.map(q => q.options[q.answer]), ["One", "Red"]);
});

test("rejects malformed options and answer indexes", () => {
    for (const quiz of [null, {}, [], [null], [{ options: ["A", "B"], answer: 0 }],
        [{ options: ["A", "B", "C", ""], answer: 0 }],
        [{ options: ["A", "B", "C", null], answer: 0 }]]) {
        assert.throws(() => shuffleQuizOptions(quiz));
    }
    for (const answer of [-1, 4, 0.5, "0", null, undefined]) {
        assert.throws(() => shuffleQuizOptions([{ options: ["A", "B", "C", "D"], answer }]));
    }
});
