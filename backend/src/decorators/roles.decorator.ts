import { SetMetadata } from '@nestjs/common';

/**
 * Roles Decorator
 * Use this decorator on controller methods to specify required roles
 * Example: @Roles('admin', 'technician')
 *
 * Must be used with @UseGuards(JwtAuthGuard, RolesGuard)
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
