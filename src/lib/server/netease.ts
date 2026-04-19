type NeteaseApi = {
  playlist_detail?: (params: { id: string }) => Promise<NeteasePlaylistResponse>;
  default?: {
    playlist_detail?: (params: { id: string }) => Promise<NeteasePlaylistResponse>;
  };
};

type NeteaseArtist = {
  name?: unknown;
};

type NeteaseTrack = {
  name?: unknown;
  ar?: NeteaseArtist[];
  artists?: NeteaseArtist[];
};

type NeteasePlaylistResponse = {
  body?: {
    code?: number;
    playlist?: {
      tracks?: NeteaseTrack[];
    };
  };
};

export type NeteasePlaylistSong = {
  title: string;
  artist: string;
};

const extractPlaylistId = (value: string) => {
  const trimmed = value.trim();

  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  const idFromQuery = trimmed.match(/[?&]id=(\d+)/)?.[1];

  if (idFromQuery) {
    return idFromQuery;
  }

  const idFromPath = trimmed.match(/playlist\/(\d+)/)?.[1];

  if (idFromPath) {
    return idFromPath;
  }

  throw new Error('请填写有效的网易云公开歌单链接或 ID。');
};

const getArtistName = (artist: NeteaseArtist) => (typeof artist.name === 'string' ? artist.name.trim() : '');

const mapTrack = (track: NeteaseTrack): NeteasePlaylistSong | null => {
  const title = typeof track.name === 'string' ? track.name.trim() : '';
  const artists = (track.ar ?? track.artists ?? []).map(getArtistName).filter(Boolean);

  if (!title || artists.length === 0) {
    return null;
  }

  return {
    title,
    artist: artists.join(' / ')
  };
};

export const fetchNeteasePlaylistSongs = async (playlistInput: string) => {
  const playlistId = extractPlaylistId(playlistInput);
  const api = (await import('@neteasecloudmusicapienhanced/api')) as NeteaseApi;
  const playlistDetail = api.playlist_detail ?? api.default?.playlist_detail;

  if (!playlistDetail) {
    throw new Error('网易云歌单解析器不可用。');
  }

  const response = await playlistDetail({ id: playlistId });
  const tracks = response.body?.playlist?.tracks;

  if (response.body?.code !== 200 || !Array.isArray(tracks)) {
    throw new Error('读取网易云公开歌单失败。');
  }

  const songs = tracks.map(mapTrack).filter((song): song is NeteasePlaylistSong => song !== null);

  if (songs.length === 0) {
    throw new Error('这个歌单没有可导入的歌曲。');
  }

  return songs;
};
