export enum EHeaderButtonContext {
    goToMain = "На главную",
    existConflicts = "Имеются конфликты",
    submitAll = "Подать все заявки",
    approveAll = "Одобрить все",
    sendAll = "Отправить все",
    reSendAll = "Повторно отправить",
}

export enum EBtnColorClass {
    goToMain = "btn-primary",
    existConflicts = "btn-danger",
    submitAll = "btn-warning",
    approveAll = "btn-success",
    sendAll = "btn-warning",
    reSendAll = "btn-outline-secondary",
}

export type PostTitle = "administrator" | "foreman" | "master" | "driver" | "mechanic" | "supply" | "employee";
export type AcceptMode = "auto" | "manual" | "off"
export type AppTodayStatus = "absent" | "saved" | "submitted" | "approved" | "send";

export enum EUserPost {
    ADMINISTRATOR = "administrator",
    FOREMAN = "foreman",
    MASTER = "master",
    DRIVER = "driver",
    MECHANIC = "mechanic",
    SUPPLY = "supply",
    EMPLOYEE = "employee"
}


export interface IMenuItem {
    href: string;
    name: string;
    afterSeparated: boolean;
    action?: () => {}
}

export interface IUsers {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    telephone?: string;
    password: string
    telegram_id_chat?: string
    post: PostTitle;
    supervisor_user_id: number | null;
    isArchive: boolean;
    // last_login?: string;
}

export interface IUser {
    "id": number | undefined;
    "username": string;
    "password": string;
    "first_name": string;
    "last_name": string;
    "telephone": string;
    "telegram_id_chat": bigint;
    "post": string;
    "supervisor_user_id": number | undefined;
    "isArchive": boolean;
    "last_login": string;
    "is_show_panel": boolean;
    "is_show_saved_app": boolean;
    "is_show_absent_app": boolean;
    "is_show_technic_app": boolean;
    "is_show_material_app": boolean;
    "filter_construction_site": string;
    "filter_foreman": string;
    "filter_technic": string;
    "sort_by": string;
    "color_title": string;
    "font_size": string;
}

export interface IForeman {
    "id": number;
    "username": string;
    "password": string;
    "first_name": string;
    "last_name": string;
}


export interface IPosts {
    title: PostTitle;
    description: string;
}


/////
export interface applicationData {
    accept_mode: boolean;
    current_weekday: string;
    next_work_day: string;
    prev_work_day: string;
    today: string;
    view_mode: string;
    weekday: string;
    current_user: IUsers;
}

export const ColumnsCountBreakPoints = {
    320: 1,
    640: 2,
    960: 3,
    1280: 4,
    1600: 5,
    1920: 6,
    2240: 7,
    2560: 8
}

export const msgREJECT = 'ОТКЛОНЕНА\n'