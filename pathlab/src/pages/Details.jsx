import { useEffect, useId, useRef, useState } from "react";
import "./Details.css";
import PatientDetails from "../components/PatientDetails";
import Appointment from "../components/Appointment";
import { Link } from "react-router-dom";
import AddressView from "../components/AddressView";

function Details({ className, cart, authToken, address }) {

    const key = useId();
    
    const [patientData, setPatientData] = useState([]);
    const [patientDetailError, setPatientDetailError] = useState("");
    const maxPatients = Object.values(cart).reduce((acc, curr) => { return acc + curr; })

    const [slotData, setSlotData] = useState([]);
    const [slotSelection, setSlotSelection] = useState({});
    const [slotBookingError, setSlotBookingError] = useState("");

    const [addressError, setAddressError] = useState("");

    const [bookButtonText, setBookButtonText] = useState("BOOK");
    const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(false);

    const [pageError, setPageError] = useState("");

    const memberDetailRef = useRef();
    const addressRef = useRef();
    const slotRef = useRef();

    function addPatient() {
        if(patientData.length >= maxPatients) {
            setPatientDetailError("No more members can be added. Please increase the quantity of tests in cart to add more members.")
            return;
        }
        const patientDataTemp = [...patientData];
        let id = patientDataTemp.length + 1;
        patientDataTemp.push({
            id: id,
            name: "",
            gender: "Male"
        });
        setPatientData(patientDataTemp);
        setPatientDetailError("");
    }

    function deletePatient(id) {
        setPatientData((prevData) => {
            if(prevData.length === 1) {
                setPatientDetailError("Atleast 1 member is required.")
                return prevData;
            }

            let data = [];

            for(const elem of prevData) {
                data.push(
                    {...elem}
                )
            }

            data = data.filter(x => x.id != id);

            let newId = 1;
            for(let elem of data) {
                elem.id = newId;
                newId++;
            }
            
            setPatientDetailError("");
            return data;
        })
    }

    async function fetchSlot() {
        let res = await fetch(`${import.meta.env.VITE_URL}/booking/slots`, {
            method: "GET",
            headers: {
                'x-auth-token': authToken
            }
        });
        if(res.status === 200) {
            res = await res.json();
            setSlotData(res.data);
        }
    }

    useEffect(() => {
        setPatientData([
            {
                id: 1,
                name: "",
                gender: "Male"
            }
        ])
        fetchSlot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(Object.keys(slotSelection).length !== 0) {
            setSlotBookingError("");
        }
    }, [slotSelection])

    async function book() {

        if(Object.keys(address).length == 0) {
            setAddressError("Address is required for booking");
            addressRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        setAddressError("");

        for(const data of patientData) {
            if(data.name == "" || data.gender == "") {
                setPatientDetailError("Please fill the empty fields");
                memberDetailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }

        setPatientDetailError("");

        if(!slotSelection.counter || !slotSelection.id) {
            setSlotBookingError("Please select a slot");
            slotRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        setSlotBookingError("");
        setPageError("");
        setIsBookButtonDisabled(true);
        setBookButtonText("BOOKING...");

        let res = await fetch(`${import.meta.env.VITE_URL}/booking/book`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': authToken
            },
            body: JSON.stringify(
                {
                    "cart": cart,
                    "address": address,
                    "members": patientData,
                    "slot": {
                        "counter": slotSelection.counter,
                        "id": slotSelection.id
                    }
                }
            )
        });
        
        if(res.status === 200) {
            res = await res.json();
            if(res.data.url) {
                window.location.href = res.data.url;
            }
        } else {
            res = await res.json();
            console.log(res);
            if(res.for == "slot") {
                setSlotBookingError(res.error);
            } else if (res.for == "page") {
                setPageError(res.error);
            }
            setSlotSelection({});
            fetchSlot();
            setIsBookButtonDisabled(false);
            setBookButtonText("BOOK");
        }
    }

    return(
        <main className={`details-main ${className}`}>
            <div className="details-wrapper" ref={addressRef}>
                <div className="details__info">
                    <h2 className="details__heading">Address Details</h2>
                    <span className="details__error">{addressError}</span>
                </div>
                {Object.keys(address).length == 0 ? 
                    <Link className="details__button" to="/address" state={{ from: "details" }}>ADD ADDRESS</Link>
                    :
                    <>
                        <AddressView className="details__address-view" address={address}/>
                        <Link className="details__button" to="/address" state={{ from: "details" }}>EDIT ADDRESS</Link>
                    </>
                }
            </div>
            <div className="details-wrapper" ref={memberDetailRef}>
                <div className="details__info">
                    <h2 className="details__heading">Member Details</h2>
                    <span className="details__error">{patientDetailError}</span>
                </div>
                {patientData.map(x => {
                    return (
                        <PatientDetails key={`${key}-${x.id}`} id={x.id} patientData={patientData} setPatientData={setPatientData} deletePatient={deletePatient}/>
                    )
                })}
                <button className="details__button" onClick={addPatient}>ADD MORE</button>
            </div>
            <div className="details-wrapper" ref={slotRef}>
                <div className="details__info">
                    <h2 className="details__heading">Select Slot</h2>
                    <span className="details__error">{slotBookingError}</span>
                </div>
                <Appointment className="details__appointment" data={slotData} setSlotSelection={setSlotSelection} slotSelection={slotSelection}/>
            </div>
            <button className="details__book-button" onClick={book} disabled={isBookButtonDisabled}>{bookButtonText}</button>
            <span className="details__error details__page-error">{pageError}</span>
        </main>
    )
}   

export default Details;