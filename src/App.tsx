import React from 'react';
import Header from './components/header';
import NewsList from './components/news-list';
import './app.scss';

const App: React.FC = () => {
    return (
        <div className="app">
            <Header />
            <NewsList />
        </div>
    );
};

export default App;
