import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  ChatReply,
  InterviewItem,
  MusicWork,
  Photo,
  PhotoAlbum,
  SiteDisplayConfig,
  StageEvent,
  TimelineCategory,
  TimelineEvent,
  VarietyShow,
  Work,
  WorkType,
} from '@shared/types';
import { apiGet, apiGetList, apiPost } from '../api/client';

/**
 * 内容查询 Hooks（T6/T7 前端 API 化）
 * 每个页面通过这里拉取后端数据，不再直接 import src/data/* 静态内容。
 * queryKey 带筛选参数，React Query 自动缓存 + 失效。
 */

export function useWorks(type?: WorkType) {
  return useQuery({
    queryKey: ['works', type ?? 'all'],
    queryFn: () => apiGetList<Work>('/works', type ? { type } : undefined),
  });
}

export function useTimeline(category?: TimelineCategory) {
  return useQuery({
    queryKey: ['timeline', category ?? 'all'],
    queryFn: () => apiGetList<TimelineEvent>('/timeline', category ? { category } : undefined),
  });
}

export function usePhotos(album?: PhotoAlbum) {
  return useQuery({
    queryKey: ['photos', album ?? 'all'],
    queryFn: () => apiGetList<Photo>('/photos', album ? { album } : undefined),
  });
}

export function useMusic() {
  return useQuery({
    queryKey: ['music'],
    queryFn: () => apiGetList<MusicWork>('/music'),
  });
}

export function useVariety() {
  return useQuery({
    queryKey: ['variety'],
    queryFn: () => apiGetList<VarietyShow>('/variety'),
  });
}

export function useStage() {
  return useQuery({
    queryKey: ['stage'],
    queryFn: () => apiGetList<StageEvent>('/stage'),
  });
}

export function useInterviews() {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: () => apiGetList<InterviewItem>('/interviews'),
  });
}

export function useSiteConfig() {
  return useQuery({
    queryKey: ['site-config'],
    queryFn: () => apiGet<SiteDisplayConfig>('/site-config'),
  });
}

/** 问答（POST /api/chat）；mutateAsync(question) → ChatReply */
export function useChatAnswer() {
  return useMutation({
    mutationFn: (question: string) => apiPost<ChatReply>('/chat', { question }),
  });
}
