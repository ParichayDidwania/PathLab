import { useEffect } from "react";
import "./Home.css";

function Home({ className }) {

    useEffect(() => {
        async function fetchHomeData() {
            const response = await fetch(import.meta.env.VITE_URL);
            const data = await response.json();
            console.log(data);
        }
        fetchHomeData();
    }, [])

    return(
        <main className={`home-main ${className}`}>
            HOME PAGE
        </main>
    )      
}

export default Home;