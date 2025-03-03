import { createElement, Fragment } from 'react';

export const jsx = (type: any, props: any, ...children: any[]) => {
  return createElement(type, props, ...children);
};

export const jsxs = (type: any, props: any, children: any[]) => {
  return createElement(type, props, ...children);
};

export const jsxDEV = (type: any, props: any, key: any, isStaticChildren: boolean, source: any, self: any) => {
  return createElement(type, { ...props, key }, ...props.children);
};

export { Fragment };