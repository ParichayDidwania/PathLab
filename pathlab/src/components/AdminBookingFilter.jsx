import { useRef } from "react";
import "./AdminBookingFilter.css";

function AdminBookingFilter({ className, setOrderId, setStartDate, setEndDate, setTriggerSearch }) {

    const orderIdRef = useRef();
    const startDateRef = useRef();
    const endDateRef = useRef();

    function search(e) {
        e.preventDefault();
        setOrderId(orderIdRef.current.value);
        setStartDate(startDateRef.current.value);
        setEndDate(endDateRef.current.value);
        setTriggerSearch((prev) => prev + 1);
    }

    return(
        <form className={`admin-booking-filter-form ${className}`}>
            <label className="admin-booking-filter-form__label">
                <span>Order Id : </span>
                <input className="admin-booking-filter-form__input" placeholder="Order Id" ref={orderIdRef}></input>
            </label>

            <div className="admin-booking-filter-form__date-wrapper">
                <label className="admin-booking-filter-form__label">
                    <span>Starting Date : </span>
                    <input type="date" className="admin-booking-filter-form__input" placeholder="Order Id" ref={startDateRef}></input>
                </label>

                <label className="admin-booking-filter-form__label">
                    <span>Ending Date : </span>
                    <input type="date" className="admin-booking-filter-form__input" placeholder="Order Id" ref={endDateRef}></input>
                </label>
            </div>

            <button onClick={(e) => { search(e) }}>Search</button>
        </form>
    )   
}

export default AdminBookingFilter;
