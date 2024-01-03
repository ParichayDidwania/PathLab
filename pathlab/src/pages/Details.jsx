import { useEffect, useId, useState } from "react";
import "./Details.css";
import PatientDetails from "../components/PatientDetails";

function Details({ className, cart }) {

    const key = useId();

    const [patientData, setPatientData] = useState([]);
    const [patientElems, setPatientElems] = useState([]);
    const [patientDetailError, setPatientDetailError] = useState("");
    const maxPatients = Object.values(cart).reduce((acc, curr) => { return acc + curr; })

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
            gender: ""
        });
        setPatientData(patientDataTemp);
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
            
            return data;
        })
    }

    useEffect(() => {
        setPatientData([
            {
                id: 1,
                name: "",
                gender: ""
            }
        ])
    }, []);

    useEffect(() => {
        const tempPatientElems = patientData.map(x => {
            return (
                <PatientDetails key={`${key}-${x.id}`} id={x.id} patientData={patientData} setPatientData={setPatientData} deletePatient={deletePatient}/>
            )
        });

        setPatientElems(tempPatientElems);
        setPatientDetailError("");
    }, [patientData, key])


    return(
        <main className={`details-main ${className}`}>
            <div className="patient-details">
                <div className="patient-details__info">
                    <h2 className="patient-details__heading">Member Details</h2>
                    <span className="patient-details__error">{patientDetailError}</span>
                </div>
                {patientElems}
                <button className="patient-details__add" onClick={addPatient}>ADD MORE</button>
            </div>
        </main>
    )
}   

export default Details;