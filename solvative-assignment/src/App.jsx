import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('TakeQuiz');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [totalQuestionNumber, setTotalQuestionNumber] = useState(9);
  const [timeLeft, setTimeLeft] = useState(10);
  const intervalRef = useRef(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswerMap, setSelectedAnswerMap] = useState([]);
  const questionaData = [
    {
      "id": "js_basics",
      "name": "JavaScript Basics",
      "questions": [
        {
          "id": "q1",
          "question": "What is the correct syntax for referring to an external script called 'script.js'?",
          "options": [
            "A. <script name='script.js'>",
            "B. <script href='script.js'>",
            "C. <script src='script.js'>",
            "D. <script file='script.js'>"
          ],
          "correctAnswer": "C",
          "timeLimit": 10
        },
        {
          "id": "q2",
          "question": "Which company developed JavaScript?",
          "options": [
            "A. Microsoft",
            "B. Netscape",
            "C. Google",
            "D. Mozilla"
          ],
          "correctAnswer": "B",
          "timeLimit": 10
        }
      ]
    }
  ];
  const [answerMap, setAnwerMap] = useState(null);
  const [currentQuestionData, setCurrentQuestionData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [correctValue, setCorrectValue] = useState(0);
  const [wrongValue, setWrongValue] = useState(0);
  const [noAnswer, setNoAnswer] = useState(0)

  const optionsLanguage = [
    { id: 'js_basics', value: 'js_basics', label: 'Javascript Basic' },
    { id: 'ng_basics', value: 'ng_basics', label: 'Angular Basic' },
    { id: 'react_adv', value: 'react_adv', label: 'React.js Advance' },
    { id: 'flutter', value: 'flutter', label: 'Flutter' }
  ];

useEffect(() => {
    // Start the interval and store its ID in the ref
    intervalRef.current = setInterval(() => {
      // Use functional state update to always get the latest 't' value
      setTimeLeft(t => t - 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    // or before the effect runs again (if dependencies change)
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current);
      if(currentQuestionNumber == totalQuestionNumber){
        setCurrentScreen('FinishQuiz');
      }
      setCurrentQuestionNumber(currentQuestionNumber+1);
      setCurrentQuestion(currentQuestionData[currentQuestionNumber+1])
    }
  }, [timeLeft]);

  useEffect(() => {
      clearInterval(intervalRef.current);
      setTimeLeft(10);
      intervalRef.current = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
  }, [currentQuestionNumber]);

const handleOptionChange = (event) => {
  setSelectedQuiz(event.target.value);
};
const handleUsernameChange = (event) =>{
  setCurrentUserName(event.target.value);
}
const handleAnswerChange = (event) =>{
  setSelectedAnswer(event.target.value);
}

const handleStartQuiz = ()=>{
  setCurrentScreen('QuizScreen');
  setCurrentQuestionNumber(0);
  setTotalQuestionNumber(9);
  setTimeLeft(10);
  let valueQuestions = questionaData.find((q) => q.id == selectedQuiz);
  setCurrentQuestionData(valueQuestions.questions);
  setTotalQuestionNumber(valueQuestions.questions.length-1);
  setCurrentQuestion(valueQuestions.questions[0]);
}

const handleNextQuestion = ()=>{
  if(currentQuestionNumber == totalQuestionNumber){
        setCurrentScreen('FinishQuiz');
        let newAnswerMap = [...selectedAnswerMap,
      {
        id: parseInt(currentQuestionNumber),
        answerSelected: selectedAnswer
      }]
        setSelectedAnswerMap(newAnswerMap);
        let correct = 0;
        let wrong = 0;
        let noAnswer = 0;
        currentQuestionData.forEach((q, index) => {
          let answerToVerify = newAnswerMap.find(a => a.id == index);
          if (answerToVerify.answerSelected){
            if(index == answerToVerify?.id && q.correctAnswer == answerToVerify?.answerSelected.charAt(0)){
              correct++;
            }else{
                wrong++;
            }
          }else{
            noAnswer++;
          }
        }
        );
      setCorrectValue(correct);
      setWrongValue(wrong);
      setNoAnswer(noAnswer)
      let percentage = (correct/(totalQuestionNumber+1))* 100;
      setPercentage(percentage);

  }
    setCurrentQuestionNumber(currentQuestionNumber+1);
    setSelectedAnswerMap([
      ...selectedAnswerMap,
      {
        id: parseInt(currentQuestionNumber),
        answerSelected: selectedAnswer
      }
    ]);
    setCurrentQuestion(currentQuestionData[currentQuestionNumber+1]);
};

const handleQuit = () =>{
  setCurrentScreen('TakeQuiz');
  setSelectedQuiz(null);
  setCurrentUserName('');
  setCurrentQuestionNumber(1);
  setCurrentQuestion(null)
  setTotalQuestionNumber(10);
  setTimeLeft(10);
};

const handleRetakeQuiz =()=>{
  setCurrentScreen('TakeQuiz');
  setSelectedQuiz(null);
  setCurrentUserName('');
  setCurrentQuestionNumber(1);
  setCurrentQuestion(null)
  setTotalQuestionNumber(10);
  setTimeLeft(10);
  setSelectedAnswerMap([]);
}
  return (
    <>
     <div className='header-quiz'>
      <div className='quiz-logo'>
          <span className='name1'>QUIZ</span>
          <span className='name2'>Mania</span>
      </div>
      <div className='quiz-right-section'>
        {currentScreen == 'QuizScreen' && <button className='exit-quiz'
        onClick={handleQuit}>Exit Quiz</button>}
      </div>
     </div>


     {currentScreen == 'TakeQuiz' && <div className='quiz-start-container'>
        <div className='welcome-header'>
            <span>Welcome to </span>
            <span className='name1'>QUIZ</span>
            <span className='name2'>Mania</span>
        </div>
        <div className='instruction-container'>
          <div className='instruction-text'>
              <div>Please read all the rules about this quiz before you start.</div>
              <div className='quiz-link'>Quiz rules</div>
          </div>
          <div className='name-container'>
            <div className='name-label'>Full name</div>
            <input className='name-input' placeholder='Full name'
            value={currentUserName} 
        onChange={handleUsernameChange}></input>
          </div>
          <div className='select-topics'>
            <div className='selection-label'>
              Please Select Topic to Continue
            </div>
            <div className='options-container'>
              <div className='option1-container'>
                  {optionsLanguage.map((option, index) => (
                    <div className='option'>
                      <input type="radio" id={option.id} name="test-language" value={option.id}
                      onChange={handleOptionChange}
                      checked={selectedQuiz === option.id}/>
                      <label for={option.id} className='option-label'>{option.label}</label>
                    </div>
                    
                  ))}
              </div>
              <div className='option2-container'>
                  
              </div>
            </div>
            <div>
              <button disabled={!selectedQuiz || !currentUserName} className='start-quiz-button'
                onClick={handleStartQuiz}
              >Start Quiz</button>
            </div>
          </div>
        </div>
     </div>}

     {currentScreen == 'QuizScreen' && 
     <div className='quiz-start-container'>
      <div class="progress-container">
        <div className='progress-details'>
          <div className='progress-number'>
            {currentQuestionNumber+1}/{totalQuestionNumber+1}
          </div>
          <div className='progress-timer'>
            {timeLeft}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-current"
            style={{
          width: `${((currentQuestionNumber+1)/(totalQuestionNumber+1))*100}%`
        }}
          ></div>
        </div>
      </div>
        <div className='question'>
          <div className='instruction-container'>
              <div>{currentQuestionNumber + 1}</div>
              <div>{currentQuestion?.question}</div>
          </div>
          <div className='select-topics'>
            <div className='options-container'>
              <div className='option1-container'>
                  {currentQuestion?.options.map((option, index) => (
                    <div className='option'>
                      <input type="radio" id={option} name="test-language" value={option}
                      onChange={handleAnswerChange}
                      checked={selectedAnswer === option}/>
                      <label for={option} className='option-label'>{option}</label>
                    </div>
                    
                  ))}
              </div>
              <div className='option2-container'>
                  
              </div>
            </div>
            <div>
              <button className='start-quiz-button'
                onClick={handleNextQuestion}
              >NextQuestion</button>
            </div>
          </div>
        </div>
     </div>}

     {currentScreen == 'FinishQuiz' && 
     <div className='quiz-start-container'>
        <div class="result-card">
  <div class="check-circle">
    <svg viewBox="0 0 24 24">
      <path d="M20.285 6.708l-11.025 11.025-5.545-5.545 1.414-1.414 4.131 4.131 9.611-9.611z"/>
    </svg>
  </div>

  <h1>CONGRATULATION</h1>
  <p class="sub-text">You successfully completed the Quiz and holds</p>

  <div class="score-title">Your Score</div>
  <div class="score-value">{percentage}%</div>
  {percentage > 60 && percentage < 80 && 
  <div class="great-job">Well done!</div>}
  {percentage > 80 && 
  <div class="great-job">Great Job!</div>}
  {percentage < 60 && 
  <div class="great-job">Keep Practicing!</div>}
  <div class="stats-box">
    <h3>Out of {totalQuestionNumber+1} question</h3>
    <div class="stats">
      <div class="correct">{correctValue} Correct</div>
      <div class="incorrect">{wrongValue} Incorrect</div>
      <div class="not-answered">{noAnswer} Not answered</div>
    </div>
  </div>

  <button class="retake-btn" onClick={handleRetakeQuiz}>Retake Quiz</button>
</div>
     </div>}
    </>
  )
}

export default App
