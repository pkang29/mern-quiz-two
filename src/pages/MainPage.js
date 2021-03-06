import React, {Component} from 'react';
import axios from 'axios';
import QuizCreator from '../components/QuizCreator';
import Toggle from '../components/Toggle';
import Modal from '../components/Modal';
import styled from 'styled-components';
import QuizListDisplay from '../components/QuizListDisplay';

class MainPage extends Component {
  state = {
    currentQuiz: 0,
    quizzes: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    quizCreatorDisplay: false,
  };

  componentDidMount() {
    this.getDataFromDb();
  }

  getDataFromDb = () => {
    fetch('http://localhost:3001/quiz/getQuiz')
      .then((quiz) => quiz.json())
      .then((res) => this.setState({ quizzes: res.quiz }));
  };

  createQuiz = (message) => {
    let currentIds = this.state.quizzes.map((quiz) => quiz.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    
    axios.post('http://localhost:3001/quiz/newQuiz', {
      name: message,
    });
    
  };

updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate;
    parseInt(idToUpdate);
    this.state.quizzes.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
      console.log(objIdToUpdate);
    });

    axios.post('http://localhost:3001/quiz/updateQuiz', {
      
      update: { name: updateToApply },
    });
  };

  updateRootCurrentQuiz = (current) => {
    this.setState({currentQuiz: current});
  }

  render() {
    const {quizzes, currentQuiz} = this.state;
    return (
        <MainPageSection>
            <h1>Welcome to the Quiz Factory!</h1>
            <QuizList>
            {quizzes.length === 0
                ? <h2>
                    <p>No quizzes exist right now :(</p> 
                    <p>Why don't you make one? :)</p>
                  </h2>
                : <QuizListDisplay 
                    quizzes={quizzes} 
                    currentQuiz={currentQuiz} 
                    updateQuizDB={this.getDataFromDb}
                  />
            }
            </QuizList>
            <Toggle>
            { ({on, toggle}) => (
                <>
                {!on ? 
                    <button onClick={toggle}>
                    Create a Quiz
                    </button>
                    :
                    <Modal on={on} toggle={toggle} updateCurrentQuiz={this.updateRootCurrentQuiz}>
                    <QuizCreator 
                      currentQuiz={currentQuiz}
                      updateCurrentQuiz={this.updateRootCurrentQuiz}
                      updateQuizDB={this.getDataFromDb}/>
                    </Modal>
                }
                </>                      
            )}  
            </Toggle>
        </MainPageSection>    
    );
  }
}

export default MainPage;

const QuizList = styled.div`
  display: flex;
  flex-direction: column;
  margin:0 auto;
  padding: 0;
`;

const MainPageSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0;
  justify-content: center;
  align-items: center;
  >button {
    border: 1px solid black;
    border-radius: 5px;
    background: white;
    margin: 5px;
    padding: 10px;
    width: 5rem; 
  }
  >button:hover {
    background: whitesmoke;
    cursor: pointer;
  }
  >button:active {
    background: black;
  }
`
