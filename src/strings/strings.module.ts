import { Module } from '@nestjs/common';
import { StringsService } from './strings.service';
import { StringsController } from './strings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StringEntity, StringSchema } from './entities/string.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StringEntity.name, schema: StringSchema },
    ]),
  ],
  controllers: [StringsController],
  providers: [StringsService],
})
export class StringsModule {}
