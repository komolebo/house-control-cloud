import { User } from './user.entity';
import { USER_REPOSITORY } from '../../core/constants/index1';

export const usersProviders = [{
    provide: USER_REPOSITORY,
    useValue: User,
}];