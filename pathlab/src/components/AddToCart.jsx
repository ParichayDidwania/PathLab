import "./AddToCart.css";

function AddToCart({ className, cart, setCart, id }) {

    function addProduct() {
        const tempCart = {...cart};
        if(tempCart[id]) {
            tempCart[id]++;
        } else {
            tempCart[id] = 1;
        }

        setCart(tempCart);
    }

    function removeProduct() {
        const tempCart = {...cart};
        if(tempCart[id]) {
            if(tempCart[id] === 1) {
                delete tempCart[id];
            } else {
                tempCart[id]--;
            }
        }

        setCart(tempCart);
    }

    return(
        <>
            {
                !cart[id] || cart[id] === 0 ?
                <button className={`add-to-cart-button ${className}`} onClick={addProduct}>
                    Add To Cart
                </button>
                :
                <div className={`add-to-cart-controls ${className}`}>
                    <button className="add-product" onClick={addProduct}>&#43;</button>
                    <span className="product-count">{cart[id]}</span>
                    <button className="remove-product" onClick={removeProduct}>&#8722;</button>
                </div>
            }
        </>
    )
}

export default AddToCart;