import { StringEntity } from '../entities/string.entity';

export class StringResponseDto {
  id: string;
  value: string;
  properties: {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
  };
  created_at: Date;

  constructor(entity: StringEntity) {
    this.id = entity.sha256_hash;
    this.value = entity.value;
    this.created_at = entity.created_at;

    this.properties = {
      length: entity.length,
      is_palindrome: entity.is_palindrome,
      unique_characters: entity.unique_characters,
      word_count: entity.word_count,
      sha256_hash: entity.sha256_hash,
      character_frequency_map: entity.character_frequency_map,
    };
  }
}
