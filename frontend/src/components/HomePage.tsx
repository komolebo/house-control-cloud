import React, {FC} from "react";
import DevList from "./devices/DevList";

const HomePage: FC = () => {
    return (
        <div>
            <DevList/>
            <div>Bottom part</div>

            {/*<button className={wideBtn}>*/}
            {/*    Add new device*/}
            {/*</button>*/}
        </div>
    )
}

export default HomePage;