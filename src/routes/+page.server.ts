import { fail } from '@sveltejs/kit';

import { createSongRequest, getPublicCatalog } from '$lib/server/repository';
import { requestSchema } from '$lib/validators';

import type { Actions, PageServerLoad } from './$types';

const readText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value : '');

export const load: PageServerLoad = async () => ({
  catalog: await getPublicCatalog()
});

export const actions: Actions = {
  default: async ({ request }) => {
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
