'use client';

import Select from 'react-select';

const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '48px',
    borderRadius: '12px',
    borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    },
    backgroundColor: 'var(--select-bg, white)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? '#3b82f6' 
      : state.isFocused 
        ? '#eff6ff' 
        : 'var(--select-bg, white)',
    color: state.isSelected ? 'white' : 'var(--select-text, #374151)',
    cursor: 'pointer',
    padding: '12px 16px',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    backgroundColor: 'var(--select-bg, white)',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--select-text, #374151)',
  }),
};

export function FormSelect({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...',
  isClearable = false 
}) {
  const selectedOption = options.find(opt => opt.value === value);

  const handleChange = (selected) => {
    onChange(selected ? selected.value : '');
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable={isClearable}
        styles={customStyles}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        className="dark"
        classNamePrefix="select"
      />
    </div>
  );
}
