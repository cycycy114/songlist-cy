<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form?: ActionData } = $props();
</script>

<svelte:head>
  <title>管理员登录 | VTuber Songboard</title>
</svelte:head>

<div class="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
  <section class="rounded-[32px] border border-white/10 bg-white/5 p-7 lg:p-10">
    <p class="text-sm font-medium text-sky-200">后台入口</p>
    <h1 class="mt-3 text-3xl font-semibold text-white lg:text-5xl">主播后台管理</h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 lg:text-base">
      在这里维护公开歌单、处理观众愿望单，并统一管理歌曲状态。当前实现兼容 Supabase 模式与本地演示模式，方便你先开发再接入真实后端。
    </p>

    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      <div class="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">鉴权模式</p>
        <p class="mt-3 text-xl font-semibold text-white">
          {data.authMode === 'supabase' ? 'Supabase Auth' : '演示登录'}
        </p>
        <p class="mt-2 text-sm text-slate-400">
          {data.authMode === 'supabase'
            ? '已检测到 Supabase 配置，登录将走真实管理员账号。'
            : '当前未配置 Supabase，使用本地演示账号体验后台。'}
        </p>
      </div>

      <div class="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">当前目标</p>
        <p class="mt-3 text-xl font-semibold text-white">单主播 MVP</p>
        <p class="mt-2 text-sm text-slate-400">
          保持轻量全栈结构，先完成桌面优先的管理效率，再兼顾移动端可用性。
        </p>
      </div>
    </div>
  </section>

  <section class="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 lg:p-7">
    <div>
      <p class="text-sm font-medium text-sky-200">登录后台</p>
      <h2 class="mt-1 text-2xl font-semibold text-white">管理员身份验证</h2>
    </div>

    {#if data.demoCredentials}
      <div class="mt-5 rounded-3xl border border-fuchsia-400/25 bg-fuchsia-400/10 p-4 text-sm text-fuchsia-100">
        <p class="font-medium">当前为演示模式</p>
        <p class="mt-2">邮箱：{data.demoCredentials.email}</p>
        <p class="mt-1">密码：{data.demoCredentials.password}</p>
      </div>
    {/if}

    {#if form?.message}
      <div class="mt-5 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
        {form.message}
      </div>
    {/if}

    <form method="POST" class="mt-6 space-y-4">
      <label class="block space-y-2 text-sm text-slate-300">
        <span>邮箱</span>
        <input
          name="email"
          type="email"
          value={form?.values?.email ?? ''}
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:bg-white/8"
          placeholder="admin@example.com"
        />
      </label>

      <label class="block space-y-2 text-sm text-slate-300">
        <span>密码</span>
        <input
          name="password"
          type="password"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:bg-white/8"
          placeholder="请输入管理员密码"
        />
      </label>

      <button
        type="submit"
        class="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-sky-400 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
      >
        登录后台
      </button>
    </form>
  </section>
</div>
