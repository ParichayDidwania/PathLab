import { Link } from "react-router-dom";
import "./Navbar.css";
import { useLocation } from "react-router-dom";

function Navbar({ className }) {
    const location = useLocation();
    return(
        <nav className={`nav ${className}`}>
            <button className="nav__menu-button">
                <i className="gg-menu"></i>
            </button>
            <ul className="nav__list">
                <li className="nav__item"><Link className={`nav__link ${location.pathname === '/' && "nav__link--opened"}`} to="/">Tests</Link></li>
                <li className="nav__item"><Link className={`nav__link ${location.pathname === '/cart' && "nav__link--opened"}`} to="/cart">Cart</Link></li>
                <li className="nav__item"><Link className={`nav__link ${location.pathname === '/about' && "nav__link--opened"}`} to="/about">About Us</Link></li>
                <li className="nav__item"><Link className={`nav__link ${location.pathname === '/get-in-touch' && "nav__link--opened"}`} to="/get-in-touch">Get In Touch</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;