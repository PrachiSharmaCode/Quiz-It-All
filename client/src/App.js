import './App.css';
import Navbar from './navbar/Navbar';
import Home from './home/Home';
import TopicAndQuestion from './topicAndQuestion/TopicAndQuestion';
import { useState } from 'react';
import Quiz from './quiz/Quiz';
import Results from './Result/Results';

function App() {

  const [quizType, setQuizType] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const updateQuizType = (typeOfquiz) => {
    setQuizType(typeOfquiz)
  }

  const updateQuizData = (quizData) => {
    setQuizData(quizData)
  }

  const UpdateSelectedOptions = (index, option) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = option;
    setSelectedOptions(updatedOptions);
  }

  const [showResults, setShowResults] = useState(false);

  const retryQuiz = () => {
    setSelectedOptions([]);
    setShowResults(false);
  }

  const startNewQuiz = () => {
    // Reset quiz-related state so user returns to Home and can start a new quiz
    setSelectedOptions([]);
    setQuizData(null);
    setQuizType(null);
    setShowResults(false);
  }

  return (<>
    <div className='backgroundLayer'></div>
    <div className="app">
      <Navbar></Navbar>
      <div className='app-component-container'>
        {
          !quizType && !quizData && <Home updateQuizType={updateQuizType}></Home>
        }
        {
          quizType && !quizData && <TopicAndQuestion quizType={quizType} updateQuizData={updateQuizData} />
        }
        {
          quizData && quizType && !showResults && <Quiz quizData={quizData} UpdateSelectedOptions={UpdateSelectedOptions} onFinish={() => setShowResults(true)} />
        }
        {
          quizData && quizType && showResults && <Results quizData={quizData} selectedOptions={selectedOptions} onRetry={retryQuiz} onNewQuiz={startNewQuiz} />
        }
      </div>
    </div>
  </>
  );
}

export default App;
