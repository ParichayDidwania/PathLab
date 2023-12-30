import { useEffect, useId, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home({ className }) {

    const [testArray, setTestArray] = useState([]);
    const id = useId();

    function trimDescription(description) {
        if(description.length > 200) {
            return (description.slice(0, 200) + "...");
        } else {
            return description;
        }
    }

    useEffect(() => {
        async function fetchHomeData() {
            const response = await fetch(import.meta.env.VITE_URL);
            const data = await response.json();

            let key = 0;
            const tempTestArray = data.data.map(test => {
                key ++;
                return(
                    <div className="card" key={`card-${id}-${key}`}>
                        <h2 className="card__title">{test.title}</h2>
                        <p className="card__description">{trimDescription(test.description)}</p>
                        <span className="card__price">&#8377; {test.price}</span>
                        <Link className="card__link" to={`/test/${test.id}`}>SEE MORE</Link>
                    </div>
                )
            })
            setTestArray(tempTestArray);
            console.log(data);
        }
        fetchHomeData();
    }, [id])

    return(
        <main className={`home-main ${className}`}>
            <form className="search-form">
                <input className="search-form__input" placeholder="Search for a test..."></input>
                <button className="search-form__submit-button" type="submit">&#x1F50E;&#xFE0E;</button>
            </form>
            <div className="cards">
                {testArray}
            </div>
        </main>
    )      
}

export default Home;