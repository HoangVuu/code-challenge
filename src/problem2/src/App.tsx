import React from 'react';
import { useTokenPrices } from './hooks/useTokenPrices';
import { SwapForm } from './components/SwapForm';

/** Root application component */
const App: React.FC = () => {
  const { tokens, status, error } = useTokenPrices();

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="app">
        <div className="app__loading">
          <div className="app__spinner" />
          <p>Loading token prices...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="app">
        <div className="app__error">
          <p>Failed to load token data</p>
          <p className="app__error-detail">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <SwapForm tokens={tokens} />
    </div>
  );
};

export default App;
