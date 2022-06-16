import {FC} from "react";
import DevItem, {IProps, TDevRole} from "./DevItem";
import {
    devOwner,
    devOwnerBottom,
    devOwnerConnusr,
    devOwnerConnusrProp,
    devOwnerContain,
    devOwnerTop
} from "../../styles/DeviceItem.css";
import {btn, rmBtn} from "../../styles/common/buttons.css";
import {colRed} from "../../styles/common/colors.css"
import {cntrTxt} from "../../styles/common/position.css";
import {casualMid, casualSmall, underline} from "../../styles/common/fonts.css";

const DevItemOwner: FC<IProps> = ({user}: IProps) => {
    return <div id={devOwnerContain}>
        <DevItem user={user}/>

        <div id={devOwner}>
            <div id={devOwnerTop}>
                <div className={[casualMid].join(' ')}>Connected users [{user.users.length}]: </div>
                {user.users.map(conn_user => {
                    return <div id={devOwnerConnusr}>
                        <div id={devOwnerConnusrProp} className={casualSmall}>
                            - {conn_user.name}
                        </div>
                        <div id={devOwnerConnusrProp} className={casualSmall}>
                            [{TDevRole[conn_user.role]}]
                        </div>
                        <div id={devOwnerConnusrProp} className={casualSmall}>
                            user_id={conn_user.id}
                        </div>
                        <div className={rmBtn} onClick={() => {console.log("good")}}/>
                    </div>
                })}
            </div>

            <div id={devOwnerBottom}>
                <button className={btn}>
                    RESET DEVICE
                </button>

                <div className={[colRed, cntrTxt].join(' ')}>Warning:</div>
                <div className={[colRed, cntrTxt].join(' ')}>
                    this will reset all device users
                </div>
            </div>

        </div>
    </div>
}

export default DevItemOwner;