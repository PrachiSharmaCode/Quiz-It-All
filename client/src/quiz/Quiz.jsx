import { useEffect, useRef, useState } from 'react';
import './quiz.css';

const Quiz = ({ quizData, UpdateSelectedOptions, onFinish }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const questionRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        questionRef.current?.focus({ preventScroll: true });
    }, [currentQuestion]);

    if (!quizData?.length) return null;

    const question = quizData[currentQuestion];
    const questionPosition = `Question ${currentQuestion + 1} of ${quizData.length}`;
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    const isLastQuestion = currentQuestion === quizData.length - 1;

    const handleOptionSelection = (index) => {
        setSelectedOption(index);
        UpdateSelectedOptions(currentQuestion, question.options[index]);
    };

    const handleNextButton = () => {
        if (selectedOption === null) return;

        if (isLastQuestion) {
            onFinish?.();
        } else {
            setCurrentQuestion((previous) => previous + 1);
            setSelectedOption(null);
        }
    };

    return (
        <section className="quiz-question-container" aria-labelledby="quiz-question">
            <div className="quiz-progress-header">
                <p className="progress-text">{questionPosition}</p>
                <div
                    className="progress"
                    role="progressbar"
                    aria-label="Quiz progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                    aria-valuetext={questionPosition}
                >
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="question-option">
                <h1 className="question" id="quiz-question" ref={questionRef} tabIndex={-1}>
                    {question.question}
                </h1>
                <p className="quiz-instruction">Select the answer you think is correct.</p>

                <div className="options-container" role="group" aria-labelledby="quiz-question">
                    {question.options.map((option, index) => (
                        <button
                            type="button"
                            key={`${currentQuestion}-${index}`}
                            className={`option-button${selectedOption === index ? ' selected' : ''}`}
                            onClick={() => handleOptionSelection(index)}
                            aria-pressed={selectedOption === index}
                        >
                            <span className="option-number" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option}</span>
                            <svg className="option-check" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </button>
                    ))}
                </div>

                <div className="quiz-navigation">
                    <p>Your answers will be reviewed at the end.</p>
                    <button
                        type="button"
                        className="next-button"
                        onClick={handleNextButton}
                        disabled={selectedOption === null}
                    >
                        {isLastQuestion ? 'Finish Quiz' : 'Next'}
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 12h15m-6-6 6 6-6 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Quiz;
