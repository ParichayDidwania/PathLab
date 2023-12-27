import { useState } from "react";
import "./Upload.css";

function Upload({ className }) {
    const [file, setFile] = useState("");

    function onSubmit(e) {
        e.preventDefault();
        const form = new FormData();
        form.append("file", file);
        fetch(`${import.meta.env.VITE_URL}/file/upload`, {
            method: "POST",
            body: form
        })
    }

    return(
        <form className={`upload-form ${className}`} onSubmit={onSubmit}>
            <input type="file" accept="application/pdf" onChange={(e) => { setFile(e.target.files[0]) }} required></input>
            <button type="submit">Upload</button>
        </form>
    )
}

export default Upload;