import { Navbar, Nav, NavItem } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Features/UserSlice";
import loginImg from "../images/login.png";
import logoutImg from "../images/logout.png";
import registerImg from "../images/register.png";
import profileImg from "../images/profile.png";
import budgetTrackerImg from "../images/budget_tracker.png";
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap(); // Wait for the logout action to complete
      navigate("/login"); // Navigate to the login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const email = useSelector((state) => state.users.user?.email || null); // Safely access email

  return (
    <Navbar className="header">
      <div className="logo">
        <Link to="/" className="logo-link">
        <img alt="budget Tracker" width={150} src={budgetTrackerImg} />
        </Link>
      </div>
      <Nav className="nav">
  {email ? (
    <>
      <NavItem className="nav-item">
        <Link to="/profile">
          <img alt="profile" width={150} src={profileImg} />
        </Link>
      </NavItem>
      <NavItem className="nav-item">
        <Link to="/logout" onClick={handleLogout}>
          <img alt="logout" width={150}    src={logoutImg} />
        </Link>
      </NavItem>
    </>
  ) : (
    <>
      <NavItem className="nav-item">
        <Link to="/login">
          <img alt="login" width={150}  src={loginImg} />
        </Link>
      </NavItem>
      <NavItem className="nav-item">
        <Link to="/register">
          <img alt="registerImg" width={150}  src={registerImg} />
        </Link>
      </NavItem>
    </>
  )}
</Nav>
    </Navbar>
  );
};

export default Header;
