import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants/index1';
import { databaseConfig } from './database.config';
import * as path from 'path';
import { generateMigration } from "sequelize-typescript-model-migration";
import * as process from "process";
import {Users} from "../../modules/users/user.entity";
import {Devices} from "../../modules/devices/device.entity";
import {Roles} from "../../modules/devices/role.entity";


function getRealPathFromGenFiles(js_path: string) : string {
    return js_path.replace("\\dist\\", "\\src\\") ||
        js_path.replace("/dist/", "/src/")
}

export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
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

        const cur_dir = getRealPathFromGenFiles(__dirname);

        await generateMigration(sequelize, {
            outDir: path.join(cur_dir, "./migrations"),
            snapshotDir: path.join(cur_dir, "./snapshots"),
            migrationName: "migration--init",
        });

        await sequelize.sync();

        return sequelize;
    },
}];