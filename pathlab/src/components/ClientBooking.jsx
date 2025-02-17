import "./ClientBooking.css";
import copy from "../assets/copy.png";
import { useId } from "react";
import CONSTANTS from "../helpers/constants";
import { Link } from "react-router-dom";

function ClientBooking({ className, order_id, date, time, products, amount, status, isDownloadDisabled = true, downloadOrder }) {
    const id = useId();

    function copyToClipboard() {
        navigator.clipboard.writeText(order_id);
    }

    let listCount = 0;
    const testNameList = products.map(product => {
        listCount++;
        return (
            <li className="client-booking-item" key={`${id}-${listCount}`}>{product.name}&emsp;<span className="client-booking-quantity-x">x</span> {product.quantity}</li>
        )
    })

    return (
        <div className={`client-booking-wrapper ${className}`}>
            <div className="client-booking-top">
                <span className="client-booking-order-id-span">
                    Order Id:&nbsp;
                    <span className="client-booking-order-id-value">{order_id}</span>
                    <img className="client-booking-copy-order-id" src={copy} alt="A clipboard" onClick={() => { copyToClipboard(); }}></img>
                </span>
                <span>Slot: {date} at {time}</span>
            </div>
            <div className="client-booking-details-wrapper">
                <div className="client-booking-items-wrapper">
                    <span className="client-booking-details-span">Items</span>
                    <ol className="client-booking-list">
                        {testNameList}
                    </ol>
                </div>
                <div className="client-booking-amount-wrapper">
                    <span className="client-booking-details-span">Amount</span>
                    <span>₹{amount}</span>
                </div>
            </div>
            <div className="client-booking-status-wrapper">
                <span>Status:&nbsp;
                    <span className="client-booking-status-value">{CONSTANTS.ORDER_STATUS[status]}</span>
                </span>
                <div className="client-booking-status-control-wrapper">
                    <Link className="client-booking-status-control" to={`/booking-detail/${order_id}`}>Order Details</Link>
                    <button className={`client-booking-status-control ${isDownloadDisabled && "client-booking-status-control--disabled"}`} disabled={isDownloadDisabled} onClick={() => { downloadOrder(order_id) }}>Download Report</button>
                </div>
            </div>
        </div>
    );
}

export default ClientBooking;
