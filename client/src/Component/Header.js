import { Navbar, Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar className='header'>
        <Nav>
            <NavItem>
                <Link to='/'>Home</Link>
            </NavItem>
            <NavItem>
                <Link to='/login'>Login</Link>
            </NavItem>
            <NavItem>
                <Link to='/register'>Register</Link>
            </NavItem>
        </Nav>
    </Navbar>
);
};
export default Header;
