import React, {FC} from "react";
import App from "tablet-front";

export const TunnelMirror: FC = () => {
    return <div style={{maxHeight: "85vh", overflowY: "auto"}}>
        <App/>
    </div>
}
export default TunnelMirror;
