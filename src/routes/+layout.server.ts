import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => ({
  viewer: {
    isAdmin: locals.isAdmin
  }
});
