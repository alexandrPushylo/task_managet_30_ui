import {EUserPost, IMenuItem} from "./assets"

export function getUserMenuItems(userPost: EUserPost): IMenuItem[] {
    switch (userPost) {
        case EUserPost.ADMINISTRATOR:
            return [
                {
                    name: "Админ страница", onClick: () => {
                        alert("Админ страница")
                    }, afterSeparated: true
                },
                {
                    name: "Info page", onClick: () => {
                        alert("Info page")
                    }, afterSeparated: false
                },
                {
                    name: "Error page", onClick: () => {
                        alert("Error page")
                    }, afterSeparated: false
                },
                {
                    name: "Заявки на технику", onClick: () => {
                        alert("Заявки на технику")
                    }, afterSeparated: true
                },
                {
                    name: "Объекты", onClick: () => {
                        alert("Объекты")
                    }, afterSeparated: false
                },
                {
                    name: "Табель Рабочие дни", onClick: () => {
                        alert("Табель Рабочие дни")
                    }, afterSeparated: true
                },
                {
                    name: "Табель Водители", onClick: () => {
                        alert("Табель Водители")
                    }, afterSeparated: false
                },
                {
                    name: "Табель Техника", onClick: () => {
                        alert("Табель Техника")
                    }, afterSeparated: false
                },
                {
                    name: "Техника", onClick: () => {
                        alert("Техника")
                    }, afterSeparated: true
                },
                {
                    name: "Персонал", onClick: () => {
                        alert("Персонал")
                    }, afterSeparated: false
                },
                {
                    name: "Выйти", onClick: () => {
                        alert("Выйти")
                    }, afterSeparated: true
                }
            ]
        case EUserPost.FOREMAN:
        case EUserPost.MASTER:
            return [
                {
                    name: "Заявки на технику", onClick: () => {
                        alert("Заявки на технику")
                    }, afterSeparated: true
                },
                {
                    name: "Объекты", onClick: () => {
                        alert("Объекты")
                    }, afterSeparated: false
                },
                {
                    name: "Техника", onClick: () => {
                        alert("Техника")
                    }, afterSeparated: true
                },
                {
                    name: "Персонал", onClick: () => {
                        alert("Персонал")
                    }, afterSeparated: false
                },
                {
                    name: "Выйти", onClick: () => {
                        alert("Выйти")
                    }, afterSeparated: true
                }
            ]
        case EUserPost.SUPPLY:
            return [
                {
                    name: "Выйти", onClick: () => {
                        alert("Выйти")
                    }, afterSeparated: true
                }
            ]
        case EUserPost.MECHANIC:
            return [
                {
                    name: "Заявки на технику", onClick: () => {
                        alert("Заявки на технику")
                    }, afterSeparated: true
                },
                {
                    name: "Табель Водители", onClick: () => {
                        alert("Табель Водители")
                    }, afterSeparated: false
                },
                {
                    name: "Табель Техника", onClick: () => {
                        alert("Табель Техника")
                    }, afterSeparated: false
                },
                {
                    name: "Техника", onClick: () => {
                        alert("Техника")
                    }, afterSeparated: true
                },
                {
                    name: "Персонал", onClick: () => {
                        alert("Персонал")
                    }, afterSeparated: false
                },
                {
                    name: "Выйти", onClick: () => {
                        alert("Выйти")
                    }, afterSeparated: true
                }
            ]
        case EUserPost.DRIVER:
            return [
                {
                    name: "Заявки на технику", onClick: () => {
                        alert("Заявки на технику")
                    }, afterSeparated: true
                },
                {
                    name: "Выйти", onClick: () => {
                        alert("Выйти")
                    }, afterSeparated: true
                }
            ]
        case EUserPost.EMPLOYEE:
            return [
                {
                    name: "Заявки на технику", onClick: () => {
                        alert("Заявки на технику")
                    }, afterSeparated: true
                },
                {
                    name: "Выйти", onClick: () => {
                        alert("Выйти")
                    }, afterSeparated: true
                }
            ]
        default:
            return [
                {
                    name: "Заявки на технику", onClick: () => {
                        alert("Заявки на технику")
                    }, afterSeparated: true
                },
                {
                    name: "Выйти", onClick: () => {
                        alert("Выйти")
                    }, afterSeparated: true
                }
            ]
    }
}