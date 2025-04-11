import {EUserPost, IMenuItem} from "./assets"
import {
    adminItem,
    applicationTechnicItem,
    constructionSiteItem,
    driverSheetItem,
    errorItem,
    infoItem, logoutItem, technicSheetItem, technicsItem, usersItem,
    workDayItem
} from "./pagesData"


export function getUserMenuItems(userPost: EUserPost): IMenuItem[] {
    switch (userPost) {
        case EUserPost.ADMINISTRATOR:
            return [
                adminItem,
                infoItem,
                errorItem,
                applicationTechnicItem,
                constructionSiteItem,
                workDayItem,
                driverSheetItem,
                technicSheetItem,
                technicsItem,
                usersItem,
                logoutItem
            ]
        case EUserPost.FOREMAN:
        case EUserPost.MASTER:
            return [
                applicationTechnicItem,
                constructionSiteItem,
                technicsItem,
                usersItem,
                logoutItem
            ]
        case EUserPost.SUPPLY:
            return [
                logoutItem
            ]
        case EUserPost.MECHANIC:
            return [
                applicationTechnicItem,
                driverSheetItem,
                technicSheetItem,
                technicsItem,
                usersItem,
                logoutItem
            ]
        case EUserPost.DRIVER:
            return [
                applicationTechnicItem,
                logoutItem
            ]
        case EUserPost.EMPLOYEE:
            return [
                applicationTechnicItem,
                logoutItem
            ]
        default:
            return [
                applicationTechnicItem,
                logoutItem
            ]
    }
}

export function getEUserPost(post: string | undefined): EUserPost {
    switch (post) {
        case EUserPost.ADMINISTRATOR:
            return EUserPost.ADMINISTRATOR
        case EUserPost.FOREMAN:
            return EUserPost.FOREMAN
        case EUserPost.MASTER:
            return EUserPost.MASTER
        case EUserPost.SUPPLY:
            return EUserPost.SUPPLY
        case EUserPost.MECHANIC:
            return EUserPost.MECHANIC
        case EUserPost.DRIVER:
            return EUserPost.DRIVER
        case EUserPost.EMPLOYEE:
            return EUserPost.EMPLOYEE
        default:
            return EUserPost.EMPLOYEE
    }
}
