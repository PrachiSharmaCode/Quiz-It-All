export function shuffleQuizOptions(quiz, random = Math.random) {
    if (!Array.isArray(quiz) || quiz.length === 0) {
        throw new Error("Model returned an invalid quiz array.");
    }

    return quiz.map((question) => {
        if (!Array.isArray(question?.options) || question.options.length !== 4 ||
            !question.options.every(option => typeof option === "string" && option.trim()) ||
            !Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
            throw new Error("Model returned invalid options or an invalid answer index.");
        }

        const options = question.options.map((text, originalIndex) => ({ text, originalIndex }));

        // Track original indexes so the correct answer follows its option through the shuffle.
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return {
            ...question,
            options: options.map(option => option.text),
            answer: options.findIndex(option => option.originalIndex === question.answer),
        };
    });
}
