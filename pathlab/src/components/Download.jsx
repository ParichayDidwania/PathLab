import { useRef } from "react";
import "./Download.css";

function Download({ className }) {

    const downloadLink = useRef();

    async function download(e) {
        e.preventDefault();
        
        let data = await fetch(`${import.meta.env.VITE_URL}/file/download`);
        
        const file = await data.blob();
        const newBlob = new Blob([file], { type: "application/pdf" });
        
        const blobUrl = window.URL.createObjectURL(newBlob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = blobUrl;
        a.download = "report.pdf"; 
        a.click();
    }

    return(
        <a href="" ref={downloadLink} className={`download-button ${className}`} onClick={download} download="report.pdf">Download</a>
    );
}

export default Download;