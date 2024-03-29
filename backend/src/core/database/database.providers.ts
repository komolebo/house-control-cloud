import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../globals/db_constants';
import { databaseConfig } from './database.config';
import * as path from 'path';
import { generateMigration } from "sequelize-typescript-model-migration";
import * as process from "process";
import {Users} from "../../modules/users/user.entity";
import {Devices} from "../../modules/devices/device.entity";
import {Roles} from "../../modules/devices/role.entity";
import {Notifications} from "../../modules/notification/notification.entity";
import {Histories} from "../../modules/history/history.entity";
import {Preference} from "../../modules/preference/preference.entity";
import {Blacklist} from "../../modules/preference/blacklist.entity";
import {Auth} from "../../modules/auth/auth.entity";
import {Routines} from "../../modules/notification/routine.entity";
import {Releases} from "../../modules/deliveries/releases.entity";


function getRealPathFromGenFiles(js_path: string) : string {
    return js_path.replace("\\dist\\", "\\src\\") ||
        js_path.replace("/dist/", "/src/")
}

export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        console.log("RUN MODE", process.env.RUN_MODE)
        let config;
        switch (process.env.RUN_MODE) {
            case DEVELOPMENT:
                config = databaseConfig.development;
                break;
            case TEST:
                config = databaseConfig.test;
                break;
            case PRODUCTION:
                config = databaseConfig.production;
                break;
            default:
                config = databaseConfig.development;
        }
        const sequelize: Sequelize = new Sequelize(config);
        sequelize.addModels([
            Users,
            Roles,
            Devices,
            Notifications,
            Histories,
            Preference,
            Blacklist,
            Auth,
            Routines,
            Releases
        ])

        const cur_dir = getRealPathFromGenFiles(__dirname);

        await sequelize.sync();

        await generateMigration(sequelize, {
            outDir: path.join(cur_dir, "./migrations"),
            snapshotDir: path.join(cur_dir, "./snapshots"),
            migrationName: "migration--dummy-change",
        });

        return sequelize;
    },
}];