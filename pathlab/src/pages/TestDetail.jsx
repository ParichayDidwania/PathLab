import "./TestDetail.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddToCart from "../components/AddToCart";

function TestDetail({ cart, setCart }) {

    const test_id = useParams().test_id;
    const [testDetails, setTestDetails] = useState({});

    useEffect(() => {
        async function fetchTestDetails() {
            let res = await fetch(`${import.meta.env.VITE_URL}/${test_id}`, {
                method: "GET"
            });

            if(res.status === 200) {
                res = await res.json();
                setTestDetails(res.data);
            } else {
                setTestDetails({
                    error: "Test not found"
                });
            }
        }

        fetchTestDetails();
    }, [test_id]);

    return (
        <main className="test-detail-main">
            {testDetails.error ? <span className="test-detail-error-span">{testDetails.error}</span> : (
                <div className="test-detail-info-wrapper">
                    <div className="test-detail-title-price-wrapper">
                        <h2 className="test-detail-title-h1">{testDetails.title}</h2>
                        <span className="title-detail-price">&#8377;{testDetails.price}</span>
                    </div>
                    <div>
                        <span className="test-detail-description-tag-span">Description:</span>
                        <p className="test-detail-description-para">{testDetails.description}</p>
                    </div>
                    <AddToCart className='test-detail__add-to-cart' id={test_id} cart={cart} setCart={setCart}/>
                </div>
            )}
        </main>
    );
}

export default TestDetail;
