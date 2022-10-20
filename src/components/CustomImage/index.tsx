import classNames from 'classnames';
import { url } from 'inspector';
import Image, { ImageProps as NextImageProps } from 'next/image';
import React from 'react';

type ImageProps = Partial<NextImageProps> & {
  src?: string;
  name: string;

  className?: string;
};

const CustomImage: React.FC<ImageProps> = ({
  name,
  src,
  width,
  height,
  className,
  ...rest
}) => {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <Image
      src={encodeURI(src)}
      alt={name}
      width={width}
      height={height}
      className={classNames(
        'items-center justify-center select-none cursor-pointer text-center flex',
        className
      )}
      {...rest}
    />
  ) : (
    <div
      className={classNames(
        'items-center justify-center select-none cursor-pointer text-center flex',
        className
      )}
      {...rest}
    >
      {getInitials(name)}
    </div>
  );
};

export default CustomImage;

const getInitials = (name: string) => {
  const [first, last] = name.split(' ');
  return first && last
    ? `${first.charAt(0)}${last.charAt(0)}`
    : first?.charAt(0);
};

