import classNames from 'classnames';
import React from 'react';

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IModal> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={classNames(
        isOpen ? 'block ' : 'hidden',
        'fixed inset-0 z-40 flex items-center justify-center w-full h-full m-auto '
      )}
    >
      <div
        className='absolute inset-0 bg-opacity-20 backdrop-blur-sm bg-rad-black-900 w-full h-full animate-modelBackdrop   '
        onClick={onClose}
      />
      <section className='w-fit animate-enter bg-rad-black-900 rounded-lg z-50 min-w-[12rem] min-h-[6rem] h-fit ring-1 ring-rad-black-700/30'>
        {children}
      </section>
    </div>
  );
};

export default Modal;
