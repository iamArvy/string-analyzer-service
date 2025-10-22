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
import { CreateStringDto, StringQueryDto, StringNLQueryDto } from './dto';

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

  @Get('filter-by-natural-language')
  findAllByNLQuery(@Query() { query }: StringNLQueryDto) {
    console.log(query);
    return this.stringsService.filterByNaturalLanguage(query);
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
