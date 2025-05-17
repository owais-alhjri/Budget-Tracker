import {
  Form,
  Input,
  FormGroup,
  Label,
  Container,
  Col,
  Row,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetState } from "../Features/UserSlice";
import login_page from "../images/login_page.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users.user || null);
  const isSuccess = useSelector((state) => state.users.isSuccess);
  const isError = useSelector((state) => state.users.isError);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    } else if (isSuccess && user) {
      navigate("/");
      dispatch(resetState()); 
    }
  }, [user, isError, isSuccess, navigate, dispatch]);

  const handleLogin = (e) => {
    e.preventDefault(); 
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  return (
    <div>
      <Container className="login-container">
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <img
              alt="login"
              src={login_page}
              className="login-image"
            />
          </Col>

          <Col md={6}>
            <div className="login-form-container">
              <h2 className="text-center mb-4">Welcome Back</h2>
              <p className="text-center mb-4">Log in to your account</p>
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter email..."
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter password..."
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <div className="btn-create">
                  <button type="submit" className="button_blue">Login</button>
                </div>
              </Form>
              <p className="text-center mt-3">
                No Account? <Link to="/register" className="signup-link">Sign Up now.</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;