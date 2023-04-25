import type { MemberRole } from '../apiTypes/MemberRole.js';
import { JsonValue } from '../utils/serialisation/JsonValue.js';
import { NullDeserialiser } from '../utils/serialisation/NullDeserialiser.js';
import type { PatchRequest } from '../utils/http.js';

import { Command } from './Command.js';

export interface MemberUpdateInput {
  readonly endpoint: string;

  readonly name?: string | null;
  readonly email?: string | null;
  readonly role?: MemberRole;
}

export class MemberUpdateCommand extends Command<MemberUpdateInput, null, null> {
  public responseDeserialiser = new NullDeserialiser();

  public getRequest(): PatchRequest {
    const body = new JsonValue({
      name: this.input.name,
      email: this.input.email,
      role: this.input.role,
    });
    return {
      body,
      path: this.input.endpoint,
      method: 'PATCH',
    };
  }

  public getOutput(): null {
    return null;
  }
}