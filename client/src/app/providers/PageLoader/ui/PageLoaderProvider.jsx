import React, { useMemo, useState } from 'react';
import { PageLoader } from '@shared/ui/pageLoader';
import { PageLoaderContext } from '../model/PageLoaderContext';
import '../styles/pageLoader.css';

const PageLoaderProvider = ({ children }) => {
  const [pageLoading, setPageLoading] = useState(false);

  const value = useMemo(() => ({ pageLoading, setPageLoading }), [pageLoading]);

  return (
    <PageLoaderContext.Provider value={value}>
      <div className="page-loader-wrapper">
        {pageLoading && <PageLoader />}
        {!pageLoading && children}
      </div>
    </PageLoaderContext.Provider>
  );
};

export default PageLoaderProvider;
