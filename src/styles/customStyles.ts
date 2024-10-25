const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#1F2937',
    borderColor: state.isFocused ? '#8B5CF6' : '#374151',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 1px #8B5CF6' : 'none',
    '&:hover': {
      borderColor: '#8B5CF6',
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#4C1D95' : '#374151',
    color: 'white',
    padding: 10,
    cursor: 'pointer',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1F2937',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
};

export default customStyles;
