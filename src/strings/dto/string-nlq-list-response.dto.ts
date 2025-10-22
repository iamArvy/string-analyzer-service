// string-list-response.dto.ts
import { StringEntity } from '../entities/string.entity';
import { StringQueryDto } from './string-query.dto';
import { StringResponseDto } from './string-response.dto';

export class StringNaturalQueryListResponseDto {
  data: StringResponseDto[];
  count: number;
  interpreted_query: {
    original: string;
    parsed_filters: StringQueryDto;
  };

  constructor(
    entities: StringEntity[],
    query: string,
    filters: StringQueryDto,
  ) {
    this.data = entities.map((entity) => new StringResponseDto(entity));
    this.count = entities.length;
    this.interpreted_query = {
      original: query,
      parsed_filters: filters,
    };
  }
}
