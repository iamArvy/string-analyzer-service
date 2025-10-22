// string-list-response.dto.ts
import { StringEntity } from '../entities/string.entity';
import { StringQueryDto } from './string-query.dto';
import { StringResponseDto } from './string.dto';

export class StringListResponseDto {
  data: StringResponseDto[];
  count: number;
  filters_applied: StringQueryDto;

  constructor(entities: StringEntity[], filters: StringQueryDto) {
    this.data = entities.map((entity) => new StringResponseDto(entity));
    this.count = entities.length;
    this.filters_applied = filters;
  }
}
