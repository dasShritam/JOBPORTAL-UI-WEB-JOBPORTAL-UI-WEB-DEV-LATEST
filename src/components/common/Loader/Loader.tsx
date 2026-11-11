import React from 'react'

const loading= require('../../../assets/images/opener-loading.gif')

function Loader() {
    return (
        <div className="loader-overlay">
            <img src={loading} width={200}></img>
        </div>
    );
}

export default Loader