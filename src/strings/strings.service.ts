import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StringEntity } from './entities/string.entity';
import { FilterQuery, Model } from 'mongoose';
import { createHash } from 'crypto';
import {
  CreateStringDto,
  StringQueryDto,
  StringResponseDto,
  StringListResponseDto,
} from './dto';

@Injectable()
export class StringsService {
  constructor(
    @InjectModel(StringEntity.name)
    private model: Model<StringEntity>,
  ) {}

  private analyzeString(value: string) {
    const cleaned = value.toLowerCase().replace(/\s+/g, '');
    const is_palindrome = cleaned === cleaned.split('').reverse().join('');
    const unique_characters = new Set(value).size;
    const word_count = value.trim().split(/\s+/).length;
    const sha256_hash = createHash('sha256').update(value).digest('hex');
    const character_frequency_map = [...value].reduce<Record<string, number>>(
      (acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      },
      {},
    );

    return {
      length: value.length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash,
      character_frequency_map,
    };
  }

  async create(dto: CreateStringDto): Promise<StringResponseDto> {
    if (typeof dto.value !== 'string')
      throw new BadRequestException('Invalid value type');
    const exists = await this.model.findOne({ value: dto.value });
    if (exists) throw new ConflictException('String already exists');

    const props = this.analyzeString(dto.value);

    const created = await this.model.create({
      value: dto.value,
      ...props,
    });

    return new StringResponseDto(created);
  }

  async findAll(query: StringQueryDto): Promise<StringListResponseDto> {
    const filters: FilterQuery<StringEntity> = {};

    if (query?.is_palindrome) filters.is_palindrome = query.is_palindrome;
    if (query?.min_length || query?.max_length) {
      filters.length = {
        ...(query.min_length && { $gte: Number(query.min_length) }),
        ...(query.max_length && { $lte: Number(query.max_length) }),
      };
    }
    if (query?.word_count) filters.word_count = query.word_count;
    if (query?.contains_character)
      filters.value = new RegExp(query.contains_character, 'i');
    const data = await this.model.find(filters);
    return new StringListResponseDto(data, query);
  }

  async findOne(value: string): Promise<StringResponseDto> {
    const exists = await this.model.findOne({ value });
    if (!exists) throw new NotFoundException('String not found');
    return new StringResponseDto(exists);
  }

  async remove(value: string) {
    const deleted = await this.model.findOneAndDelete({ value });
    if (!deleted)
      throw new NotFoundException('String does not exit in the system');
    return;
  }
}
