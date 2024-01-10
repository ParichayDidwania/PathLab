import { useEffect, useId, useState } from "react";
import ClientBooking from "../components/ClientBooking";
import "./Bookings.css";

function Bookings({className, authToken}) {

    const [bookingData, setBookingData] = useState([]);
    const id = useId();

    async function fetchBookings() {
        let res = await fetch(`${import.meta.env.VITE_URL}/booking/0`, {
            method: "GET",
            headers: {
                'x-auth-token': authToken
            }
        });

        if(res.status === 200) {
            res = await res.json();
            setBookingData([...bookingData, ...res.data]);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    let count = 0;
    const bookings = bookingData.map((bookingData) => {
        count++;
        return(
            <li key={`${id}-${count}`} className="booking-main__item">
                <ClientBooking {...bookingData}/>
            </li>
        )
    })

    return(
        <main className={`booking-main ${className}`}>
            <h2 className="booking-main__heading">Your Bookings</h2>
            <ul className="booking-main__list">
                {bookings}
            </ul>
        </main>
    )
}

export default Bookings;