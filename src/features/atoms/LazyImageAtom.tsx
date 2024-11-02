import { useState } from 'react';
import {Image, ImageProps} from '@chakra-ui/react';

const LazyImageAtom = ({ src, alt,...props }:ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      loading="lazy"
      src={src}
      alt={alt}
      opacity={isLoaded ? 1 : 0}
      transition="opacity 0.5s ease-in-out"
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
};

export default LazyImageAtom;
