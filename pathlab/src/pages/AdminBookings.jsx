import "./AdminBookings.css";
import AdminBookingFilter from "../components/AdminBookingFilter";
import AdminPageController from "../components/AdminPageController";
import AdminResultSummary from "../components/AdminResultSummary";
import { useEffect, useState } from "react";
import CONSTANTS from "../helpers/constants";

function AdminBookings({ className, authToken }) {

    const [bookingData, setBookingData] = useState([]);
    const [start, setStart] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);

    async function fetchBookings(start) {
        let res = await fetch(`${import.meta.env.VITE_URL}/admin/bookings/${start}`, {
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
        fetchBookings(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start]);

    function getPageDetails(current_skip, total) {
        const totalPages = Math.ceil(total / CONSTANTS.PAGINATION_LIMIT);
        const currentPage = current_skip == 0 ? 1 : Math.ceil((current_skip + 1) * (totalPages/total));
        return { totalPages, currentPage }
    }

    function getCurrentResultDisplayed(current_skip, total, bookingData) {
        const { currentPage, totalPages } = getPageDetails(current_skip, total);
        const current = ((currentPage - 1) * CONSTANTS.PAGINATION_LIMIT) + bookingData.length;
        return { currentPage, totalPages, current };
    }

    return (
        <main className={`admin-booking-main ${className}`}>
            <h2 className="admin-booking-main__heading">Active Bookings</h2>
            <AdminBookingFilter className="admin-booking-main__filter"/>
            <AdminResultSummary {...getCurrentResultDisplayed(start, totalBookings, bookingData)} total={totalBookings}/>
            <AdminPageController className="admin-booking-main__controller" current_skip={start} total={totalBookings} getPageDetails={getPageDetails} setStart={setStart}/>
        </main>
    )
}

export default AdminBookings