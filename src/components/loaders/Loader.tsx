import React from 'react';
import style from "./Loader.module.css"

function Loader() {
    return (
        <div className={style.Application}>
            <div className={style.Background}></div>
            <div className={style.Loader}>Загрузка</div>
        </div>

    );
}

export default Loader;