import "./Header.css";

function Header({ className }) {
    return(
        <header className={`header ${className}`}>
            <h1 className="header__heading">PathLab</h1>
        </header>
    )
}

export default Header