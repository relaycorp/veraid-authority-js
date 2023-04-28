import { JsonValue } from '../../utils/serialisation/JsonValue.js';
import { NullDeserialiser } from '../../utils/serialisation/NullDeserialiser.js';
import type { PatchRequest } from '../../utils/http.js';
import { Command } from '../Command.js';
import type { EndpointInput } from '../EndpointInput.js';

import type { MemberRole } from './MemberRole.js';

/**
 * Input to the {@link MemberUpdateCommand}.
 * @category Member update
 */
export interface MemberUpdateInput extends EndpointInput {
  /**
   * The name of the member, if they're a user.
   *
   * Set to `null` to remove the name, and convert the member to a bot.
   */
  readonly name?: string | null;

  /**
   * The email address of the member, if they should be allowed to access the API.
   */
  readonly email?: string | null;

  /**
   * The role of the member.
   */
  readonly role?: MemberRole;
}

/**
 * Command to update a member.
 * @category Member update
 */
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
