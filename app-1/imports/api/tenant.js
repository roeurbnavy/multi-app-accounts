import { Meteor } from 'meteor/meteor';

/**
 * Helper to determine the tenant context based on DDP login origin.
 * 
 * @param {string} userId - The Meteor userId
 * @returns {Promise<string>} The tenant context identifier (origin URL, 'standalone', or 'anonymous')
 */
export async function getTenantContext(userId) {
  if (!userId) return 'anonymous';
  const user = await Meteor.users.findOneAsync(userId);
  return user?.services?.multiHost?.origin || 'standalone';
}
