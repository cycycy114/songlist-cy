<script lang="ts">
  import { songStatusLabels, type Song, type SongStatus } from '$lib/types';

  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form?: ActionData } = $props();

  let query = $state('');
  let selectedLanguage = $state('all');
  let selectedTag = $state('all');
  let selectedStatus = $state<'all' | SongStatus>('all');

  const normalize = (value: string) => value.trim().toLowerCase();

  const statusClass = (status: SongStatus) => {
    switch (status) {
      case 'ready':
        return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
      case 'learning':
        return 'border-amber-400/20 bg-amber-400/10 text-amber-100';
      case 'resting':
        return 'border-slate-300/10 bg-slate-300/10 text-slate-200';
    }
  };

  const matchesKeyword = (song: Song, keyword: string) => {
    if (!keyword) {
      return true;
    }

    return [song.title, song.artist, ...song.tags].some((value) => normalize(value).includes(keyword));
  };

  const filteredSongs = $derived.by(() => {
    const keyword = normalize(query);

    return data.catalog.songs.filter((song) => {
      const matchesLanguage = selectedLanguage === 'all' || song.language === selectedLanguage;
      const matchesTag = selectedTag === 'all' || song.tags.includes(selectedTag);
      const matchesStatus = selectedStatus === 'all' || song.status === selectedStatus;

      return matchesKeyword(song, keyword) && matchesLanguage && matchesTag && matchesStatus;
    });
  });
</script>

<svelte:head>
  <title>{data.catalog.streamer.name} | 公开歌单</title>
</svelte:head>

