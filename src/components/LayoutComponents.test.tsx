import { render, screen } from '@testing-library/react';
import { Button } from './LayoutComponents';

describe('Button', () => {
  it('should render a button', () => {
    render(<Button size="standard">hello</Button>);

    const button = screen.getByRole('button', { name: /hello/i });
    expect(button).toBeInTheDocument();
  });
});
