import './App.css';
import { Container, Row } from "reactstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './Component/Header';
import MainPage from './Component/MainPage';
import Login from './Component/Login';
import Register from './Component/Register.js';
import UpdateUser from './Component/UpdateUser.js';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from './Features/UserSlice.js';
import BudgetDetails from './Component/BudgetDetails.js';
import Profile from './Component/Profile.js';
import EditExpense from './Component/EditExpense.js';
function App() {
  const dispatch = useDispatch();

  useEffect(() =>{
    const storedUser = localStorage.getItem("user");
    if(storedUser){
      dispatch(setUser(JSON.parse(storedUser)));
    }
  },[dispatch]);
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
              <Route path='/profile' element={<Profile />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/register' element={<Register />}></Route>
              <Route path='/BudgetDetails' element={<BudgetDetails />}></Route>
              <Route path='/EditExpense' element={<EditExpense />}></Route>
              <Route path='/update/:user_email/:user_name/:user_password' element={<UpdateUser />}></Route>
            </Routes>
          </Row>
        </Router>
      </Container>
    </div>
  );
}

export default App;
