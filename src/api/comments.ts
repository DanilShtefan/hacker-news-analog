import { API_URL, CustomRequest } from './api';

const MAX_COMMENTS = 10;

export interface Comment {
    id: number;
    text: string;
    by: string;
    score: number;
    kids?: number[];
}

interface GetCommentsProps extends CustomRequest<Comment[]> {
    commentIds: number[];
}

export const fetchComments = async ({ commentIds, onSuccess, onError, onFinally }: GetCommentsProps) => {
    try {
        const commentsData = await Promise.all(
            commentIds.slice(0, 10).map(async (id: number) => {
                const response = await fetch(`${API_URL}/item/${id}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch comment with id ${id}`);
                }
                const commentData: Comment = await response.json();
                return commentData;
            }),
        );
        onSuccess && onSuccess(commentsData);
    } catch (error) {
        onError && onError((error as Error).message);
    } finally {
        onFinally && onFinally();
    }
};

interface GetCommentsIdsProps extends CustomRequest<number[]> {
    id: number;
}

export const fetchCommentIds = async ({ id, onSuccess, onError, onFinally }: GetCommentsIdsProps) => {
    const storyUrl = `${API_URL}/item/${id}.json`;

    try {
        const response = await fetch(storyUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch story with id ${id}`);
        }
        const storyData: { kids?: number[] } = await response.json();
        if (storyData.kids) {
            onSuccess && onSuccess(storyData.kids.slice(0, MAX_COMMENTS));
        } else {
            onSuccess && onSuccess([]);
        }
    } catch (error) {
        onError && onError((error as Error).message);
    } finally {
        onFinally && onFinally();
    }
};
