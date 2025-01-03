import { useEffect, useId, useState } from "react";
import ClientBooking from "../components/ClientBooking";
import "./Bookings.css";

function Bookings({className, authToken}) {

    const [bookingData, setBookingData] = useState([]);
    const [isLast, setIsLast] = useState(false);
    const id = useId();

    async function fetchBookings(start) {
        let res = await fetch(`${import.meta.env.VITE_URL}/booking/${start}`, {
            method: "GET",
            headers: {
                'x-auth-token': authToken
            }
        });

        if(res.status === 200) {
            res = await res.json();
            const bookingIds = bookingData.map(x => x.order_id);
            res.data.orders = res.data.orders.filter((order) => !bookingIds.includes(order.order_id));
            setBookingData([...bookingData, ...res.data.orders]);
            setIsLast(res.data.isLast);
        }
    }

    async function downloadOrder(order_id) {
        let res = await fetch(`${import.meta.env.VITE_URL}/booking/download/${order_id}`, {
            method: "GET",
            headers: {
                'x-auth-token': authToken
            }
        });

        if(res.status === 200) {
            const contentDisposition = res.headers.get('Content-Disposition');
            const fileName = contentDisposition.split('=')[1];

            res = await res.blob();
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            res = await res.json();
            window.alert(res.message);
        }
    }

    useEffect(() => {
        fetchBookings(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let count = 0;
    const bookings = bookingData.map((bookingData) => {
        count++;
        return(
            <li key={`${id}-${count}`} className="booking-main__item">
                <ClientBooking {...bookingData} isDownloadDisabled={bookingData.file_id ? false : true} downloadOrder={downloadOrder}/>
            </li>
        )
    })

    function showMore() {
        fetchBookings(bookingData.length);
    }

    return(
        <main className={`booking-main ${className}`}>
            <h2 className="booking-main__heading">Your Bookings</h2>
            <ul className="booking-main__list">
                {bookings}
            </ul>
            {!isLast && <button className="booking-main__show-more-button" onClick={showMore}>Show More</button>}
        </main>
    )
}

export default Bookings;
