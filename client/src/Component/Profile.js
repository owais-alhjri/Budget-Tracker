import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const user = useSelector((state) => state.users.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState("");

  useEffect(() => {
    if (user) {
      setUserName(user.name || "");
      setPwd(user.password || "");
      setConfirmPassword(user.password || "");
      setPreviewPic(user.profilePic || "user.png");
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        if (!user) {
          navigate("/login");
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError(null);
    
    // Form validation
    if (!userName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (pwd !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("name", userName);
    formData.append("password", pwd);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }
    
    try {
      setLoading(true);
      await dispatch(updateUserProfile(formData)).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <Container className="text-center mt-5">
        <p>Loading user information. Please wait...</p>
      </Container>
    );
  }

const picURL = user?.profilePic 
  ? (previewPic.startsWith("data:") 
    ? previewPic 
    : `${API_URL}/uploads/${user.profilePic}`)
  : `${API_URL}/uploads/user.png`;
  return (
    <div>
      <Container className="profile-container">
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">Profile updated successfully!</Alert>}
        
        <Row className="align-items-center">
          <Col md={4} className="text-center">
            <img 
              src={picURL} 
              className="userImage" 
              alt={userName} 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = `${API_URL}/uploads/user.png`;
              }}
            />
            <h3 className="mt-3">{user?.name}</h3>
            <p>{user?.email}</p>
          </Col>

          <Col md={8}>
            <h2 className="text-center mb-4">Update Profile</h2>
            <Form onSubmit={handleUpdate}>
              <FormGroup>
                <Label for="profilePic">Profile Picture</Label>
                <Input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <small className="form-text text-muted">
                  Select an image to update your profile picture
                </small>
              </FormGroup>

              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Name..."
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
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
                  required
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
                  required
                />
                {pwd !== confirmPassword && (
                  <small className="text-danger">Passwords do not match</small>
                )}
              </FormGroup>
              
              <FormGroup>
                <Button 
                  type="submit" 
                  color="primary" 
                  className="button"
                  disabled={loading || pwd !== confirmPassword}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;