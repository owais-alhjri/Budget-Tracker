import { Navbar, Nav, NavItem } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Features/UserSlice";


const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handelLogout=async()=>{
        dispatch(logout());
        await new Promise((resolve)=>setTimeout(resolve,100));
        navigate('/');
    }
    const email = useSelector((state)=>state.users.user.email);
  return (
    <Navbar className='header'>
        <Nav>
            <NavItem>
                <Link to='/'>Home</Link>
            </NavItem>
            
            {!email ?<NavItem>
                <Link to='/login'>login</Link>
            </NavItem>:null }
            <NavItem>
                <Link to='/register'>Register</Link>
            </NavItem>
            { email ?
            <NavItem>
                <Link to='/logout' onClick={handelLogout}>Logout</Link>
            </NavItem>:null
}
        </Nav>
    </Navbar>
);
};
export default Header;
