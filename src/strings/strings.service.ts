import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStringDto } from './dto/create-string.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StringEntity } from './entities/string.entity';
import { FilterQuery, Model } from 'mongoose';
import { createHash } from 'crypto';
import { StringResponseDto } from './dto/string.dto';
import { StringQueryDto } from './dto/string-query.dto';

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

  async create(dto: CreateStringDto) {
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

  async findAll(query: StringQueryDto) {
    const filters: FilterQuery<StringEntity> = {};

    if (query?.isPalindrome) filters.is_palindrome = query.isPalindrome;
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

    return {
      data,
      count: data.length,
      filters_applied: query,
    };
  }

  async findOne(value: string) {
    const exists = await this.model.findOne({ value });
    if (!exists) throw new NotFoundException('String not found');
    return new StringResponseDto(exists);
  }

  async remove(value: string) {
    const deleted = await this.model.findOneAndDelete({ value });
    if (!deleted) throw new NotFoundException('String not found');
    return;
  }
}
