import React from 'react';
import ResponsiveLayout from './ResponsiveLayout';

// Seamless wrapper so all pages instantly adapt to Desktop, Tablet, and Mobile!
export default function MobileFrame({ children, hideStatusBar, pageTitle, showBack, onBack, headerRight, hideBottomNav }) {
  return (
    <ResponsiveLayout
      pageTitle={pageTitle}
      showBack={showBack}
      onBack={onBack}
      headerRight={headerRight}
      hideBottomNav={hideBottomNav}
      yellowHeader={!hideStatusBar}
    >
      {children}
    </ResponsiveLayout>
  );
}
