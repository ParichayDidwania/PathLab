import { useId, useState } from "react";
import "./SearchBar.css";
import CONSTANTS from "../helpers/constants";
import { useNavigate } from "react-router-dom";

function SearchBar({ className, products }) {
    const [suggestions, setSuggestions] = useState([]);
    const [searchText, setSearchText] = useState("");
    const id = useId();

    const navigate = useNavigate();

    function onSearchValueChange(e) {
        setSearchText(e.target.value);

        const value = e.target.value.toLowerCase();

        if(value == "") {
            setSuggestions([]);
            return;
        }

        const tempSuggestions = [];
        for(const product of products) {
            if(product.title.toLowerCase().includes(value)) {
                tempSuggestions.push(product.title);
            }

            if(tempSuggestions.length >= CONSTANTS.MAX_SUGGESTION_LENGTH) {
                break;
            }
        }

        setSuggestions(tempSuggestions);
    }

    let suggestionPosition = 0;

    function onSubmitSearch(e) {
        e.preventDefault();
        navigate(`/search?title=${searchText}`);
    }

    return(
        <form className={`search-form ${className}`} onSubmit={onSubmitSearch}>
            <div className="search-form__input-wrapper">
                <input className="search-form__input" placeholder="Search for a test..." value={searchText} onChange={onSearchValueChange}></input>
                <ul className={`search-form__suggestion-list ${suggestions.length > 0 && "search-form__suggestion-list--non-empty"}`}>
                    {suggestions.map((suggestion) => {
                        suggestionPosition ++;
                        return (
                            <li key={`${id}-${suggestionPosition}`} 
                            className="search-form__suggestion-item">
                                <button className="search-form__suggestion-button" 
                                    type="button" onClick={(e) => { 
                                            setSearchText(suggestion);
                                            e.target.blur();
                                        }}>{suggestion}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <button className="search-form__submit-button" type="submit">&#x1F50E;&#xFE0E;</button>
        </form>
    )
}

export default SearchBar;