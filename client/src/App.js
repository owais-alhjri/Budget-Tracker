import './App.css';
import { Container, Row } from "reactstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './Component/Header';
import MainPage from './Component/MainPage';
import Login from './Component/Login';
import Register from './Component/Register.js';
import UpdateUser from './Component/UpdateUser.js';
function App() {
  return (
    <div>
      <Container>
        <Router>
          <Row>
            <Header />
          </Row>
          <Row>
            <Routes>
              <Route path='/' element={<MainPage />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/register' element={<Register />}></Route>
              <Route path='/update/:user_email/:user_name/:user_password' element={<UpdateUser />}></Route>
            </Routes>
          </Row>
        </Router>
      </Container>
    </div>
  );
}

export default App;
