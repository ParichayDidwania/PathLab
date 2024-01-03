import { useEffect, useId, useState } from "react";
import "./Cart.css";
import Card from "../components/Card";
import { Link } from "react-router-dom";

function Cart({ className, cart, setCart, products, isLoggedIn }) {
    const [cards, setCards] = useState([]);

    const [isPriceUpdated, setIsPriceUpdated] = useState(false);
    const [itemCost, setItemCost] = useState(0);
    const [commuteFee, setCommuteFee] = useState(0);
    const [total, setTotal] = useState(0);

    const id = useId();

    useEffect(() => {
        setIsPriceUpdated(false);
        const tempCards = [];
        let key = 0;
        for(const prod in cart) {
            key++;
            tempCards.push(<Card cart={cart} setCart={setCart} products={products} addSeeMore={false} testId={parseInt(prod)} key={`${id}-${key}`}/>);
        }
        setCards(tempCards);

        if(Object.keys(cart).length > 0) {
            fetchCartAmount();
        }

        async function fetchCartAmount() {
            let res = await fetch(`${import.meta.env.VITE_URL}/cart/price`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart: cart
                })
            })
    
            if(res.status === 200) {
                res = await res.json();
                setItemCost(res.data.items);
                setCommuteFee(res.data.commute);
                setTotal(res.data.total);
                setIsPriceUpdated(true);
            }
        }

    }, [cart, products, setCart, id])

    return(
        <main className={`cart-main ${className}`}>
            <h2 className="cart-main__heading">Cart</h2>
            {Object.keys(cart).length > 0 ?
                <div className="cart">
                    {cards}
                    <span className="cart__info">Note: Any test with quantity of 1 is only applicable for 1 person only. Please set the quantity according to the number of people who require the test.</span>
                    <div className="cart__price-wrapper">
                        <div className="cart__price">
                            <span>Items</span>
                            <span>{isPriceUpdated ? `₹ ${itemCost}` : `Updating...`}</span>
                        </div>
                        <div className="cart__price">
                            <span>Commute Fee</span>
                            <span>{isPriceUpdated ? `₹ ${commuteFee}` : `Updating...`}</span>
                        </div>
                        <div className="cart__price-total">
                            <span>Total</span>
                            <span>{isPriceUpdated ? `₹ ${total}` : `Updating...`}</span>
                        </div>
                    </div>
                    <Link className="cart__proceed" to={isLoggedIn ? "/details" : "/auth"} state={{from: "cart"}}>PROCEED</Link>
                </div>
                :
                <span className="cart-main__empty">Your cart is empty</span>
            }
            
        </main>
    )   
}

export default Cart;