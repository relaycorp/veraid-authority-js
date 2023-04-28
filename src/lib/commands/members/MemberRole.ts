/**
 * Member role.
 */
export enum MemberRole {
  /**
   * Org admins are allowed to anything in their own organisation.
   */
  ORG_ADMIN = 'ORG_ADMIN',

  /**
   * Regular members are generally allowed to manage their own data.
   */
  REGULAR = 'REGULAR',
}
