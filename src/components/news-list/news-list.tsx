import React, { useEffect, useState } from 'react';
import NewsItem from '../news-item';
import './news-list.scss';
import { FilterType, News, NewsFilterType, fetchNews } from '../../api/news';

const NewsList: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<NewsFilterType>(FilterType.topstories);

    useEffect(() => {
        setLoading(true);
        fetchNews({
            page,
            filterType,
            onSuccess: setNews,
            onError: setError,
            onFinally: () => setLoading(false),
        });
    }, [page, filterType]);

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleTypeChange = (type: NewsFilterType) => {
        setFilterType(type);
        setPage(1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="news-list">
            <div className="sort-buttons">
                <button
                    onClick={() => handleTypeChange(FilterType.topstories)}
                    className={filterType === FilterType.topstories ? 'active' : ''}
                >
                    Top Stories
                </button>
                <button
                    onClick={() => handleTypeChange(FilterType.newstories)}
                    className={filterType === FilterType.newstories ? 'active' : ''}
                >
                    New Stories
                </button>
                <button
                    onClick={() => handleTypeChange(FilterType.beststories)}
                    className={filterType === FilterType.beststories ? 'active' : ''}
                >
                    Best Stories
                </button>
            </div>
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
