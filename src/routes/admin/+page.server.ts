import { fail, redirect } from '@sveltejs/kit';

import { clearAdminSession } from '$lib/server/auth';
import {
  deleteSong as removeSong,
  getAdminDashboardData,
  saveSong,
  updateRequestStatus
} from '$lib/server/repository';
import { requestStatusSchema, songSchema } from '$lib/validators';

import type { Actions, PageServerLoad } from './$types';

const readText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value : '');
const readBoolean = (value: FormDataEntryValue | null) => value === 'on';

export const load: PageServerLoad = async () => ({
  dashboard: await getAdminDashboardData()
});

export const actions: Actions = {
  saveSong: async ({ request }) => {
    const formData = await request.formData();
    const rawValues = {
      id: readText(formData.get('id')),
      title: readText(formData.get('title')),
      artist: readText(formData.get('artist')),
      language: readText(formData.get('language')),
      status: readText(formData.get('status')),
      tagsInput: readText(formData.get('tagsInput')),
      isPublic: readBoolean(formData.get('isPublic'))
    };

    const parsed = songSchema.safeParse(rawValues);

    if (!parsed.success) {
      return fail(400, {
        adminError: parsed.error.issues[0]?.message ?? '保存歌曲失败。'
      });
    }

    try {
      await saveSong({
        id: parsed.data.id || undefined,
        title: parsed.data.title,
        artist: parsed.data.artist,
        language: parsed.data.language,
        status: parsed.data.status,
        tags: parsed.data.tagsInput,
        isPublic: parsed.data.isPublic
      });
    } catch (error) {
      return fail(500, {
        adminError: error instanceof Error ? error.message : '保存歌曲失败。'
      });
    }

    return {
      adminMessage: '歌曲信息已保存。'
    };
  },

  deleteSong: async ({ request }) => {
    const formData = await request.formData();
    const id = readText(formData.get('id'));

    if (!id) {
      return fail(400, {
        adminError: '缺少歌曲 ID。'
      });
    }

    try {
      await removeSong(id);
    } catch (error) {
      return fail(500, {
        adminError: error instanceof Error ? error.message : '删除歌曲失败。'
      });
    }

    return {
      adminMessage: '歌曲已删除。'
    };
  },

  updateRequestStatus: async ({ request }) => {
    const formData = await request.formData();
    const rawValues = {
      id: readText(formData.get('id')),
      status: readText(formData.get('status'))
    };

    const parsed = requestStatusSchema.safeParse(rawValues);

    if (!parsed.success) {
      return fail(400, {
        adminError: parsed.error.issues[0]?.message ?? '更新愿望状态失败。'
      });
    }

    try {
      await updateRequestStatus(parsed.data);
    } catch (error) {
      return fail(500, {
        adminError: error instanceof Error ? error.message : '更新愿望状态失败。'
      });
    }

    return {
      adminMessage: '愿望状态已更新。'
    };
  },

  logout: async ({ cookies }) => {
    clearAdminSession(cookies);
    throw redirect(303, '/admin/login');
  }
};
