import "./AdminResultSummary.css";

function AdminResultSummary({ className, currentPage = 0, totalPages = 0, current = 0, total = 0 }) {
    return (
        <div className={`admin-result-summary ${className}`}>
            <div className="admin-result-summary__pages">
                <span>Current Page : {currentPage}</span>
                <span>Total Pages : {totalPages}</span>
            </div>
            <span>Results Displayed : {current} of {total}</span>
        </div>
    )
}

export default AdminResultSummary;