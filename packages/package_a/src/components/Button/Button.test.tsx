import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {

    test('renders the initial count of 0', () => {
        render(<Button />);

        // Find the button by its role and check its text content.
        const buttonElement = screen.getByRole('button', { name: /count is 0/i });
        expect(buttonElement).toBeInTheDocument();
    });

    // Test 3: Checks the core functionality: state updates correctly on click.
    test('increments the count when the button is clicked', () => {
        render(<Button />);

        const buttonElement = screen.getByRole('button', { name: /count is 0/i });

        // Simulate the first click
        fireEvent.click(buttonElement);
        // After the click, the text should update to 'count is 1'.
        expect(buttonElement).toHaveTextContent('count is 1');

        // Simulate a second click
        fireEvent.click(buttonElement);
        // The text should now be 'count is 2'.
        expect(buttonElement).toHaveTextContent('count is 2');
    });

});