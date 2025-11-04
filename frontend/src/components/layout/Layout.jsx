import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="app">
      <Header />
      <main className="main">
        {children}
      </main>
    </div>
  );
};

export default Layout;