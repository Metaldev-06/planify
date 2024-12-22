import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './index';

@Module({
  controllers: [],
  providers: [CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}
