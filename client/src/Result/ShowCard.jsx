import React from 'react';
import './results.css';

const ShowCard = ({ index, question, userAnswer, correctAnswer, isCorrect }) => {
    return (
        <li className={`show-card ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="card-body">
                <div className="card-heading">
                    <span className="question-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="card-question"><span className="sr-only">Question {index + 1}: </span>{question}</h3>
                    <span className="answer-status">{isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>

                <dl className="answer-details">
                    <div className={`answer-row ${isCorrect ? 'correct-answer' : 'user-incorrect-answer'}`}>
                        <dt>Your answer</dt>
                        <dd>{userAnswer ?? 'No answer'}</dd>
                    </div>
                    {!isCorrect && (
                        <div className="answer-row correct-answer">
                            <dt>Correct answer</dt>
                            <dd>{correctAnswer}</dd>
                        </div>
                    )}
                </dl>
            </div>
        </li>
    );
}

export default ShowCard;
