import { useSearchParams } from "react-router-dom";
import "./Search.css";
import { useEffect, useId, useState} from "react";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import CONSTANTS from "../helpers/constants";

function Search({ className, products, cart, setCart }) {
    const [searchParams] = useSearchParams();
    const id = useId();
    const [closestProducts, setClosestProducts] = useState([]);
    const [showlimit, setShowLimit] = useState(CONSTANTS.PAGINATION_LIMIT);

    useEffect(() => {
        const title = searchParams.get("title")?.toLowerCase();
        const productIds = [];
        if(title && title != "") {
            for(const product of products) {
                let str1 = product.title.toLowerCase();
                let str2 = title;
                
                const length = Math.min(str1.length, str2.length);
                let distance = 0;

                for(let i = 0; i < length; i++) {
                    distance += Math.abs(str1.charCodeAt(i) - str2.charCodeAt(i));
                }

                productIds.push({id: product.id, distance: distance});
            }
        }

        productIds.sort((a, b) => {
            return a.distance - b.distance;
        })

        setClosestProducts(productIds.map((product) => {
            return product.id;
        }));
    }, [products, searchParams]);

    let key = 0;
    const cards = closestProducts.slice(0, showlimit).map((productId) => {
        key ++;
        return(
            <Card className="home-card" cart={cart} setCart={setCart} testId={productId} key={`${key}-${id}`} products={products}/>
        )
    })

    return (
        <main className={`search-main ${className}`}>
            <SearchBar products={products}/>
            <div className="search-cards">
                {cards.length > 0 ? cards : <span className="search-span-no-result">No results found</span>}
            </div>
            {showlimit < closestProducts.length && <button className="booking-main__show-more-button" onClick={() => { setShowLimit((prev) => prev + CONSTANTS.PAGINATION_LIMIT) }}>Show More</button>}
        </main>
    )
}

export default Search;
