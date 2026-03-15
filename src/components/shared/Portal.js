'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Portal({ children, element = 'div' }) {
  const mount = document.createElement(element);

  useEffect(() => {
    document.body.appendChild(mount);
    return () => {
      document.body.removeChild(mount);
    };
  }, [mount]);

  return createPortal(children, mount);
}
