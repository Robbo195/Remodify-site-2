import React from 'react';
import { Container } from 'react-bootstrap';

// Reusable page wrapper to apply consistent site-wide layout, colors and typography.
// Usage: <Page title="Title" subtitle="Optional subtitle">...content...</Page>
const Page = ({ title, subtitle, children }) => {
  return (
    <Container className="page-section">
      {title && <h1 className="title-underline-1" style={{ marginTop: '2rem' }}>{title}</h1>}
      {subtitle && <p className="lead text-muted" style={{ marginBottom: '1rem' }}>{subtitle}</p>}
      <div>
        {children}
      </div>
    </Container>
  );
};

export default Page;
