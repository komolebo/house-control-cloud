import InputMask from "react-input-mask";
import React, {forwardRef} from "react";

export const DEFAULT_COUNTRY_CODE = "38"

const PhoneInputComponent = forwardRef<HTMLInputElement, any>((props, ref) => {
    return <InputMask
        {...props}
        ref={ref}
        mask="+99(999) 999-99-99"
        onChange={props.onChange}
    />
})

export default PhoneInputComponent;