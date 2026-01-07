import { Controller, Post, UseGuards } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';

@Controller('migrations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class MigrationController {
  constructor(private migrationService: MigrationService) {}

  @Post('add-is-active')
  async addIsActiveToUsers() {
    return this.migrationService.addIsActiveToUsers();
  }
}