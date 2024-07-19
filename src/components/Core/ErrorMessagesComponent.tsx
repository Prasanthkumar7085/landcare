import { useState } from "react";

const ErrorMessagesComponent = ({ errorMessage }: { errorMessage: string }) => {

    return (
        <div className="errorComponent" style={{ marginBlock: errorMessage ? "2px 0" : "0px", display: errorMessage ? "block" : "none" }}>
            {errorMessage}
        </div>
    )
}


export default ErrorMessagesComponent;