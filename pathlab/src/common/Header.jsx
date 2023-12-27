import "./Header.css";
import { Link } from 'react-router-dom';
import user from '../assets/user.png';

function Header({ className }) {
    return(
        <header className={`header ${className}`}>
            <h1 className="header__heading">PathLab</h1>
            <Link className="login-link" to="/auth"><img className="login-image" src={user} alt="A person in a circle"></img>Sign In</Link>
        </header>
    )
}

export default Header