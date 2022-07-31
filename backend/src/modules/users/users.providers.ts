import { Users } from './user.entity';
import { USER_REPOSITORY } from '../../core/globals/db_constants';

export const usersProviders = [{
    provide: USER_REPOSITORY,
    useValue: Users,
}];