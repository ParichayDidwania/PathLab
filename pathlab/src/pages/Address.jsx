import { useLocation, useNavigate } from "react-router-dom";
import "./Address.css";
import { useEffect, useState } from "react";

function Address({ className, authToken, address, setAddress }) {

    const [addressMessage, setAddressMessage] = useState("");
    const [addressError, setAddressError] = useState("");

    const [buttonText, setButtonText] = useState(address && Object.keys(address).length > 0 ? "UPDATE" : "ADD");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [address_1, setAddress_1] = useState(address?.address_1 || "");
    const [address_2, setAddress_2] = useState(address?.address_2 || "");
    const [city, setCity] = useState(address?.city || "");
    const [state, setState] = useState(address?.state || "");
    const [zipCode, setZipCode] = useState(address?.zipCode || "");
    const [phone, setPhone] = useState(address?.phone || "");

    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(location.state?.from == "details") {
            setAddressMessage("Add address to proceed with payment");
        }
    }, [location])

    async function saveAddress(e) {
        e.preventDefault();

        setAddressMessage("");

        if(address_1 == "" || city == "" || state == "" || zipCode == "" || phone == "") {
            setAddressError("Please fill all the required fields");
            return;
        }

        const regex = new RegExp('^\\d+$');
        
        if(!regex.test(zipCode) || zipCode.length != 6) {
            setAddressError("Please enter a valid Zip Code");
            return;
        }

        if(!regex.test(phone) || phone.length != 10) {
            setAddressError("Please enter a valid Phone Number");
            return;
        }

        setAddressError("");
        setIsButtonDisabled(true);
        setButtonText("SAVING...");

        let res = await fetch(`${import.meta.env.VITE_URL}/address`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': authToken
            },
            body: JSON.stringify({
                address_1, address_2, city, state, zipCode, phone
            })
        });

        setButtonText(address && Object.keys(address).length > 0 ? "UPDATE" : "ADD");
        setIsButtonDisabled(false);

        if(res.status === 200) {
            res = await res.json();
            setAddress(res.data);
            if(location.state?.from == "details") {
                navigate('/details');
            } else {
                setAddressMessage("Address Updated Successfully");
            }
        } else {
            setAddressError("Address Update Failed as the server is experiencing issues");
        }
    }

    return(
        <main className={`address-main ${className}`}>
            <form className="address-form" onSubmit={saveAddress}>
                <h2 className="address-form__heading">Address</h2>
                <span className="address-form__info">All fields marked with an asterisk(<span className="address-form--required">*</span>) are required</span>
                <span className="address-form__error">{addressError}</span>
                <span className="address-form__message">{addressMessage}</span>

                <label className="address-form__label" htmlFor="address_1">Address Line 1<span className="address-form--required">*</span></label>
                <input className="address-form__input" id="address_1" name="address_1" value={address_1} onChange={(e) => { setAddress_1(e.target.value) }}></input>

                <label className="address-form__label" htmlFor="address_2">Address Line 2</label>
                <input className="address-form__input" id="address_2" name="address_2" value={address_2} onChange={(e) => { setAddress_2(e.target.value) }}></input>

                <label className="address-form__label" htmlFor="city">City<span className="address-form--required">*</span></label>
                <input className="address-form__input" id="city" name="city" value={city} onChange={(e) => { setCity(e.target.value) }}></input>

                <label className="address-form__label" htmlFor="state">State<span className="address-form--required">*</span></label>
                <input className="address-form__input" id="state" name="state" value={state} onChange={(e) => { setState(e.target.value) }}></input>

                <label className="address-form__label" htmlFor="zip_code">Zip Code<span className="address-form--required">*</span></label>
                <input className="address-form__input" id="zip_code" name="zip_code" type="number" value={zipCode} onChange={(e) => { setZipCode(e.target.value) }}></input>

                <label className="address-form__label" htmlFor="phone">Phone Number<span className="address-form--required">*</span></label>
                <div className="address-form__phone-wrapper">
                    <span className="address-form__phone-span">+91</span>
                    <input className="address-form__input address-form__phone-input" id="phone" name="phone" type="number" value={phone} onChange={(e) => { setPhone(e.target.value) }}></input>
                </div>

                <button className="address-form__submit" disabled={isButtonDisabled} type="submit">{buttonText}</button>
            </form>
        </main>
    )
}

export default Address;