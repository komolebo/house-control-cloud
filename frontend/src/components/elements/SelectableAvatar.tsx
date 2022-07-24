import React, {FC} from "react";
import logoAva from "../../../public/avatars/avatar1.svg";

interface IPropAvatar {
    select: boolean;
    path: string;
}

const SelectableAvatar: FC<IPropAvatar> = ({path, select}) => {
    return <div>
        <img src={"/avatars/avatar1.svg"} alt={"Logo ava choose"}/>
    </div>
}