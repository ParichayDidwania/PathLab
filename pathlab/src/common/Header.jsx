import "./Header.css";
import { Link } from 'react-router-dom';
import user from '../assets/user.png';
import key from '../assets/key.png';
import Navbar from "./Navbar";
import CookieHelper from "../helpers/cookieHelper";

function Header({ className, name, isLoggedIn, setAuthToken }) {

    function logout(e) {
        e.preventDefault();
        CookieHelper.remove('authToken');
        setAuthToken("");
    }

    return(
        <header className={`header ${className}`}>
            <div className="header-top">
                <h1 className="header__heading">PathLab</h1>
                {!isLoggedIn ? 
                    <Link className="login-link" to="/auth"><img className="login-image" src={key} alt="A person in a circle"></img><span className="login-span">Login</span></Link>
                    :
                    <div className="profile">
                        <button className="profile-button"><img className="login-image" src={user} alt="A person in a circle"></img><span className="profile-name-span">{name}</span></button>
                        <ul className="profile__list">
                            <li className="profile__item"><a className="profile__link" href="" onClick={logout}>Logout</a></li>
                            <li className="profile__item"><Link className="profile__link" to="/address">Manage Address</Link></li>
                        </ul>
                    </div>
                }
            </div>
            <Navbar className="nav-bar"/>
        </header>
    )
}

export default Header