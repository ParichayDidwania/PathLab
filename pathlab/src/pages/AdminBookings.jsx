import "./AdminBookings.css";
import AdminBookingFilter from "../components/AdminBookingFilter";
import AdminPageController from "../components/AdminPageController";
import AdminResultSummary from "../components/AdminResultSummary";
import AdminBooking from "../components/AdminBooking"
import { useEffect, useId, useState } from "react";
import CONSTANTS from "../helpers/constants";

function AdminBookings({ className, authToken }) {

    const [bookingData, setBookingData] = useState([]);
    const [start, setStart] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [orderId, setOrderId] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [triggerSearch, setTriggerSearch] = useState(0)

    const id = useId();

    async function fetchBookings(start, order_id, start_date, end_date) {
        let res = await fetch(`${import.meta.env.VITE_URL}/admin/bookings/${start}?order_id=${order_id}&start_date=${start_date}&end_date=${end_date}`, {
            method: "GET",
            headers: {
                'x-auth-token': authToken
            }
        });

        if(res.status === 200) {
            res = await res.json();
            setBookingData(res.data.orders);
            setTotalBookings(res.data.count);
        }
    }

    useEffect(() => {
        fetchBookings(start, orderId, startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, triggerSearch]);

    function getPageDetails(current_skip, total) {
        const totalPages = Math.ceil(total / CONSTANTS.PAGINATION_LIMIT);
        const currentPage = current_skip == 0 ? 1 : Math.ceil((current_skip + 1) / CONSTANTS.PAGINATION_LIMIT);
        return { totalPages, currentPage }
    }

    function getCurrentResultDisplayed(current_skip, total, bookingData) {
        const { currentPage, totalPages } = getPageDetails(current_skip, total);
        const current = ((currentPage - 1) * CONSTANTS.PAGINATION_LIMIT) + bookingData.length;
        return { currentPage, totalPages, current };
    }

    let count = 0;
    const bookings = bookingData.map((bookingData) => {
        count++;
        return(
            <li key={`${id}-${count}`} className="admin-booking-main__item">
                <AdminBooking {...bookingData}/>
            </li>
        )
    })

    return (
        <main className={`admin-booking-main ${className}`}>
            <h2 className="admin-booking-main__heading">Active Bookings</h2>
            <AdminBookingFilter className="admin-booking-main__filter" setOrderId={setOrderId} setStartDate={setStartDate} setEndDate={setEndDate} setTriggerSearch={setTriggerSearch}/>
            <AdminResultSummary {...getCurrentResultDisplayed(start, totalBookings, bookingData)} total={totalBookings}/>
            <AdminPageController className="admin-booking-main__controller" current_skip={start} total={totalBookings} getPageDetails={getPageDetails} setStart={setStart}/>
            <ul className="admin-booking-main__list">
                {bookings}
            </ul>
        </main>
    )
}

export default AdminBookings
