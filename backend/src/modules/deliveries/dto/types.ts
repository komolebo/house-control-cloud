export enum EDeliveryComponentType {
    SENSOR_PIR = "SENSOR_PIR",
    SENSOR_RELAY = "SENSOR_RELAY",
    SENSOR_CLIMATE = "SENSOR_PIR",
    SENSOR_GAS = "SENSOR_GAS",
    SENSOR_SMOKE = "SENSOR_SMOKE",

}

export class CurSysVersionDto {
    sysVersion: string
}

export class SysVerArrDto {
    sysVerArr: string[]
}