import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>,
  Navigate: () => <div>Navigated</div>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

import App from './App';

test('renders CDAC login screen', () => {
  render(<App />);
  const titleElement = screen.getByText(/Centre for Development of Advanced Computing/i);
  expect(titleElement).toBeInTheDocument();
});
