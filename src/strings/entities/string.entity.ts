import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at' }, collection: 'strings' })
export class StringEntity extends Document {
  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ required: true, unique: true })
  sha256_hash: string;

  @Prop()
  length: number;

  @Prop()
  is_palindrome: boolean;

  @Prop()
  unique_characters: number;

  @Prop()
  word_count: number;

  @Prop({ type: Object })
  character_frequency_map: Record<string, number>;

  @Prop()
  created_at: Date;
}

export const StringSchema = SchemaFactory.createForClass(StringEntity);
