import {TDevRole} from "../devices/DevItem";
import {Chip} from "@mui/material";
import React, {FC} from "react";

interface IRoleColorProp {
    role: TDevRole
}

const RoleColor = (role: TDevRole) => {
    switch (role) {
        case TDevRole.OWNER:
            return "error"
        case TDevRole.GUEST:
            return "warning";
        case TDevRole.CHILD:
            return "info";
        default:
            return "default"
    }
}

export const ColorRoleLabel: FC<IRoleColorProp> = ({role}) => {
    return <div>
        <Chip label={TDevRole[role]}
              color={RoleColor(role)}
              sx={{borderRadius: "6px"}} />
    </div>
}