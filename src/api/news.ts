export interface News {
    id: number;
    title: string;
    url: string;
}

type GetNewsProps = {
    page: number;
    onSuccess?: (news: News[]) => void;
    onError?: (err: string) => void;
    onFinally?: () => void;
};

export const fetchNews = async ({ page, onSuccess, onError, onFinally }: GetNewsProps) => {
    const pageSize = 30;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    const storyUrl = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

    try {
        const response = await fetch(topStoriesUrl);
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
