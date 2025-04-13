import { Button, Container, Row, Col, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUser, registerUser } from "../Features/UserSlice";
import { UserSchemaValidation } from "../Validation/UserValidation";
import axios from "axios";

const Register = () => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usersListDB, setUsersListDB] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/userList");
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
  };

  const handleDelete = (email) => {
    dispatch(deleteUser(email));
  };

  return (
    <Container fluid>
      <Row className="formrow">
        <Col className="columndiv1" lg="6">
          {/* Execute first the submitForm function and if validation is good execute the handleSubmit function */}
          <form className="div-form" onSubmit={submitForm(onSubmit)}>
            <div className="appTitle"></div>
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  {...register("confirmPassword")}
                />
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>
              <Button color="primary" className="button">
                Register
              </Button>
            </section>
          </form>
        </Col>
        <Col className="columndiv2" lg="6"></Col>
      </Row>
      <Row>
        <Table bordered hover responsive className="text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(usersListDB) &&
              usersListDB.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>
                    <Button
                      color="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(user.email)}
                    >
                      Delete
                    </Button>
                    <Link
                      to={`/update/${user.email}/${user.name}/${user.password}`}
                    >
                      <Button color="warning" size="sm">
                        Update
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Row>
      <Row></Row>
    </Container>
  );
};
export default Register;
