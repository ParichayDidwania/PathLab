import "./Footer.css";

function Footer({ className }) {
    return(
        <footer className={`footer ${className}`}>
            <ul className="footer__list">
                <li className="footer__item"><a href="">Privacy Policy</a></li>
                <li className="footer__item"><a href="">Terms of Use</a></li>
                <li className="footer__item"><a href="">Disclaimer</a></li>
            </ul>
        </footer>
    )
}

export default Footer