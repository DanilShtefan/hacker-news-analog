import { API_URL } from './api';

export interface News {
    id: number;
    title: string;
    url: string;
}

export enum FilterType {
    topstories = 'topstories',
    newstories = 'newstories',
    beststories = 'beststories',
}

export type NewsFilterType = FilterType.topstories | FilterType.newstories | FilterType.beststories;

type GetNewsProps = {
    page: number;
    filterType: NewsFilterType;
    onSuccess?: (news: News[]) => void;
    onError?: (err: string) => void;
    onFinally?: () => void;
};

export const fetchNews = async ({ page, filterType, onSuccess, onError, onFinally }: GetNewsProps) => {
    const pageSize = 30;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const storyTypeUrls: Record<NewsFilterType, string> = {
        topstories: `${API_URL}/topstories.json`,
        newstories: `${API_URL}/newstories.json`,
        beststories: `${API_URL}/beststories.json`,
    };

    const storyUrl = (id: number) => `${API_URL}/item/${id}.json`;

    try {
        const response = await fetch(storyTypeUrls[filterType]);
        if (!response.ok) {
            throw new Error('Failed to fetch top stories');
        }
        const storyIds: number[] = await response.json();
        const storiesToFetch = storyIds.slice(startIndex, endIndex);
        const stories: News[] = await Promise.all(
            storiesToFetch.map(async (id: number) => {
                const storyResponse = await fetch(storyUrl(id));
                if (!storyResponse.ok) {
                    throw new Error(`Failed to fetch story with id ${id}`);
                }
                return storyResponse.json();
            }),
        );
        onSuccess && onSuccess(stories);
    } catch (error) {
        onError && onError((error as Error).message);
    } finally {
        onFinally && onFinally();
    }
};
