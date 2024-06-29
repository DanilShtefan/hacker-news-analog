import React, { useEffect, useState } from 'react';
import NewsItem from '../news-item';
import './news-list.scss';
import { News, fetchNews } from '../../api/news';

const NewsList: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNews({
            page,
            onSuccess: setNews,
            onError: setError,
            onFinally: () => setLoading(false),
        });
    }, [page]);

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="news-list">
            {news.map((item) => (
                <NewsItem key={item.id} title={item.title} url={item.url} />
            ))}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>
                    Previous Page
                </button>
                <button onClick={handleNextPage}>Next Page</button>
            </div>
        </div>
    );
};

export default NewsList;
