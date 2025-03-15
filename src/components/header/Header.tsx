import React, {CSSProperties} from "react";
import LogoDate from "./LogoDate";
import HeaderButton from "./HeaderButton";
import UserButton from "./UserButton";

const cssStyle: CSSProperties = {
    minHeight: "2vh",
    maxHeight: "max-content",
    zIndex: 1000,
    backgroundColor: "rgba(52, 58, 64, 0.89)",
    color: "aliceblue"
}

function Header() {
    return (
        <div
            className="navbar container-fluid position-sticky top-0"
            style={cssStyle}
        >
            <LogoDate/>
            <HeaderButton/>
            <UserButton/>
        </div>
    );
}

export default Header;