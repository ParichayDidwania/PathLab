import { useEffect, useId, useState } from "react";
import "./Home.css";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

function Home({ className, cart, setCart, products }) {

    const [testArray, setTestArray] = useState([]);
    const id = useId();

    // function trimDescription(description) {
    //     if(description.length > 200) {
    //         return (description.slice(0, 200) + "...");
    //     } else {
    //         return description;
    //     }
    // }

    useEffect(() => {
        async function fetchHomeData() {
            const response = await fetch(import.meta.env.VITE_URL);
            const data = await response.json();

            let key = 0;
            const tempTestArray = data.data.map(testId => {
                key ++;
                return(
                    <Card className="home-card" cart={cart} setCart={setCart} testId={testId} key={`${key}-${id}`} products={products}/>
                )
            })
            setTestArray(tempTestArray);
        }
        fetchHomeData();
    }, [id, cart, setCart, products])

    return(
        <main className={`home-main ${className}`}>
            <h2 className="home-main__heading">Tests</h2>
            <SearchBar products={products}/>
            <div className="cards">
                {testArray}
            </div>
        </main>
    )      
}

export default Home;