import React, { useEffect, useState } from 'react';
import './loading.scss';



function Loading() {

    return (
        <div class="loading">

            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            <div class="loading-text">Loading, please wait.</div>
        </div>
    )
}

export default Loading;