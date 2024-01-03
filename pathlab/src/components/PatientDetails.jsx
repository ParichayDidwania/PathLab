import "./PatientDetails.css";
import deleteIcon from "../assets/delete.png";
import { useEffect, useState } from "react";

function PatientDetails({ className, id, patientData, setPatientData, deletePatient }) {

    const [name, setName] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        const data = patientData.find(x => x.id == id);
        setName(data.name);
        setGender(data.gender);
    }, [setName, setGender, id, patientData]);

    useEffect(() => {
        const tempPatientsData = [...patientData];
        const tempPatientData = tempPatientsData.find(x => x.id === id);
        tempPatientData.name = name;
        tempPatientData.gender = gender;
        setPatientData(tempPatientsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, gender, setPatientData, id])

    function onNameChange(e) {
        setName(e.target.value);
    }

    function onGenderChange(e) {
        setGender(e.target.value);
    }

    return(
        <div className={`patient-data ${className}`}>
            <div className="patient-data__top">
                <h3>Member #{id}</h3>
                <img className="patient-data__delete" src={deleteIcon} alt="A garbage can" onClick={() => {deletePatient(id)}}></img>
            </div>

            <div className="patient-data__input-controls">
                <label className="patient-data__label">
                    <span className="patient-data__span">NAME</span>
                    <input className="patient-data__input" name="name" value={name} onChange={onNameChange}></input>
                </label>

                <label className="patient-data__label">
                    <span className="patient-data__span">GENDER</span>
                    <select className="patient-data__select" name="gender" value={gender} onChange={onGenderChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                </label>
            </div>
        </div>
    );
}

export default PatientDetails;