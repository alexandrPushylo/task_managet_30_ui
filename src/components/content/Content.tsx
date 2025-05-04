import React, {CSSProperties, JSX} from 'react';
import {Route, Routes} from "react-router";
import Users from "./users/Users";
import Dashboard from "./dashboard/Dashboard";
import User from "./users/User";
import {useAppSelector} from "../../store/store";
import {applicationSlice} from "../../store/slices/applicationSlice";
import Login from "./Login";
import Logout from "./Logout";
import Technics from "./technics/technics";
import Technic from "./technics/Technic";
import ConstructionSites from "./constructionSite/ConstructionSites";
import ConstructionSite from "./constructionSite/ConstructionSite";
import WorkDaysSheet from "./workDaysSheet/WorkDaysSheet";
import DriverSheet from "./driverSheet/DriverSheet";
import TechnicSheet from "./technicSheet/TechnicSheet";


const cssStyle: CSSProperties = {
    width: '100%',
}

function Content() {
    const isAuthenticated = useAppSelector(applicationSlice.selectors.selectIsAuthenticated);

    const defComponent = (component: JSX.Element) => isAuthenticated ? component : <Login/>;

    return (
        <div style={cssStyle} className="mb-5">
            <Routes>
                <Route path="/dashboard" element={defComponent(<Dashboard/>)}/>

                <Route path="/user/:userId" element={<User/>}/>
                <Route path="/user" element={<User/>}/>
                <Route path="/users" element={defComponent(<Users/>)}/>

                <Route path="/technics" element={defComponent(<Technics/>)}/>
                <Route path="/technic/:technicId" element={defComponent(<Technic/>)}/>
                <Route path="/technic" element={defComponent(<Technic/>)}/>

                <Route path="/construction_sites" element={defComponent(<ConstructionSites/>)}/>
                <Route path="/construction_sites/archive" element={defComponent(<ConstructionSites isArchivePage={true}/>)}/>
                <Route path="/construction_site/:constructionSiteId" element={defComponent(<ConstructionSite/>)}/>
                <Route path="/construction_site" element={defComponent(<ConstructionSite/>)}/>

                <Route path="/work_days" element={defComponent(<WorkDaysSheet/>)}/>
                <Route path="/driver_sheet" element={defComponent(<DriverSheet/>)}/>
                <Route path="/technic_sheet" element={defComponent(<TechnicSheet/>)}/>

                <Route path="/logout" element={<Logout/>}/>
                <Route path="/login" element={<Login/>}/>

                <Route path="*" element={<Dashboard/>}/>
            </Routes>
        </div>
    );


}

export default Content;