import { useEffect, useState } from "react";
import "./Activate.css";
import { Link, useParams } from "react-router-dom";

function Activate({ className }) {

    const activationId = useParams().id;
    const [activationStatus, setActivationStatus] = useState("");
    const [isEmailActivated, setIsEmailActivated] = useState(false);

    let isCalled = false;

    async function activateAccount() {
        let data = await fetch(`${import.meta.env.VITE_URL}/auth/activate/${activationId}`);
        if(data.status === 200) {
            setIsEmailActivated(true);
            setActivationStatus("Your email has been activated! Proceed to login - ");
        } else {
            data = await data.json();
            setActivationStatus(data.error);
        }
    }

    useEffect(() => {
        if(isCalled) {
            return;
        }
        activateAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        isCalled = true;
    }, [])

    return(
        <main className={`activate-main ${className}`}>
            {activationStatus.length === 0 ? 
                <span className="activate-span">Activating...</span>
                :
                <span className="activate-span">{activationStatus} {isEmailActivated && <Link to="/auth">Login Page</Link>}</span>
            }            
        </main>
    )
}

export default Activate;