<div class="space-y-8 lg:space-y-10">
  <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
    <div class="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/35 lg:p-8">
      <div class="flex flex-wrap items-center gap-3">
        <span class={`inline-flex rounded-full bg-gradient-to-r px-4 py-1 text-sm font-semibold text-slate-950 ${data.catalog.streamer.accent}`}>
          {data.catalog.streamer.name}
        </span>
        <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
          {data.catalog.stats.publicSongs} 首公开曲目
        </span>
        <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
          {data.catalog.stats.pendingRequests} 条待处理愿望
        </span>
        {#if data.catalog.backendMode === 'memory'}
          <span class="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">
            当前使用内存演示数据
          </span>
        {/if}
      </div>

      <div class="mt-5 max-w-3xl space-y-4">
        <h1 class="text-3xl font-semibold tracking-tight text-white lg:text-5xl">
          双端可用、桌面端优先优化的 VTuber 歌单站
        </h1>
        <p class="text-sm leading-7 text-slate-300 lg:text-base">
          观众可以快速搜索主播会唱的歌，按语言、标签、状态筛选；桌面端优先强调信息密度和浏览效率，移动端则保证直播场景下也能顺畅查歌与提交愿望单。
        </p>
      </div>

      <div class="mt-8 grid gap-3 sm:grid-cols-3">
        {#each data.catalog.streamer.platforms as platform}
          <a
            href={platform.href}
            target="_blank"
            rel="noreferrer"
            class="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-slate-900/80 hover:text-white"
          >
            进入 {platform.label}
          </a>
        {/each}
      </div>
    </div>

    <div class="rounded-[28px] border border-white/10 bg-slate-950/50 p-6 lg:p-7">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-sky-200">愿望单提交</p>
          <h2 class="mt-1 text-2xl font-semibold text-white">让主播知道你想听什么</h2>
        </div>
        <div class="hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 lg:block">
          公开提交，无需登录
        </div>
      </div>

      {#if form?.requestMessage}
        <div class="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {form.requestMessage}
        </div>
      {/if}

      {#if form?.requestError}
        <div class="mt-5 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {form.requestError}
        </div>
      {/if}

      <form method="POST" class="mt-5 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="space-y-2 text-sm text-slate-300">
            <span>歌曲名</span>
            <input
              name="songTitle"
              value={form?.requestValues?.songTitle ?? ''}
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:bg-white/8"
              placeholder="例如：群青"
            />
          </label>

          <label class="space-y-2 text-sm text-slate-300">
            <span>原唱</span>
            <input
              name="artist"
              value={form?.requestValues?.artist ?? ''}
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:bg-white/8"
              placeholder="例如：YOASOBI"
            />
          </label>
        </div>

        <label class="space-y-2 text-sm text-slate-300">
          <span>留言</span>
          <textarea name="message" rows="4" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:bg-white/8" placeholder="可以说说为什么想听、适合什么场合唱。">{form?.requestValues?.message ?? ''}</textarea>
        </label>

        <label class="space-y-2 text-sm text-slate-300">
          <span>你的昵称（可选）</span>
          <input
            name="requesterName"
            value={form?.requestValues?.requesterName ?? ''}
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:bg-white/8"
            placeholder="例如：夜猫子"
          />
        </label>

        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-sky-400 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
        >
          提交愿望单
        </button>
      </form>
    </div>
  </section>

  <section class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
    <aside class="h-fit rounded-[28px] border border-white/10 bg-slate-950/50 p-5 lg:sticky lg:top-24">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-medium text-sky-200">公开歌单</p>
          <h2 class="mt-1 text-2xl font-semibold text-white">搜索与筛选</h2>
        </div>
        <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
          {filteredSongs.length} / {data.catalog.songs.length}
        </span>
      </div>

      <div class="mt-5 space-y-4">
        <label class="block space-y-2 text-sm text-slate-300">
          <span>搜索</span>
          <input
            bind:value={query}
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:bg-white/8"
            placeholder="按歌名、原唱、标签搜索"
          />
        </label>

        <label class="block space-y-2 text-sm text-slate-300">
          <span>语言</span>
          <select
            bind:value={selectedLanguage}
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
          >
            <option value="all">全部语言</option>
            {#each data.catalog.languages as language}
              <option value={language}>{language}</option>
            {/each}
          </select>
        </label>

        <label class="block space-y-2 text-sm text-slate-300">
          <span>标签</span>
          <select
            bind:value={selectedTag}
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
          >
            <option value="all">全部标签</option>
            {#each data.catalog.tags as tag}
              <option value={tag}>{tag}</option>
            {/each}
          </select>
        </label>

        <label class="block space-y-2 text-sm text-slate-300">
          <span>当前状态</span>
          <select
            bind:value={selectedStatus}
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400/50"
          >
            <option value="all">全部状态</option>
            {#each data.catalog.statuses as status}
              <option value={status}>{songStatusLabels[status]}</option>
            {/each}
          </select>
        </label>
      </div>
    </aside>

    <div class="space-y-4">
      <div class="hidden overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55 lg:block">
        <div class="grid grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)_120px_140px_1.7fr] gap-4 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          <div>歌曲名</div>
          <div>原唱</div>
          <div>语言</div>
          <div>当前状态</div>
          <div>标签</div>
        </div>

        {#if filteredSongs.length > 0}
          {#each filteredSongs as song, index}
            <div class={`grid grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)_120px_140px_1.7fr] gap-4 px-6 py-5 ${index !== filteredSongs.length - 1 ? 'border-b border-white/8' : ''}`}>
              <div>
                <p class="text-base font-semibold text-white">{song.title}</p>
              </div>
              <div class="text-sm text-slate-200">{song.artist}</div>
              <div class="text-sm text-slate-300">{song.language}</div>
              <div>
                <span class={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusClass(song.status)}`}>
                  {songStatusLabels[song.status]}
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                {#each song.tags as tag}
                  <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
          {/each}
        {:else}
          <div class="px-6 py-16 text-center text-sm text-slate-400">
            当前筛选下没有结果，试试放宽关键词或筛选项。
          </div>
        {/if}
      </div>

      <div class="grid gap-4 lg:hidden">
        {#if filteredSongs.length > 0}
          {#each filteredSongs as song}
            <article class="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-semibold text-white">{song.title}</h3>
                  <p class="mt-1 text-sm text-slate-300">{song.artist}</p>
                </div>
                <span class={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusClass(song.status)}`}>
                  {songStatusLabels[song.status]}
                </span>
              </div>

              <div class="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div>
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-500">语言</p>
                  <p class="mt-1">{song.language}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-500">标签</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    {#each song.tags as tag}
                      <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {tag}
                      </span>
                    {/each}
                  </div>
                </div>
              </div>
            </article>
          {/each}
        {:else}
          <div class="rounded-[24px] border border-dashed border-white/10 bg-slate-950/35 px-4 py-12 text-center text-sm text-slate-400">
            当前筛选下没有歌曲。
          </div>
        {/if}
      </div>
    </div>
  </section>
</div>
