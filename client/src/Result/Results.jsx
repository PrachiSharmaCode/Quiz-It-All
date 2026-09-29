import React, { useEffect, useRef } from 'react';
import './results.css';
import ShowCard from './ShowCard';

const Results = ({ quizData, selectedOptions, onRetry, onNewQuiz }) => {
    const headingRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        headingRef.current?.focus({ preventScroll: true });
    }, []);

    const total = quizData.length;
    let score = 0;

    const cards = quizData.map((q, idx) => {
        const correctAnswer = q.options[q.answer];
        const userAnswer = selectedOptions && selectedOptions[idx] ? selectedOptions[idx] : null;
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) score += 1;
        return (
            <ShowCard
                key={idx}
                index={idx}
                question={q.question}
                userAnswer={userAnswer}
                correctAnswer={correctAnswer}
                isCorrect={isCorrect}
            />
        );
    });

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const incorrect = total - score;
    const resultMessage = percentage >= 80
        ? "Excellent work!"
        : percentage >= 60
            ? "Good job—keep practicing!"
            : "Keep practicing—you’re making progress!";

    return (
        <div className="results-container">
            <div className="results-intro">
                <p className="results-eyebrow">Quiz complete</p>
                <h1 ref={headingRef} tabIndex={-1}>Your quiz results</h1>
            </div>

            <div className="results-summary">
                <div
                    className="score-ring"
                    style={{ '--score-percentage': `${percentage}%` }}
                    role="img"
                    aria-label={`Quiz score: ${percentage} percent`}
                >
                    <div className="score-ring-content">
                        <strong>{percentage}%</strong>
                        <span>Your score</span>
                    </div>
                </div>

                <div className="score-details" role="status" aria-live="polite">
                    <h2>{resultMessage}</h2>
                    <p className="score">You answered <strong>{score}</strong> of <strong>{total}</strong> questions correctly.</p>
                    <div className="answer-totals" aria-label={`${score} correct and ${incorrect} incorrect`}>
                        <span className="correct-total"><strong>{score}</strong> Correct</span>
                        <span className="incorrect-total"><strong>{incorrect}</strong> Incorrect</span>
                    </div>
                </div>

                <div className="results-actions">
                    <button type="button" className="primary" onClick={onRetry}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 9M3 4v6h6" /></svg>
                        Retry Same Quiz
                    </button>
                    <button type="button" className="secondary" onClick={onNewQuiz}>
                        Create New Quiz
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
                    </button>
                </div>
            </div>

            <section className="answers-review" aria-labelledby="answers-review-heading">
                <div className="review-heading">
                    <h2 id="answers-review-heading">Review your answers</h2>
                    <p>{total} {total === 1 ? 'question' : 'questions'}</p>
                </div>
                <ol className="cards-grid">
                    {cards}
                </ol>
            </section>
        </div>
    );
}

export default Results;
