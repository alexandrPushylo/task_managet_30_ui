import React, {CSSProperties} from 'react';


const cssStyle: CSSProperties = {
    width: "100%",
    backgroundColor: "rgba(73, 79, 84, 0.32)"
}

function Footer() {
    return (
        <div
            style={cssStyle}
            className="navbar container-fluid position-fixed bottom-0"
        >

        </div>
    );
}

export default Footer;