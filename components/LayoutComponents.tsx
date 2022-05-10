import {NextURL} from 'next/dist/server/web/next-url';
import NextLink from 'next/link';
import React from 'react';
import {UrlObject} from 'url';

export type LayoutProps = {children?: React.ReactNode};

export function Layout({children}: LayoutProps): JSX.Element {
  return <div className="min-h-full">{children}</div>;
}

export type ContentProps = {children?: React.ReactNode};

export function Content({children}: ContentProps): JSX.Element {
  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}

export type TitleProps = {children?: React.ReactNode};

export function Title({children}: TitleProps): JSX.Element {
  return (
    <h1 className="font mb-10 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
      {children}
    </h1>
  );
}

export type TextProps = {children?: React.ReactNode};

export function Text({children}: TextProps): JSX.Element {
  return <p className="mt-4 text-xl text-gray-500">{children}</p>;
}

export type ButtonProps = {
  size: 'small' | 'standard';
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export function Button({size, children, onClick, disabled}: ButtonProps) {
  const sizeClasses = size === 'small' ? 'px-2' : 'py-3 px-8 font-medium';
  return (
    <button
      className={`inline-block rounded-md border border-transparent bg-indigo-600 text-center text-white hover:bg-indigo-700 ${sizeClasses}`}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
}

export type LinkProps = {children?: React.ReactNode; href: string | UrlObject};

export function Link({children, href}: LinkProps) {
  return (
    <NextLink href={href}>
      <a className="cursor-pointer text-base font-semibold text-blue-600 underline visited:text-purple-600 hover:text-blue-800">
        {children}
      </a>
    </NextLink>
  );
}
