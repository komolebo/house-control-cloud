import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Releases} from "./releases.entity";
import * as semver from "semver";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class DeliveriesService {
    constructor(@InjectModel(Releases) private releaseRepo: typeof Releases,
                private config: ConfigService) {}

    readonly FTP_LINK = "ftp." + this.config.get('MAIN_HOST') + '/releases/'

    async getLatestSysVersion() {
        const releases = await this.releaseRepo.findAll()

        if(!releases || !releases.length) throw new HttpException("No version available", HttpStatus.BAD_GATEWAY)
        releases.sort((a, b) => semver.compare(b.sys_version, a.sys_version))


        return releases[0].sys_version
    }

    async getFlashSequenceFromSysVer(sysVer: string) {
        const releases = await this.releaseRepo.findAll();
        const response = []

        releases.sort((a, b) => semver.compare(a.sys_version, b.sys_version))

        for(const release of releases) {
            const isRelLater = semver.gt(release.sys_version, sysVer)
            const isLatest = release.id === releases[releases.length - 1].id
            if (isRelLater && (release.bridge || isLatest)) {
                response.push(release.sys_version)
            }
        }

        return response
    }

    async getComponentsVersionBySysVer(sysVerArr: string[]) {
        const response = {}
        const releases = await this.releaseRepo.findAll()

        for(const sysVer of sysVerArr) {
            const release = releases.find(el => el.sys_version === sysVer)

            if (release) {
                response[sysVer] = release["dataValues"]
            }
        }

        return response
    }
 }
