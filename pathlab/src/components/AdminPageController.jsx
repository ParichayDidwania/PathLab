import { useId } from "react";
import "./AdminPageController.css";
import CONSTANTS from "../helpers/constants";

function AdminPageController({ className, current_skip = 0, total = 1, getPageDetails, setStart }) {

    const id = useId();

    const { totalPages, currentPage } = getPageDetails(current_skip, total);

    const windowSize = 5;
    const windowHalf = Math.floor(windowSize/2);
    const pages = [];

    let elementsLeft = windowSize - 1;
    let isLeftBlocked = false;
    let isRightBlocked = false;

    for(let i = 1; i <= windowHalf; i++ ) {
        if(currentPage - i >= 1) {
            pages.unshift(currentPage - i);
            elementsLeft--;
        } else {
            isLeftBlocked = true;
            break;
        }
    }

    pages.push(currentPage);

    for(let i = 1; i <= windowHalf; i++ ) {
        if(currentPage + i <= totalPages) {
            pages.push(currentPage + i);
            elementsLeft--;
        } else {
            isRightBlocked = true;
            break;
        }
    }

    if(elementsLeft != 0) {
        if(!isRightBlocked && isLeftBlocked) {
            let lastElem = pages[pages.length - 1];
            let i = 1;
            while(elementsLeft != 0 && i + lastElem <= totalPages) {
                pages.push(i + lastElem);
                elementsLeft--;
                i++;
            }
        } else if (!isLeftBlocked && isRightBlocked) {
            let firstElem = pages[0];
            let i = 1;
            while(elementsLeft != 0 && firstElem - i >= 1) {
                pages.unshift(firstElem - i);
                elementsLeft--;
                i++;
            }
        }
    }

    let currentPageElementCount = 0;

    function firstPage() {
        setStart(0);
    }

    function lastPage() {
        setStart((totalPages - 1) * CONSTANTS.PAGINATION_LIMIT);
    }

    function nextPage() {
        if(currentPage + 1 <= totalPages) {
            setStart(currentPage * CONSTANTS.PAGINATION_LIMIT);
        }
    }

    function prevPage() {
        if(currentPage - 1 >= 1) {
            setStart((currentPage - 2)  * CONSTANTS.PAGINATION_LIMIT);
        }
    }
    
    return (
        <div className={`admin-page-controller ${className}`}>
            <button className="admin-page-controller__direction-controls" onClick={firstPage}>&lt;&lt;</button>
            <button className="admin-page-controller__direction-controls" onClick={prevPage}>&lt;</button>
            <div className="admin-page-controller__pages">
                {
                    pages.map((page) => {
                        currentPageElementCount ++;
                        return(
                            <button className={`admin-page-controller__page ${currentPage == page && "admin-page-controller__page--selected"}`} key={`${id}-${currentPageElementCount}`} onClick={() => {
                                setStart((page - 1) * CONSTANTS.PAGINATION_LIMIT);
                            }}>{page}</button>
                        )
                    })
                }
            </div>
            <button className="admin-page-controller__direction-controls" onClick={nextPage}>&gt;</button>
            <button className="admin-page-controller__direction-controls" onClick={lastPage}>&gt;&gt;</button>
        </div>
    )
}

export default AdminPageController
