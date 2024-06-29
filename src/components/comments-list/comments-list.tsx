import React, { useEffect, useState } from 'react';
import './comments-list.scss';
import { fetchComments, Comment } from '../../api/comments';

interface CommentsListProps {
    commentIds: number[];
}

const CommentsList: React.FC<CommentsListProps> = ({ commentIds }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchComments({
            commentIds,
            onSuccess: setComments,
            onError: setError,
            onFinally: () => setLoading(false),
        });
    }, [commentIds]);

    if (loading) {
        return <div>Loading comments...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <ul className="comments-list">
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </ul>
    );
};

interface CommentItemProps {
    comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    const [showReplies, setShowReplies] = useState<boolean>(false);

    const toggleReplies = () => {
        setShowReplies((prevShowReplies) => !prevShowReplies);
    };

    return (
        <li className="comment-item">
            <div className="comment-header">
                <div className="comment-author">
                    <strong>
                        {comment.by} [&#9733; {comment.score || 0}]:{' '}
                    </strong>
                </div>
                <i dangerouslySetInnerHTML={{ __html: comment.text }}></i>
            </div>
            {comment.kids && (
                <button className="toggle-replies" onClick={toggleReplies}>
                    {showReplies ? 'Hide Replies' : 'Show Replies'}
                </button>
            )}
            {showReplies && comment.kids && <CommentsList commentIds={comment.kids} />}
        </li>
    );
};

export default CommentsList;
