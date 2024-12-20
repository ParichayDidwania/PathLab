import "./AdminBooking.css";
import copy from "../assets/copy.png";
import { useId } from "react";
import AddressView from "./AddressView";
import CONSTANTS from "../helpers/constants";
import { useState } from "react";

function AdminBooking({ is_completed = false, className, order_id, date, time, products, amount, members, address, status, saveOrder, downloadOrder }) {
    const id = useId();
    const [statusValue, setStatusValue] = useState(status);
    const [file, setFile] = useState(null);

    function copyToClipboard() {
        navigator.clipboard.writeText(order_id);
    }

    let listCount = 0;
    const testNameList = products.map(product => {
        listCount++;
        return (
            <li className="admin-booking-item" key={`${id}-${listCount}`}>{product.name}&emsp;<span className="admin-booking-quantity-x">x</span> {product.quantity}</li>
        )
    })

    let memberCount = 0;
    const membersList = members?.map((member) => {
        memberCount++;
        return (
            <li className="admin-booking-details-main__item" key={`${id}-${memberCount}`}>{member.name}&emsp;({member.gender})</li>
        )
    })

    const orderStatusOptions = [];
    let optionkey = 0;
    for(let orderStatus in CONSTANTS.ORDER_STATUS) {
        orderStatusOptions.push(<option key={`${id}-${optionkey}`} value={orderStatus}>{CONSTANTS.ORDER_STATUS[orderStatus]}</option>)
        optionkey++;
    }

    return (
        <div className={`admin-booking-wrapper ${className}`}>
            <div className="admin-booking-top">
                <span className="admin-booking-order-id-span">
                    Order Id:&nbsp;
                    <span className="admin-booking-order-id-value">{order_id}</span>
                    <img className="admin-booking-copy-order-id" src={copy} alt="A clipboard" onClick={() => { copyToClipboard(); }}></img>
                </span>
                <span>Slot: {date} at {time}</span>
            </div>
            <ol className="admin-booking-details-main__list">
                {membersList}
            </ol>
            <div className="admin-booking-details-wrapper">
                <div className="admin-booking-items-wrapper">
                    <span className="admin-booking-details-span">Items</span>
                    <ol className="admin-booking-list">
                        {testNameList}
                    </ol>
                </div>
                <div className="admin-booking-amount-wrapper">
                    <span className="admin-booking-details-span">Amount</span>
                    <span>₹{amount}</span>
                </div>
            </div>
            <AddressView className="admin-booking-address-view" address={address}/>
            <div className="admin-booking-status-wrapper">
                <div className="admin-booking-status-control-wrapper">
                    <select id="status" name="status" value={statusValue} onChange={(e) => { setStatusValue(e.target.value)} } disabled={is_completed}>
                        {orderStatusOptions}
                    </select>
                    <input type="file" accept=".pdf" onChange={(e) => { setFile(e.target.files[0])}}/>
                </div>
                <div className="admin-booking-status-control-wrapper">
                    {is_completed && 
                        <button className={`admin-booking-status-control`} onClick={() => {
                            downloadOrder(order_id);
                        }}>Download Report</button>
                    }
                    <button className={`admin-booking-status-control`} onClick={() => {
                        saveOrder(order_id, parseInt(statusValue), file);
                    }}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default AdminBooking;
