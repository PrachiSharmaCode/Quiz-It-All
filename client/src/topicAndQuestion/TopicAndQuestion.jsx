import { useRef, useState } from 'react';
import Loading from '../loading/Loading';
import './topicAndQuestion.css';

const questionCounts = [5, 10, 15];
const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

const TopicAndQuestion = ({ quizType, updateQuizData }) => {
    const isPdfQuiz = quizType === 'pdf';
    const topicInputRef = useRef(null);
    const [topic, setTopic] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('Beginner');
    const [topicError, setTopicError] = useState('');
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const generateQuiz = async (event) => {
        event.preventDefault();
        if (loading) return;

        setApiError('');
        const trimmedTopic = topic.trim();

        if (!isPdfQuiz && !trimmedTopic) {
            setTopicError('Enter a topic to generate your quiz.');
            topicInputRef.current?.focus();
            return;
        }

        setTopicError('');
        setLoading(true);

        try {
            const response = await fetch(
                isPdfQuiz ? 'http://localhost:8080/api/quiz/pdf' : 'http://localhost:8080/api/quiz',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: trimmedTopic,
                        numOfQuestions: numberOfQuestions,
                        level: difficulty,
                    }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to generate quiz. Please try again.');
            }

            if (!Array.isArray(data?.quiz) || data.quiz.length === 0) {
                throw new Error('The server returned an invalid quiz. Please try again.');
            }

            updateQuizData(data.quiz);
        } catch (error) {
            setApiError(error.message || 'Unable to connect to the quiz server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="home-container">
                <Loading text="Generating quiz..." />
            </div>
        );
    }

    return (
        <section className="topic-number-level-container" aria-labelledby="quiz-setup-heading">
            <div className="setup-heading">
                <p className="setup-eyebrow">Quiz setup</p>
                <h1 id="quiz-setup-heading">Make it your quiz.</h1>
                <p>{isPdfQuiz ? 'Choose what to practice from your PDF.' : 'Choose a topic and set your pace.'}</p>
            </div>

            <form className="setup-panel" onSubmit={generateQuiz} noValidate>
                <div className="setup-field">
                    <label className="setup-label" htmlFor="quiz-topic">
                        {isPdfQuiz ? 'Topic to focus on (optional)' : 'Quiz topic'}
                    </label>
                    <input
                        ref={topicInputRef}
                        id="quiz-topic"
                        name="topic"
                        className="topic-type-input"
                        type="text"
                        value={topic}
                        onChange={(event) => {
                            setTopic(event.target.value);
                            setTopicError('');
                        }}
                        placeholder="e.g. Photosynthesis"
                        required={!isPdfQuiz}
                        disabled={loading}
                        aria-invalid={Boolean(topicError)}
                        aria-describedby={topicError ? 'quiz-topic-error' : isPdfQuiz ? 'quiz-topic-help' : undefined}
                    />
                    {isPdfQuiz && <p id="quiz-topic-help" className="setup-help">Leave this blank to use the whole PDF.</p>}
                    {topicError && <p id="quiz-topic-error" className="setup-field-error" role="alert">{topicError}</p>}
                </div>

                <fieldset className="setup-field" disabled={loading}>
                    <legend className="setup-label">Number of questions</legend>
                    <div className="selection-buttons">
                        {questionCounts.map((count) => (
                            <button
                                key={count}
                                type="button"
                                className="selection-button"
                                aria-pressed={numberOfQuestions === count}
                                onClick={() => setNumberOfQuestions(count)}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="setup-field" disabled={loading}>
                    <legend className="setup-label">Difficulty</legend>
                    <div className="selection-buttons difficulty-buttons">
                        {difficultyLevels.map((level) => (
                            <button
                                key={level}
                                type="button"
                                className="selection-button"
                                aria-pressed={difficulty === level}
                                onClick={() => setDifficulty(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </fieldset>

                {apiError && <p className="api-error" role="alert">{apiError}</p>}

                <div className="setup-footer">
                    <p>{numberOfQuestions} questions <span aria-hidden="true">·</span> {difficulty}</p>
                    <button type="submit" className="topic-question-button" disabled={loading}>
                        Generate quiz
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 12h15m-6-6 6 6-6 6" />
                        </svg>
                    </button>
                </div>
            </form>
        </section>
    );
};

export default TopicAndQuestion;
