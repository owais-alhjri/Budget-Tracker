import { Button, Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Link } from "react-router-dom";
import { addUser, deleteUser } from "../Features/UserSlice";


const Register = () =>{
    const dispatch = useDispatch();
    const userList = useSelector((state)=>state.users.value);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const{
        register,
        handleSubmit:submitForm,
        formState:{errors},
    } = useForm({
        resolver:yupResolver()
    });
    const onSubmit = (data) =>{
        console.log('Data Form: ',data);
        alert('Validation all good');
        handleSubmit(data);
    };

    const handleSubmit = (data) =>{
        console.log("Data:", data);
        const userData = {
            name:data.name,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
        };
        dispatch(addUser(userData));
    };

    const handleDelete = (email) =>{
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
                      {...register("name", {
                        onChange: (e) => setName(e.target.value),
                      })}
                    />
                    <p className="error">{errors.name?.message}</p>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email..."
                      {...register("email", {
                        onChange: (e) => setEmail(e.target.value),
                      })}
                    />
                    <p className="error">{errors.email?.message}</p>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password..."
                      {...register("password", {
                        onChange: (e) => setPassword(e.target.value),
                      })}
                    />
                    <p className="error">{errors.password?.message}</p>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm your password..."
                      {...register("confirmPassword", {
                        onChange: (e) => setConfirmPassword(e.target.value),
                      })}
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
            <table>
              <tbody>
                {userList.map((user) => (
                  <tr key={user.email}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <Button onClick={() => handleDelete(user.email)}>
                        Delete User
                      </Button>
                      <Link
                        to={`/update/${user.email}/${user.name}/${user.password}`}
                      >
                        <Button color="primary">Update User</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Row>
          <Row></Row>
        </Container>
      );
}
export default Register;