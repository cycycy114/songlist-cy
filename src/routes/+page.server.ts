import { fail } from '@sveltejs/kit';

import { readText } from '$lib/server/form-utils';
import { createSongRequest, getPublicCatalog } from '$lib/server/repository';
import { requestSchema } from '$lib/validators';

import type { Actions, PageServerLoad } from './$types';
const requestWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

const canSubmitRequest = (clientId: string) => {
  const now = Date.now();
  const bucket = requestBuckets.get(clientId);

  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(clientId, {
      count: 1,
      resetAt: now + requestWindowMs
    });
    return true;
  }

  if (bucket.count >= maxRequestsPerWindow) {
    return false;
  }

  bucket.count += 1;
  return true;
};

export const load: PageServerLoad = async () => ({
  catalog: await getPublicCatalog()
});

export const actions: Actions = {
  default: async ({ request, getClientAddress }) => {
    const formData = await request.formData();
    const rawValues = {
      songTitle: readText(formData.get('songTitle')),
      artist: readText(formData.get('artist')),
      message: readText(formData.get('message')),
      requesterName: readText(formData.get('requesterName'))
    };

    const parsed = requestSchema.safeParse(rawValues);

    if (!parsed.success) {
      return fail(400, {
        requestError: parsed.error.issues[0]?.message ?? '提交愿望失败。',
        requestValues: rawValues
      });
    }

    if (!canSubmitRequest(getClientAddress())) {
      return fail(429, {
        requestError: '提交过于频繁，请稍后再试。',
        requestValues: rawValues
      });
    }

    try {
      await createSongRequest(parsed.data);
    } catch (error) {
      return fail(500, {
        requestError: error instanceof Error ? error.message : '提交愿望失败。',
        requestValues: rawValues
      });
    }

    return {
      requestMessage: '愿望已提交，主播稍后会在后台处理。',
      requestValues: {
        songTitle: '',
        artist: '',
        message: '',
        requesterName: ''
      }
    };
  }
};
