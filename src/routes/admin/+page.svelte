<script lang="ts">
  import {
    requestStatusLabels,
    requestStatusOptions,
    songStatusLabels,
    songStatusOptions,
    type RequestStatus,
    type SongStatus
  } from '$lib/types';

  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form?: ActionData } = $props();

  const songStatusClass = (status: SongStatus) => {
    switch (status) {
      case 'ready':
        return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
      case 'learning':
        return 'border-amber-400/20 bg-amber-400/10 text-amber-100';
      case 'resting':
        return 'border-slate-300/10 bg-slate-300/10 text-slate-200';
    }
  };

  const requestStatusClass = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return 'border-rose-400/20 bg-rose-400/10 text-rose-100';
      case 'reviewing':
        return 'border-amber-400/20 bg-amber-400/10 text-amber-100';
      case 'planned':
        return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
      case 'declined':
        return 'border-slate-300/10 bg-slate-300/10 text-slate-200';
    }
  };
</script>

<svelte:head>
  <title>后台管理 | VTuber Songboard</title>
</svelte:head>

<div class="space-y-8">
  <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="rounded-[32px] border border-white/10 bg-white/5 p-7 lg:p-8">
      <div class="flex flex-wrap items-center gap-3">
        <span class="rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-1 text-sm font-medium text-sky-100">
          后台控制台
        </span>
        <span class="rounded-full border border-white/10 px-4 py-1 text-xs text-slate-300">
          {data.dashboard.backendMode === 'supabase' ? 'Supabase 数据模式' : '内存演示模式'}
        </span>
      </div>

      <h1 class="mt-4 text-3xl font-semibold text-white lg:text-4xl">管理歌曲与愿望单</h1>
      <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
        这里优先面向桌面端管理效率设计。你可以新增或编辑歌曲、切换公开状态，并快速处理观众提交的愿望单。
      </p>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-500">总歌曲数</p>
          <p class="mt-3 text-3xl font-semibold text-white">{data.dashboard.overview.totalSongs}</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-500">公开歌曲数</p>
          <p class="mt-3 text-3xl font-semibold text-white">{data.dashboard.overview.publicSongs}</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-500">待处理愿望</p>
          <p class="mt-3 text-3xl font-semibold text-white">{data.dashboard.overview.pendingRequests}</p>
        </div>
      </div>
    </div>

    <div class="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 lg:p-7">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-medium text-sky-200">会话</p>
          <h2 class="mt-1 text-2xl font-semibold text-white">管理员操作</h2>
        </div>
        <form method="POST" action="?/logout">
          <button
            type="submit"
            class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-100"
          >
            退出登录
          </button>
        </form>
      </div>

      {#if form?.adminMessage}
        <div class="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {form.adminMessage}
        </div>
      {/if}

      {#if form?.adminError}
        <div class="mt-5 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {form.adminError}
        </div>
      {/if}

      <div class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <p class="font-medium text-white">当前数据来源</p>
        <p class="mt-2 leading-7 text-slate-400">
          {data.dashboard.backendMode === 'supabase'
            ? '已接入 Supabase，增删改查会落到真实数据库。'
            : '当前使用内存演示数据。你现在可以完整体验流程，刷新后数据会回到示例状态。'}
        </p>
      </div>
    </div>
  </section>

  <section class="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
    <div class="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 lg:p-7">
      <div>
        <p class="text-sm font-medium text-sky-200">新增歌曲</p>
        <h2 class="mt-1 text-2xl font-semibold text-white">创建公开歌单条目</h2>
      </div>

      <form method="POST" action="?/saveSong" class="mt-6 space-y-4">
        <label class="block space-y-2 text-sm text-slate-300">
          <span>歌曲名</span>
          <input
            name="title"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
            placeholder="例如：祝福"
          />
        </label>

        <label class="block space-y-2 text-sm text-slate-300">
          <span>原唱</span>
          <input
            name="artist"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
            placeholder="例如：YOASOBI"
          />
        </label>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block space-y-2 text-sm text-slate-300">
            <span>语言</span>
            <input
              name="language"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
              placeholder="例如：日语"
            />
          </label>

          <label class="block space-y-2 text-sm text-slate-300">
            <span>状态</span>
            <select
              name="status"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
            >
              {#each songStatusOptions as status}
                <option value={status}>{songStatusLabels[status]}</option>
              {/each}
            </select>
          </label>
        </div>

        <label class="block space-y-2 text-sm text-slate-300">
          <span>标签（逗号分隔）</span>
          <input
            name="tagsInput"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
            placeholder="例如：高能, 日语, 动画"
          />
        </label>

        <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          <input name="isPublic" type="checkbox" class="h-4 w-4 rounded border-white/20 bg-transparent" checked />
          <span>公开展示到前台歌单</span>
        </label>

        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-sky-400 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
        >
          保存歌曲
        </button>
      </form>
    </div>

    <div class="space-y-6">
      <section class="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 lg:p-7">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-sky-200">歌曲列表</p>
            <h2 class="mt-1 text-2xl font-semibold text-white">已录入曲目</h2>
          </div>
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {data.dashboard.songs.length} 首
          </span>
        </div>

        <div class="mt-6 space-y-4">
          {#each data.dashboard.songs as song}
            <details class="group rounded-[28px] border border-white/10 bg-white/5 p-5 open:bg-slate-950/65">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4">
                <div class="min-w-0">
                  <h3 class="truncate text-lg font-semibold text-white">{song.title}</h3>
                  <p class="mt-1 truncate text-sm text-slate-300">{song.artist} · {song.language}</p>
                </div>
                <div class="flex flex-wrap items-center justify-end gap-2">
                  <span class={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${songStatusClass(song.status)}`}>
                    {songStatusLabels[song.status]}
                  </span>
                  <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {song.isPublic ? '公开' : '隐藏'}
                  </span>
                </div>
              </summary>

              <div class="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_140px]">
                <form method="POST" action="?/saveSong" class="grid gap-4 lg:grid-cols-2">
                  <input type="hidden" name="id" value={song.id} />

                  <label class="block space-y-2 text-sm text-slate-300 lg:col-span-2">
                    <span>歌曲名</span>
                    <input
                      name="title"
                      value={song.title}
                      class="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
                    />
                  </label>

                  <label class="block space-y-2 text-sm text-slate-300">
                    <span>原唱</span>
                    <input
                      name="artist"
                      value={song.artist}
                      class="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
                    />
                  </label>

                  <label class="block space-y-2 text-sm text-slate-300">
                    <span>语言</span>
                    <input
                      name="language"
                      value={song.language}
                      class="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
                    />
                  </label>

                  <label class="block space-y-2 text-sm text-slate-300">
                    <span>状态</span>
                    <select
                      name="status"
                      class="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
                    >
                      {#each songStatusOptions as status}
                        <option value={status} selected={song.status === status}>{songStatusLabels[status]}</option>
                      {/each}
                    </select>
                  </label>

                  <label class="block space-y-2 text-sm text-slate-300">
                    <span>标签</span>
                    <input
                      name="tagsInput"
                      value={song.tags.join(', ')}
                      class="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
                    />
                  </label>

                  <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300 lg:col-span-2">
                    <input
                      name="isPublic"
                      type="checkbox"
                      class="h-4 w-4 rounded border-white/20 bg-transparent"
                      checked={song.isPublic}
                    />
                    <span>在公开歌单展示</span>
                  </label>

                  <button
                    type="submit"
                    class="inline-flex items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-medium text-sky-100 transition hover:bg-sky-400/20 lg:col-span-2"
                  >
                    保存修改
                  </button>
                </form>

                <form method="POST" action="?/deleteSong" class="flex flex-col justify-end">
                  <input type="hidden" name="id" value={song.id} />
                  <button
                    type="submit"
                    class="inline-flex items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-400/20"
                  >
                    删除歌曲
                  </button>
                </form>
              </div>
            </details>
          {/each}
        </div>
      </section>

      <section class="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 lg:p-7">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-sky-200">愿望单管理</p>
            <h2 class="mt-1 text-2xl font-semibold text-white">观众提交记录</h2>
          </div>
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {data.dashboard.requests.length} 条
          </span>
        </div>

        <div class="mt-6 space-y-4">
          {#each data.dashboard.requests as item}
            <article class="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-lg font-semibold text-white">{item.songTitle}</h3>
                    <span class={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${requestStatusClass(item.status)}`}>
                      {requestStatusLabels[item.status]}
                    </span>
                  </div>
                  <p class="mt-2 text-sm text-slate-300">原唱：{item.artist || '未填写'}</p>
                  <p class="mt-3 text-sm leading-7 text-slate-300">{item.message}</p>
                  <div class="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>提交者：{item.requesterName || '匿名'}</span>
                    <span>时间：{new Date(item.createdAt).toLocaleString('zh-CN')}</span>
                  </div>
                </div>

                <form method="POST" action="?/updateRequestStatus" class="flex w-full shrink-0 gap-3 lg:w-auto lg:min-w-[260px] lg:flex-col">
                  <input type="hidden" name="id" value={item.id} />
                  <select
                    name="status"
                    class="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/50"
                  >
                    {#each requestStatusOptions as status}
                      <option value={status} selected={item.status === status}>{requestStatusLabels[status]}</option>
                    {/each}
                  </select>
                  <button
                    type="submit"
                    class="inline-flex items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-medium text-sky-100 transition hover:bg-sky-400/20"
                  >
                    更新状态
                  </button>
                </form>
              </div>
            </article>
          {/each}
        </div>
      </section>
    </div>
  </section>
</div>
