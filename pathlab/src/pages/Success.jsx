import "./Success.css";

import check from "../assets/check.png";
import { useEffect } from "react";
import CookieHelper from "../helpers/cookieHelper";

function Success({className, setCart}) {
    useEffect(() => {
        CookieHelper.remove("cart");
        setCart({});
    }, [setCart])

    return(
        <main className={`success-main ${className}`}>
            <img className="check-image"src={check} alt="A green tick in a green circle"></img>
            <span>Thank You!</span>
            <span>Your slot has been booked</span>
            <span>Please track your booking from the <q>Bookings</q> page</span>
        </main>
    )
}

export default Success;