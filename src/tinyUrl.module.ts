import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TinyUrl } from './tinyUrl.entity';
import { TinyUrlService } from './tinyUrl.service';

@Module({
  imports: [TypeOrmModule.forFeature([TinyUrl])],
  providers: [TinyUrlService],
  exports: [TinyUrlService],
})
export class TinyUrlModule {
}
