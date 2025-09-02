// Force re-transpilation
import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'date';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  help?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
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
  error,
  help,
  required = false,
  disabled = false,
  options = [],
  rows = 3,
  className = ''
}) => {
  const inputId = `field-${name}`;
  const errorId = `error-${name}`;
  const helpId = `help-${name}`;

  const renderInput = () => {
    const commonProps = {
      id: inputId,
      name,
      value,
      onChange,
      placeholder,
      disabled,
      required,
      className: `input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`,
      'aria-describedby': error ? errorId : help ? helpId : undefined,
      'aria-invalid': error ? 'true' as const : 'false' as const
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Выберите...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return <input {...commonProps} type={type} />;
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <div id={errorId} className="form-error">
          {error}
        </div>
      )}
      
      {help && !error && (
        <div id={helpId} className="form-help">
          {help}
        </div>
      )}
    </div>
  );
};

export default FormField;
