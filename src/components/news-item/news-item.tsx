import React from 'react';
import './news-item.scss';

interface NewsItemProps {
    title: string;
    url: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ title, url }) => {
    return (
        <div className="news-item">
            <a href={url} target="_blank" rel="noopener noreferrer">
                {title}
            </a>
        </div>
    );
};

export default NewsItem;
