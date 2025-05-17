import {  Container, Row, Col } from "reactstrap";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {  registerUser } from "../Features/UserSlice";
import { UserSchemaValidation } from "../Validation/UserValidation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import login_page from "../images/login_page.png";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usersListDB, setUsersListDB] = useState([]);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/userList`);
        setUsersListDB(response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUsers();
  }, []);

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UserSchemaValidation),
  });
  const onSubmit = (data) => {
    console.log("Data Form: ", data);
    alert("Validation all good");
    handleSubmit(data);
  };

  const handleSubmit = (data) => {
    console.log("Data:", data);
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    dispatch(registerUser(userData));
    navigate("/login");
  };

  return (
    <div>
      <Container className="register-container">
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <img alt="register" src={login_page} className="register-image" />
          </Col>
          <Col md={6}>
            <form className="div-form" onSubmit={submitForm(onSubmit)}>
              <div className="register-form-container">
                <h2 className="text-center mb-4">Create an Account</h2>
                <p className="text-center mb-4">
                  Sign up to start tracking your budget
                </p>
                <section className="form">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter your name..."
                      onChange={(e) => setName(e.target.value)}
                      {...register("name")}
                    />
                    <p className="error">{errors.name?.message}</p>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email..."
                      onChange={(e) => setEmail(e.target.value)}
                      {...register("email")}
                    />
                    <p className="error">{errors.email?.message}</p>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password..."
                      onChange={(e) => setPassword(e.target.value)}
                      {...register("password")}
                    />
                    <p className="error">{errors.password?.message}</p>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm your password..."
                      {...register("confirmPassword")}
                    />
                    <p className="error">{errors.confirmPassword?.message}</p>
                  </div>
                  <div className="btn-create">
                    <button className="button_blue">Register</button>
                  </div>
                </section>
              </div>
            </form>
            <p className="text-center mt-3">
              Already have an account?{" "}
              <a href="/login" className="login-link">
                Log in here.
              </a>
            </p>
          </Col>
        </Row>

        <Row></Row>
      </Container>
    </div>
  );
};
export default Register;
