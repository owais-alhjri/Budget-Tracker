import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const user = useSelector((state) => state.users.user);

  const [userName, setUserName] = useState(user.name);
  const [pwd, setPwd] = useState(user.password);
  const [confirmPassword, setConfirmPassword] = useState(user.password);
  const [profilePic, setProfilePic] = useState(user.profilePic);

  const picURL = "http://localhost:3001/uploads/" + user.profilePic;

  const handleUpdate = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("name", userName);
    formData.append("password", pwd);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }
  
    dispatch(updateUserProfile(formData));
    alert("Profile Updated.");
    navigate("/profile");
  };

 if (!user) {
    return <p>Loading user information...</p>;
  }
  
  return (
    <Container fluid>
      <h1>Profile</h1>
      <img  src={picURL} className="userImage" alt={userName} />
            <p>
        <b>{user.name}</b>
        <br />
        {user.email}
      </p>

      <Row>
        <Col md={10}>
          <h2>Update Profile</h2>
          <Form onSubmit={handleUpdate}>
            <FormGroup>
              <Label for="profilePic">Profile Picture</Label>
              <Input
                type="file"
                id="profilePic"
                name="profilePic"
                onChange={(e) => setProfilePic(e.target.files[0])} 
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="button">
                Update Photo
              </Button>
            </FormGroup>

<FormGroup>
  <Label for="name">Name</Label>
  <Input
    id="name"
    name="name"
    placeholder="Name..."
    type="text"
    value={userName}
    onChange={(e) => setUserName(e.target.value)} // Update state on change
  />
</FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Password..."
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password..."
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}

              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="button">
                Update Profile
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
