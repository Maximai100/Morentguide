// Force re-transpilation
import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = [],
  rows = 3,
  className = ''
}) => {
  const fieldId = `field-${name}`;
  const hasError = !!error;

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`form-input ${hasError ? 'form-input-error' : ''}`}
          />
        );

      case 'select':
        return (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={`form-select ${hasError ? 'form-select-error' : ''}`}
          >
            <option value="">Выберите...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`form-input ${hasError ? 'form-input-error' : ''}`}
          />
        );
    }
  };

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      
      {renderField()}
      
      {hasError && (
        <p className="form-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
