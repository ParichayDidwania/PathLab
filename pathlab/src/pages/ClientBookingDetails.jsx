import { useParams } from "react-router-dom";
import "./ClientBookingDetails.css";
import copy from "../assets/copy.png";
import AddressView from "../components/AddressView";
import { useEffect, useId, useState } from "react";
import CONSTANTS from "../helpers/constants";

function ClientBookingDetails({ className, authToken }) {

    const order_id = useParams().order_id;
    const id = useId();

    const [data, setData] = useState({});
    const [error, setError] = useState("");

    function copyToClipboard() {
        navigator.clipboard.writeText(order_id);
    }

    async function fetchOrderData() {
        let res = await fetch(`${import.meta.env.VITE_URL}/booking/order/${order_id}`, {
            method: "GET",
            headers: {
                'x-auth-token': authToken
            }
        });

        if(res.status === 200) {
            res = await res.json();
            setData(res.data);
        } else {
            res = await res.json();
            setError(res.error);
        }
    }

    useEffect(() => {
        fetchOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let itemCount = 0;
    const items = data.products?.map((item) => {
        itemCount++;
        return (
            <li className="client-booking-details-main__item" key={`${id}-${itemCount}`}>
                {item.name}&emsp;<span className="client-booking-details-main__quantity-x">x</span> {item.quantity}
            </li>
        )
    })

    let memberCount = 0;
    const members = data.members?.map((member) => {
        itemCount++;
        return (
            <li className="client-booking-details-main__item" key={`${id}-${memberCount}`}>{member.name}&emsp;({member.gender})</li>
        )
    })

    return(
        <main className={`client-booking-details-main ${className}`}>
            {error.length > 0 ? <span className="client-booking-details-main__error-span">{error}</span> : 
                <>
                    <h2 className="client-booking-details-main__heading">Order Details</h2>
                    <div className="client-booking-details-top">
                        <span className="client-booking-details-order-id-span">
                            Order Id:&nbsp;
                            <span className="client-booking-details-order-id-value">{order_id}</span>
                            <img className="client-booking-details-copy-order-id" src={copy} alt="A clipboard" onClick={() => { copyToClipboard(); }}></img>
                        </span>
                        <span>Slot: {data.date} at {data.time}</span>
                    </div>
                    <span>Status: <span className="client-booking-details-main__status-span">{CONSTANTS.ORDER_STATUS[data.status]}</span></span>
                    <div className="client-booking-details-main__item-wrapper">
                        <h3>Items</h3>
                        <ol className="client-booking-details-main__item-list">
                            {items}
                        </ol>
                        <div className="client-booking-details-main__amount-wrapper">
                            <span className="client-booking-details-main__total-span">Total:</span>
                            <span>₹{data.amount}</span>
                        </div>
                    </div>
                    <div className="client-booking-details-main__member-wrapper">
                        <h3>Members</h3>

                        <ol className="client-booking-details-main__item-list">
                            {members}
                        </ol>
                    </div>
                    <div className="client-booking-details-main__address-wrapper">
                        <AddressView address={data?.address ? data?.address : {}} backgroundColor={2}/>
                    </div>
                </>
            }
            
        </main>
    )
}

export default ClientBookingDetails;