import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  avatar: string;

  @Prop()
  avatarHash: string;

  @Prop()
  date_added: number;
}

export const UserSchema = SchemaFactory.createForClass(User);