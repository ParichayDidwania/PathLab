import { useEffect, useId, useRef, useState } from "react";
import "./Appointment.css";
import leftArrow from "../assets/leftArrow.png"
import rightArrow from "../assets/rightArrow.png"

function Appointment({ className, data, setSlotSelection, slotSelection }) {

    const ref = useRef();
    const id = useId();
    const [elems, setElems] = useState([]);

    function right() {
        ref.current.scrollLeft += window.innerWidth * 0.9;
    }

    function left() {
        ref.current.scrollLeft -= window.innerWidth * 0.9;
    }

    useEffect(() => {
        let tempElems = <div className="carousel" ref={ref}>
                            {data.map(day => {
                                return(
                                    <div className="carousel__item" key={`${id}-${day.counter}`}>
                                        <h3 className="carousel__item__heading">{day.onStr}</h3>
                                        <div className="slots">
                                            {day.slots.map((slot) => {
                                                return(
                                                    <button className={`slots__button ${slotSelection.counter == day.counter && slotSelection.id == slot.id && `slots__button--selected`} ${(slot.booked || slot.tempBooked) && `slots__button--disabled`}`} key={`${id}-${day.counter}-${slot.id}`} disabled={slot.booked || slot.tempBooked} onClick={() => {
                                                        setSlotSelection({
                                                            counter: day.counter,
                                                            id: slot.id
                                                        });
                                                    }}>{slot.time}</button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

        setElems(tempElems);

    }, [data, id, setSlotSelection, slotSelection])

    return(
        <div className={`appointment-div ${className}`}>
            <button className="scroll-button left-scroll-button" onClick={left}><img className="arrow-image" alt="A yellow left arrow" src={leftArrow}></img></button>
            {elems}
            <button className="scroll-button right-scroll-button" onClick={right}><img className="arrow-image" alt="A yellow right arrow" src={rightArrow}></img></button>
        </div>
    );
}

export default Appointment;