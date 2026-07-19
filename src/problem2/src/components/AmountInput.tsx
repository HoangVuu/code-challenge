import React, { memo } from 'react';

interface AmountInputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  label: string;
}

/** Input component for entering token amounts */
export const AmountInput: React.FC<AmountInputProps> = memo(
  ({ value, onChange, placeholder = '0.00', readOnly = false, error, label }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Allow only numbers and one decimal point
      if (val === '' || /^\d*\.?\d*$/.test(val)) {
        onChange?.(val);
      }
    };

    return (
      <div className="amount-input">
        <label className="amount-input__label">{label}</label>
        <input
          type="text"
          inputMode="decimal"
          className={`amount-input__field ${error ? 'amount-input__field--error' : ''} ${
            readOnly ? 'amount-input__field--readonly' : ''
          }`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
        />
        {error && <span className="amount-input__error">{error}</span>}
      </div>
    );
  }
);

AmountInput.displayName = 'AmountInput';
