import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission } from './models/permission.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    CommonModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
