import React from "react";
import {navBar, navItem, navLogo, navLogoContainer, navMenu, navMenuItem, navText} from "../styles/NavBar.css";
import {headFont} from "../styles/common/fonts.css";
import {modestBtn} from "../styles/common/buttons.css";

 const NavBar: React.FC = () => {
    return (
        <div id={navBar}>
            <div className={navItem} id={navLogoContainer}>
                <div id={navLogo}/>
                <div id={navText} className={headFont}>HOME.NET </div>
            </div>

            <div className={navItem} id={navMenu}>
                <button id={navMenuItem} className={[modestBtn].join(' ')}>
                    About
                </button>
                <button id={navMenuItem} className={[modestBtn].join(' ')}>
                    Notifications
                </button>
                <button id={navMenuItem} className={[modestBtn].join(' ')}>
                    Account
                </button>
            </div>
        </div>
    )
}

export default NavBar;