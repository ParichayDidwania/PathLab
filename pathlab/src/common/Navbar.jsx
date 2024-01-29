import { Link } from "react-router-dom";
import "./Navbar.css";
import { useLocation } from "react-router-dom";

function forceLooseFocus(e) {
    e.target.blur()
}

function Navbar({ className, isAdmin }) {
    const location = useLocation();
    return(
        <nav className={`nav ${className}`}>
            <button className="nav__menu-button">
                <i className="gg-menu"></i>
            </button>
            <ul className="nav__list">
                {!isAdmin ? 
                    <>
                        <li className="nav__item"><Link className={`nav__link ${location.pathname === '/' && "nav__link--opened"}`} to="/" onClick={forceLooseFocus}>Tests</Link></li>
                        <li className="nav__item"><Link className={`nav__link ${location.pathname === '/cart' && "nav__link--opened"}`} to="/cart" onClick={forceLooseFocus}>Cart</Link></li>
                        <li className="nav__item"><Link className={`nav__link ${location.pathname === '/bookings' && "nav__link--opened"}`} to="/bookings" onClick={forceLooseFocus}>Bookings</Link></li>
                        <li className="nav__item"><Link className={`nav__link ${location.pathname === '/about' && "nav__link--opened"}`} to="/about" onClick={forceLooseFocus}>About Us</Link></li>
                        <li className="nav__item"><Link className={`nav__link ${location.pathname === '/get-in-touch' && "nav__link--opened"}`} to="/get-in-touch" onClick={forceLooseFocus}>Get In Touch</Link></li>
                    </>
                    :
                    <>
                        <li className="nav__item"><Link className={`nav__link ${location.pathname === '/' && "nav__link--opened"}`} to="/" onClick={forceLooseFocus}>Active Bookings</Link></li>
                        <li className="nav__item"><Link className={`nav__link ${location.pathname === '/completed' && "nav__link--opened"}`} to="/" onClick={forceLooseFocus}>Completed Bookings</Link></li>
                    </>
                }
                
            </ul>
        </nav>
    )
}

export default Navbar;