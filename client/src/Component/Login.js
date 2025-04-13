import {
  Form,
  Input,
  FormGroup,
  Label,
  Container,
  Button,
  Col,
  Row,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/UserSlice";

const Login = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state)=> state.users.user);
  const isSuccess = useSelector((state)=> state.users.isSuccess);
  const isError = useSelector((state)=> state.users.isError);

  useEffect(()=>{
    if(isError){
      navigate('/login')

    }
    if(isSuccess){
      navigate('/')
    }
    else{
      navigate('/login')
    }
  },[user,isError,isSuccess,navigate]);

  const handleLogin = ()=>{
    const userData={
      email,
      password,
    };
    dispatch(login(userData));
  }
  return (
    <div>
<Container>
        <Form>
          <Row>
            <Col md={3}>
              <h1>Logo</h1>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email..."
                  type="email"
                  onChange={(e)=> setEmail(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter password..."
                  type="password"
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Button onClick={handleLogin}> Login </Button>
            </Col>
          </Row>
        </Form>
        <p>
          No Account? <Link to="/register">Sign Up now.</Link>
        </p>
      </Container>
    </div>
  );
};
export default Login;
