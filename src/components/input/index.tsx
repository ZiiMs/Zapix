import React from 'react';

const Input: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { onSubmit: () => void }
> = ({ onSubmit, ...props }) => {
  return (
    <input
      {...props}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSubmit();
        }
      }}
    />
  );
};

export default Input;

