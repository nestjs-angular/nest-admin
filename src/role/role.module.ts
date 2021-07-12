import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './models/role.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    CommonModule
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [
    RoleService
  ]
})
export class RoleModule {}
