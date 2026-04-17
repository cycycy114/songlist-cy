import type { Song, SongRequest } from '$lib/types';

export const sampleSongs: Song[] = [
  {
    id: 'song-1',
    title: '群青',
    artist: 'YOASOBI',
    language: '日语',
    status: 'ready',
    tags: ['高能', '日语', '动画'],
    isPublic: true
  },
  {
    id: 'song-2',
    title: '夜に駆ける',
    artist: 'YOASOBI',
    language: '日语',
    status: 'ready',
    tags: ['经典', '日语', '快歌'],
    isPublic: true
  },
  {
    id: 'song-3',
    title: '祝福',
    artist: 'YOASOBI',
    language: '日语',
    status: 'learning',
    tags: ['机战', '热血', '新曲'],
    isPublic: true
  },
  {
    id: 'song-4',
    title: 'アイドル',
    artist: 'YOASOBI',
    language: '日语',
    status: 'ready',
    tags: ['高热度', '偶像', '舞台感'],
    isPublic: true
  },
  {
    id: 'song-5',
    title: '青鸟',
    artist: '生物股长',
    language: '中文',
    status: 'ready',
    tags: ['经典', '动漫', '合唱感'],
    isPublic: true
  },
  {
    id: 'song-6',
    title: '打上花火',
    artist: 'DAOKO × 米津玄师',
    language: '日语',
    status: 'resting',
    tags: ['抒情', '夏日', '双人感'],
    isPublic: true
  },
  {
    id: 'song-7',
    title: '恋爱告急',
    artist: '鞠婧祎',
    language: '中文',
    status: 'ready',
    tags: ['甜歌', '舞台', '轻快'],
    isPublic: true
  },
  {
    id: 'song-8',
    title: 'First Love',
    artist: '宇多田光',
    language: '日语',
    status: 'learning',
    tags: ['抒情', '经典', '情绪'],
    isPublic: true
  }
];

export const sampleRequests: SongRequest[] = [
  {
    id: 'request-1',
    songTitle: '怪物',
    artist: 'YOASOBI',
    message: '直播里应该会很燃，想听你唱一次。',
    requesterName: '夜猫子',
    status: 'pending',
    matchedSongId: null,
    createdAt: '2026-04-17T20:00:00.000Z'
  },
  {
    id: 'request-2',
    songTitle: '残酷な天使のテーゼ',
    artist: '高桥洋子',
    message: '很适合纪念回，观众应该会一起跟唱。',
    requesterName: 'Misaki',
    status: 'reviewing',
    matchedSongId: null,
    createdAt: '2026-04-16T12:30:00.000Z'
  },
  {
    id: 'request-3',
    songTitle: '群青',
    artist: 'YOASOBI',
    message: '希望以后也常唱这首。',
    requesterName: null,
    status: 'planned',
    matchedSongId: 'song-1',
    createdAt: '2026-04-15T09:10:00.000Z'
  }
];
