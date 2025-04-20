import React from 'react';
import {useFetchConstructionSites} from "../../../api/constructionSiteApi";
import ConstrSiteItem from "./ConstrSiteItem";

export default function AdminDashboard() {
    const {constrSites, isLoading} = useFetchConstructionSites();
    return (
        <div className="mt-3 mx-auto">
            {constrSites?.map((CS_Item, index) => {
                if (!CS_Item.isArchive && CS_Item.status){
                    return <ConstrSiteItem
                        key={index}
                        constrSiteItem={CS_Item}
                    />
                }
            })
            }
        </div>
    );
}
