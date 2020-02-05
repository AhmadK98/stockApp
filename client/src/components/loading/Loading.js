import React from 'react';
import './loading.scss';



function Loading() {

    return (
        <div className="loading">

            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            <div className="loading-text">Loading, please wait.</div>
        </div>
    )
}

export default Loading;