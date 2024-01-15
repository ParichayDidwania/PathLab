import { useSearchParams } from "react-router-dom";
import "./Search.css";
import { useId } from "react";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

function Search({ className, products, cart, setCart }) {
    const [searchParams] = useSearchParams();
    const id = useId();

    function getIdArray() {
        const title = searchParams.get("title")?.toLowerCase();
        const productIds = [];
        if(title && title != "") {
            for(const product of products) {
                if(product.title.toLowerCase().includes(title)) {
                    productIds.push(product.id);
                }
            }
        }

        return productIds;
    }

    function getCards() {
        const productIds = getIdArray();
        let key = 0;
        const cards = productIds.map((productId) => {
            key ++;
            return(
                <Card className="home-card" cart={cart} setCart={setCart} testId={productId} key={`${key}-${id}`} products={products}/>
            )
        })

        return cards;
    }

    const cards = getCards();

    return (
        <main className={`search-main ${className}`}>
            <SearchBar products={products}/>
            <div className="search-cards">
                {cards}
            </div>
        </main>
    )
}

export default Search;