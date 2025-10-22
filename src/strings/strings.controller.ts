import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StringsService } from './strings.service';
import { CreateStringDto } from './dto/create-string.dto';
import { StringQueryDto } from './dto/string-query.dto';

@Controller('strings')
export class StringsController {
  constructor(private readonly stringsService: StringsService) {}

  @Post()
  create(@Body() createStringDto: CreateStringDto) {
    return this.stringsService.create(createStringDto);
  }

  @Get()
  findAll(@Query() query: StringQueryDto) {
    return this.stringsService.findAll(query);
  }

  @Get(':value')
  findOne(@Param('value') value: string) {
    return this.stringsService.findOne(value);
  }

  @Delete(':value')
  remove(@Param('value') value: string) {
    return this.stringsService.remove(value);
  }
}
