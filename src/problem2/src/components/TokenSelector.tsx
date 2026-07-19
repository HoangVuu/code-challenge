import React, { useState, useRef, useEffect, memo } from 'react';
import type { Token } from '../types';
import { TokenIcon } from './TokenIcon';

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  label: string;
  error?: string;
}

/** Dropdown component for selecting a token */
export const TokenSelector: React.FC<TokenSelectorProps> = memo(
  ({ tokens, selectedToken, onSelect, label, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearch('');
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen]);

    const filteredTokens = tokens.filter((token) =>
      token.currency.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (token: Token) => {
      onSelect(token);
      setIsOpen(false);
      setSearch('');
    };

    return (
      <div className="token-selector" ref={dropdownRef}>
        <label className="token-selector__label">{label}</label>
        <button
          type="button"
          className={`token-selector__trigger ${error ? 'token-selector__trigger--error' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedToken ? (
            <span className="token-selector__selected">
              <TokenIcon src={selectedToken.image} alt={selectedToken.currency} size={20} />
              <span>{selectedToken.currency}</span>
            </span>
          ) : (
            <span className="token-selector__placeholder">Select token</span>
          )}
          <span className={`token-selector__arrow ${isOpen ? 'token-selector__arrow--open' : ''}`}>
            ▾
          </span>
        </button>
        {error && <span className="token-selector__error">{error}</span>}

        {isOpen && (
          <div className="token-selector__dropdown">
            <div className="token-selector__search-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                className="token-selector__search"
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ul className="token-selector__list">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <li
                    key={token.currency}
                    className={`token-selector__item ${
                      selectedToken?.currency === token.currency
                        ? 'token-selector__item--active'
                        : ''
                    }`}
                    onClick={() => handleSelect(token)}
                  >
                    <TokenIcon src={token.image} alt={token.currency} size={20} />
                    <span className="token-selector__item-name">{token.currency}</span>
                    <span className="token-selector__item-price">
                      ${token.price.toFixed(2)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="token-selector__empty">No tokens found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

TokenSelector.displayName = 'TokenSelector';
