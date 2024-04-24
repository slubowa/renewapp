import React from 'react';
import { render, screen } from '@testing-library/react';
import UserGreeting from './greeting';

test('renders welcome message with username', () => {
  render(<UserGreeting username="John" />);
  const linkElement = screen.getByText(/Welcome, John!/i);
  expect(linkElement).toBeInTheDocument();
});
