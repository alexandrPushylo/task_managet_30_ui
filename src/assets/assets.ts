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
    onClick: () => void;
    name: string;
    afterSeparated: boolean;
}