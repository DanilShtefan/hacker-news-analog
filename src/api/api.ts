export const API_URL = 'https://hacker-news.firebaseio.com/v0';

export type CustomRequest<T> = {
    onSuccess?: (result: T) => void;
    onError?: (err: string) => void;
    onFinally?: () => void;
};
