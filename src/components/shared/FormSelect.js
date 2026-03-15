'use client';

import Select from 'react-select';

const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '48px',
    borderRadius: '12px',
    borderColor: state.isFocused ? '#3b82f6' : '#6b7280',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    },
    backgroundColor: 'var(--select-bg)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
        ? '#eff6ff'
        : 'var(--select-bg)',
    color: state.isSelected ? 'white' : 'var(--select-text, #374151)',
    cursor: 'pointer',
    padding: '12px 16px',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    backgroundColor: 'var(--select-bg)',
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
  indicatorSeparator: () => ({
    display: 'none',
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
  // Sort options alphabetically by label
  const sortedOptions = [...options].sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const selectedOption = sortedOptions.find(opt => opt.value === value);

  const handleChange = (selected) => {
    onChange(selected ? selected.value : '');
  };

  // Custom filter function to match options based on the first letter
  const customFilterOption = (option, inputValue) => {
    if (!inputValue) return true;
    return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Select
        options={sortedOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable={isClearable}
        styles={customStyles}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        className="light"
        classNamePrefix="select"
        filterOption={customFilterOption}
      />
    </div>
  );
}