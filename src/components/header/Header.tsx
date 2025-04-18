import React, {CSSProperties} from "react";
import LogoDate from "./LogoDate";
import HeaderButton from "./HeaderButton";
import UserButton from "./UserButton";
import {useAppSelector} from "../../store/store";
import {applicationSlice} from "../../store/slices/applicationSlice";

const cssStyle: CSSProperties = {
    minHeight: "2vh",
    maxHeight: "max-content",
    zIndex: 1000,
    backgroundColor: "rgba(52, 58, 64, 0.89)",
    color: "aliceblue"
}


function Header() {
    const isAuthenticated = useAppSelector(applicationSlice.selectors.selectIsAuthenticated);

    return (
        <div
            className="navbar container-fluid position-sticky top-0"
            style={cssStyle}
        >
            {isAuthenticated ? <>
                <LogoDate/>
                <HeaderButton/>
                <UserButton/>
            </> : <>
                <div></div>
                <div></div>
                <div>register</div>
            </>

            }
        </div>
    );
}

export default Header;