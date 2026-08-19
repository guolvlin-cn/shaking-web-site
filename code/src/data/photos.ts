// 相册数据（对应 requirements F-017~F-020）

export interface Photo {
  id: string;
  url: string;
  album: '舞台照' | '写真' | '路透' | '饭拍';
  title: string;
  tags: string[];
  gradient: string;
}

export const PHOTOS: Photo[] = [
  { id: 'p-001', url: '', album: '舞台照', title: 'THE9 巡演舞台', tags: ['THE9'], gradient: 'linear-gradient(135deg, #2d0014 0%, #1a1a1a 100%)' },
  { id: 'p-002', url: '', album: '舞台照', title: '巅峰对决舞台', tags: ['说唱'], gradient: 'linear-gradient(135deg, #4d1b00 0%, #1a1a1a 100%)' },
  { id: 'p-003', url: '', album: '舞台照', title: '跨年晚会', tags: ['晚会'], gradient: 'linear-gradient(135deg, #1b002d 0%, #1a1a1a 100%)' },
  { id: 'p-004', url: '', album: '写真', title: '杂志大片', tags: ['杂志'], gradient: 'linear-gradient(135deg, #3d2d00 0%, #1a1a1a 100%)' },
  { id: 'p-005', url: '', album: '写真', title: '日常写真', tags: ['日常'], gradient: 'linear-gradient(135deg, #002b1b 0%, #1a1a1a 100%)' },
  { id: 'p-006', url: '', album: '写真', title: '时尚街拍', tags: ['街拍'], gradient: 'linear-gradient(135deg, #2b002b 0%, #1a1a1a 100%)' },
  { id: 'p-007', url: '', album: '路透', title: '机场路透', tags: ['机场'], gradient: 'linear-gradient(135deg, #001f3f 0%, #1a1a1a 100%)' },
  { id: 'p-008', url: '', album: '路透', title: '剧组探班', tags: ['剧组'], gradient: 'linear-gradient(135deg, #1b004d 0%, #1a1a1a 100%)' },
  { id: 'p-009', url: '', album: '饭拍', title: '粉丝拍摄', tags: ['饭拍'], gradient: 'linear-gradient(135deg, #4d0014 0%, #1a1a1a 100%)' },
  { id: 'p-010', url: '', album: '饭拍', title: '高清舞台饭拍', tags: ['饭拍'], gradient: 'linear-gradient(135deg, #002d2d 0%, #1a1a1a 100%)' },
  { id: 'p-011', url: '', album: '舞台照', title: '音乐节现场', tags: ['音乐节'], gradient: 'linear-gradient(135deg, #3d001d 0%, #1a1a1a 100%)' },
  { id: 'p-012', url: '', album: '写真', title: '黑白写真', tags: ['写真'], gradient: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)' },
];

export const ALBUM_FILTERS = ['全部', '舞台照', '写真', '路透', '饭拍'] as const;
export type AlbumFilter = (typeof ALBUM_FILTERS)[number];
