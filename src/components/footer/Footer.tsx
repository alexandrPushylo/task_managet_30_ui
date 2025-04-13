import {Route, Routes} from "react-router";
import React, {CSSProperties} from 'react';
import UsersFooter from "./UsersFooter";
import TechnicsFooter from "./TechnicsFooter";
import ConstructionSiteFooter from "./ConstructionSiteFooter";
import ConstructionSiteArchivesFooter from "./ConstructionSiteArchiveFooter";


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
            <Routes>
                <Route path="/dashboard" element={<></>}/>

                {/*<Route path="/user/:userId" element={<></>}/>*/}
                <Route path="/users" element={<UsersFooter/>}/>
                <Route path="/technics" element={<TechnicsFooter/>}/>
                <Route path="/construction_sites" element={<ConstructionSiteFooter/>}/>
                <Route path="/construction_sites/archive" element={<ConstructionSiteArchivesFooter/>}/>



                <Route path="/logout" element={<></>}/>
                <Route path="/login" element={<></>}/>

                <Route path="*" element={<></>}/>
            </Routes>
        </div>
    );
}

export default Footer;