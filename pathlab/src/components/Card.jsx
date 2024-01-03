import "./Card.css";
import AddToCart from "./AddToCart";
import { Link } from "react-router-dom";

function Card({className, testId, cart, setCart, products, addSeeMore = true}) {

    const test = products.find(x => x.id === testId);

    return(
        <div className={`card ${className}`}>
            <h3 className="card__title">{test.title}</h3>
            <span className="card__price">&#8377; {test.price}</span>
            {addSeeMore ? 
                <div className="card__controls">
                    <AddToCart id={test.id} cart={cart} setCart={setCart}/>
                    {<Link className="card__link" to={`/test/${test.id}`}>SEE MORE</Link>}
                </div>
                :
                <AddToCart className="card__add-to-cart" id={test.id} cart={cart} setCart={setCart}/>
            }
            
        </div>
    )
    
}

export default Card;