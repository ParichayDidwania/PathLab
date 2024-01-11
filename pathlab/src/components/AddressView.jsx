import "./AddressView.css";

function AddressView({ className, address, backgroundColor = 1 }) {
    return(
        <div className={`${backgroundColor == 1 ? `address-view` : `address-view-white`} ${className}`}>
            <h3>Selected Address</h3>
            <span className="address-view__span">{address.address_1}</span>
            <span className="address-view__span">{address.address_2 ? address.address_2 : ""}</span>
            <span className="address-view__span">{address.city}</span>
            <span className="address-view__span">{address.state}</span>
            <span className="address-view__span">{address.pin_code}</span>
            <span className="address-view__span">+91{address.phone}</span>
        </div>
    )
}

export default AddressView;