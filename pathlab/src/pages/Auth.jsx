import { useEffect, useState } from "react";
import "./Auth.css";

import bcrypt from 'bcryptjs';
import CookieHelper from "../helpers/cookieHelper";
import { useNavigate, useLocation } from "react-router-dom";

function Auth({ className, setName, setIsLoggedIn }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [authType, setAuthType] = useState(0);

    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
    const [signupError, setSignupError] = useState("");
    const [signupInstruction, setSignupInstruction] = useState("");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginInstruction, setLoginInstruction] = useState("");
    const [loginError, setLoginError] = useState("");

    useEffect(() => {
        if(location.state?.from === "cart") {
            setLoginInstruction("Login to proceed the payment");
        }
    }, [location])

    function switchAuthType() {
        if(authType === 0) {
            setAuthType(1);
        } else {
            setAuthType(0);
        }
    }

    async function login(e) {
        e.preventDefault();

        if(loginEmail === "" || loginPassword === "") {
            setLoginError("Email or Password cannot be empty");
            return;
        }

        const regex = new RegExp('@.+\\.');
        if(!regex.test(loginEmail)) {
            setLoginError("Please enter a valid email");
            return;
        }

        let res = await fetch(`${import.meta.env.VITE_URL}/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword
            })
        })

        if(res.status === 200) {
            res = await res.json();
            CookieHelper.set("authToken", res.data.authToken);
            setName(res.data.name);
            setIsLoggedIn(true);
            navigate('/');
        } else {    
            res = await res.json();
            setLoginError(res.error);
        }

        console.log('login submit');
    }

    async function signup(e) {
        e.preventDefault();
        if(signupName === "" || signupEmail === "" || signupPassword === "" || signupConfirmPassword === "") {
            setSignupError("Please fill all required fields");
            return;
        }

        const regex = new RegExp('@.+\\.');
        if(!regex.test(signupEmail)) {
            setSignupError("Please enter a valid email");
            return;
        }

        if(signupPassword.length < 6) {
            setSignupError("Password should be atleast 6 characters long");
            return;
        }

        if(signupPassword !== signupConfirmPassword) {
            setSignupError("Password should match with Confirm Password");
            return;
        }

        setSignupError("");

        let data = await fetch(`${import.meta.env.VITE_URL}/auth/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: signupName,
                email: signupEmail,
                password: hashPassword(signupPassword)
            })
        })

        if(data.status === 200) {
            setSignupInstruction("A verification email has been sent to your email");
        } else {    
            data = await data.json();
            setSignupError(data.error);
        }

        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");

        console.log('signup submit');
    }

    function hashPassword(password) {
        return bcrypt.hashSync(password);
    }

    return(
        <main className={`auth-main ${className}`}>
            {authType === 0 ? 
            <form className="login-form" onSubmit={login}>
                <h2 className="login-form__heading">LOGIN</h2>
                <span className="login-form__error-span">{loginError}</span>
                <span className="login-form__instruction-span">{loginInstruction}</span>

                <label className="login-form__label" htmlFor="email">Email</label>
                <input className="login-form__input" id="email" name="email" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value) }}></input>

                <label className="login-form__label" htmlFor="password">Password</label>
                <input className="login-form__input" id="password" name="password" type="password" autoComplete="on" value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value) }}></input>

                <button className="login-form__submit-button" key="login-form__submit-button" type="submit">LOGIN</button>
                <button className="login-form__signup-button" key="login-form__signup-button" type="button" onClick={switchAuthType}>Create an account</button>
            </form>
            :
            <form className="signup-form" onSubmit={signup}>
                <h2 className="signup-form__heading">Create Account</h2>
                <span className="signup-form__info">All fields marked with an asterisk(<span className="signup-form--required">*</span>) are required</span>
                <span className="signup-form__error-span">{signupError}</span>
                <span className="signup-form__instruction-span">{signupInstruction}</span>

                <label className="signup-form__label" htmlFor="name">Name<span className="signup-form--required">*</span></label>
                <input className="signup-form__input" id="name" name="name" value={signupName} onChange={(e) => { setSignupName(e.target.value) }}></input>

                <label className="signup-form__label" htmlFor="email">Email<span className="signup-form--required">*</span></label>
                <input className="signup-form__input" id="email" name="email" value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value) }}></input>

                <label className="signup-form__label" htmlFor="password">Password<span className="signup-form--required">*</span></label>
                <input className="signup-form__input" id="password" name="password" type="password" autoComplete="on" value={signupPassword} onChange={(e) => { setSignupPassword(e.target.value) }}></input>

                <label className="signup-form__label" htmlFor="confirm-password">Confirm Password<span className="signup-form--required">*</span></label>
                <input className="signup-form__input" id="confirm-password" name="confirm-password" type="password" autoComplete="on" value={signupConfirmPassword} onChange={(e) => { setSignupConfirmPassword(e.target.value) }}></input>

                <button className="signup-form__submit-button" key="signup-form__submit-button" type="submit">CREATE</button>
                <button className="signup-form__login-button" key="signup-form__login-button" type="button" onClick={switchAuthType}>Login from existing account</button>
            </form>}
        </main> 
    )
}

export default Auth;