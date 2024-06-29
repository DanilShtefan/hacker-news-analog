import React, { useState, useEffect } from 'react';
import './news-item.scss';
import CommentsList from '../comments-list';
import { fetchCommentIds } from '../../api/comments';
import { News } from '../../api/news';

const NewsItem: React.FC<News> = ({ id, title, url, by, score }) => {
    const [commentIds, setCommentIds] = useState<number[]>([]);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchCommentIds({
            id,
            onSuccess: setCommentIds,
            onError: setError,
            onFinally: () => setLoading(false),
        });
    }, [id]);

    const toggleComments = () => {
        setShowComments((prevShowComments) => !prevShowComments);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="news-item">
            <div className="news-item-header">
                <div>
                    <strong>
                        {by} [&#9733; {score || 0}]:{' '}
                    </strong>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {title}
                    </a>
                </div>
                {commentIds.length > 0 && (
                    <button className="toggle-comments" onClick={toggleComments}>
                        {showComments ? 'Hide Comments' : 'Show Comments'}
                    </button>
                )}
            </div>

            {showComments && commentIds.length > 0 && <CommentsList commentIds={commentIds} />}
        </div>
    );
};

export default NewsItem;
