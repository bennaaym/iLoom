import {EUserRole} from '@common/types';
import {SetMetadata} from '@nestjs/common';

export const USER_ROLES = 'roles';
export const Roles = (...roles: EUserRole[]) => SetMetadata(USER_ROLES, roles);
