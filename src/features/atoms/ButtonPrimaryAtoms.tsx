import { Spinner } from '@chakra-ui/react';
import React from 'react';

interface IProp extends React.PropsWithChildren {
  colorLevel?: number;
  handleOnClick?: () => void;
  loading?: boolean;
  className?: string;
}
function ButtonPrimaryAtoms({ colorLevel = 900, handleOnClick, children, loading = false, className }: IProp) {
  return (
    <button
      className={`px-4 py-2 bg-[var(--primary-color-${colorLevel})] text-white rounded-md relative flex justify-center items-center ${loading ? 'opacity-70':'opacity-100'} ${className} `}
      onClick={handleOnClick}
      disabled={loading}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2">
         <Spinner size={'sm'}/>
        </div>
      )}
      <span className={`transition-none ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
    </button>
  );
}

export default ButtonPrimaryAtoms;
