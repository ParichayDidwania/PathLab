import "./AdminBookingFilter.css";

function AdminBookingFilter({ className }) {
    return(
        <form className={`admin-booking-filter-form ${className}`}>
            <label className="admin-booking-filter-form__label">
                <span>Order Id : </span>
                <input className="admin-booking-filter-form__input" placeholder="Order Id"></input>
            </label>

            <div className="admin-booking-filter-form__date-wrapper">
                <label className="admin-booking-filter-form__label">
                    <span>Starting Date : </span>
                    <input type="date" className="admin-booking-filter-form__input" placeholder="Order Id"></input>
                </label>

                <label className="admin-booking-filter-form__label">
                    <span>Ending Date : </span>
                    <input type="date" className="admin-booking-filter-form__input" placeholder="Order Id"></input>
                </label>
            </div>

            <button>Search</button>
        </form>
    )   
}

export default AdminBookingFilter;