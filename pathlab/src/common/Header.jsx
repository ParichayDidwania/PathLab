import "./Header.css";
import { Link } from 'react-router-dom';
import user from '../assets/user.png';

function Header({ className, name, isLoggedIn }) {
    return(
        <header className={`header ${className}`}>
            <h1 className="header__heading">PathLab</h1>
            {!isLoggedIn ? 
                <Link className="login-link" to="/auth"><img className="login-image" src={user} alt="A person in a circle"></img>Sign In</Link>
                :
                <button className="profile-button"><img className="login-image" src={user} alt="A person in a circle"></img>{name}</button>
            }
        </header>
    )
}

export default Header