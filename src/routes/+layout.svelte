<script lang="ts">
  import '../app.css';

  import type { Snippet } from 'svelte';

  import type { LayoutData } from './$types';

  let { data, children } = $props<{ data: LayoutData; children: Snippet }>();
</script>

<svelte:head>
  <title>VTuber Songboard</title>
  <meta
    name="description"
    content="单主播 VTuber 歌单站，支持公开歌单展示、搜索筛选、愿望单提交与后台管理。"
  />
</svelte:head>

<div class="min-h-screen">
  <header class="sticky top-0 z-20 border-b border-white/10 bg-slate-950/72 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
      <a href="/" class="flex items-center gap-3 text-sm font-medium text-slate-100">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-sky-400 to-cyan-300 text-base font-semibold text-slate-950">
          歌
        </span>
        <span class="flex flex-col">
          <span class="text-base font-semibold">VTuber Songboard</span>
          <span class="text-xs text-slate-400">单主播歌单与愿望单管理</span>
        </span>
      </a>

      <nav class="flex items-center gap-2 text-sm text-slate-300">
        <a
          href="/"
          class="rounded-full border border-white/10 px-4 py-2 transition hover:border-sky-400/40 hover:bg-white/5 hover:text-white"
        >
          公开歌单
        </a>

        {#if data.viewer.isAdmin}
          <a
            href="/admin"
            class="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sky-100 transition hover:bg-sky-400/20"
          >
            后台管理
          </a>
        {:else}
          <a
            href="/admin/login"
            class="rounded-full border border-white/10 px-4 py-2 transition hover:border-fuchsia-400/40 hover:bg-white/5 hover:text-white"
          >
            管理员登录
          </a>
        {/if}
      </nav>
    </div>
  </header>

  <main class="mx-auto max-w-7xl px-4 pb-16 pt-8 lg:px-6 lg:pt-10">
    {@render children()}
  </main>
</div>
