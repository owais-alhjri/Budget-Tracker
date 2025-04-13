import { useParams } from "react-router-dom";
import { updateUser } from "../Features/UserSlice";
import { useDispatch } from "react-redux";
import { Button, Container, Row } from "reactstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserSchemaValidation } from "../Validation/UserValidation";

const UpdateUser = () =>{
    const dispatch = useDispatch();
    const {user_email,user_name,user_password} = useParams();

    const [name, setName] = useState(user_name);
    const [email, setEmail] = useState(user_email);
    const [password, setPassword] = useState(user_password);
    const [confirmPassword, setConfirmPassword] = useState(user_password);

    const {
        register,handleSubmit, formState: {errors}
    } = useForm({
        resolver:yupResolver(UserSchemaValidation),
    });

    const handleUpdate = (data) =>{
        const userData = {
            name:data.name,
            email:data.email,
            password:data.password,
        };
        dispatch(updateUser(userData));
    }


    return (
        <div>
          <Container fluid> 
            <Row className="formrow">
              <form className="div-form" onSubmit={handleSubmit(handleUpdate)}>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name..."
                  value={name}
                  {...register("name", {
                    onChange: (e) => setName(e.target.value),
                  })}
                />
                <p className="error">{errors.name?.message}</p>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email..."
                  value={email}
                  {...register("email", {
                    onChange: (e) => setEmail(e.target.value),
                  })}
                />
                <p className="error">{errors.email?.message}</p>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password..."
                  value={password}
                  {...register("password", {
                    onChange: (e) => setPassword(e.target.value),
                  })}
                />
                <p className="error">{errors.password?.message}</p>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm your password..."
                  value={confirmPassword}
                  {...register("confirmPassword", {
                    onChange: (e) => setConfirmPassword(e.target.value),
                  })}
                />
                <p className="error">{errors.confirmPassword?.message}</p>
                <Button type="submit">Update User</Button>
              </form>
            </Row>
          </Container>
        </div>
      );
}
export default UpdateUser;