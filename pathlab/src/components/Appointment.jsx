import { useEffect, useId, useRef, useState } from "react";
import "./Appointment.css";

function Appointment({ className, data }) {

    const ref = useRef();
    const id = useId();
    const [elems, setElems] = useState([]);
    const [slotSelection, setSlotSelection] = useState("");

    function right() {
        ref.current.scrollLeft += 400;
    }

    function left() {
        ref.current.scrollLeft -= 400;
    }

    useEffect(() => {
        let tempElems = <div className="carousel" ref={ref}>
                            {data.map(day => {
                                return(
                                    <div className="carousel__item" key={`${id}-${day.id}`}>
                                        <span>{day.date}</span>
                                        <div className="slots">
                                            {day.slots.map((slot) => {
                                                return(
                                                    <button className={`slots__button ${slotSelection === `${slot.id}` && `slots__button--selected`}`} key={`${id}-${slot.id}`} disabled={slot.available} value={`${id}-${slot.id}`} onClick={() => {
                                                        setSlotSelection(slot.id);
                                                    }}>{slot.time}</button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

        setElems(tempElems);

    }, [data, id, slotSelection])

    return(
        <div className={`appointment-div ${className}`}>
            <button className="scroll-button btn-2" onClick={left}>Left</button>
            {elems}
            <button className="scroll-button btn-1" onClick={right}>Right</button>
        </div>
    );
}

export default Appointment;