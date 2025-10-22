import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfettiContainer from './ConfettiWrapper';

const mockRequestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
mockRequestAnimationFrame.mockImplementation(() => {
    return 1 as unknown as number;
});

const mockContext = {
    clearRect: jest.fn(),
    save: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    fillStyle: '',
    globalAlpha: 1,
    fillRect: jest.fn(),
    restore: jest.fn(),
};

const mockCanvas = {
    width: 0,
    height: 0,
    getContext: jest.fn(() => mockContext),
    getBoundingClientRect: jest.fn(() => ({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        top: 100,
        left: 100,
        bottom: 150,
        right: 150,
    })),
} as unknown as HTMLCanvasElement; // Type assertion

const mockGetElementById = jest.spyOn(document, 'getElementById');
mockGetElementById.mockReturnValue(mockCanvas);

const originalInnerWidth = window.innerWidth;
const originalInnerHeight = window.innerHeight;
window.innerWidth = 800;
window.innerHeight = 600;


describe('ConfettiContainer', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        // Restore original window dimensions and mocks
        window.innerWidth = originalInnerWidth;
        window.innerHeight = originalInnerHeight;
        jest.restoreAllMocks();
    });

    const TestChild = () => <button data-testid="test-button">Click Me</button>;

    // Test 1: Renders the necessary elements
    test('should render children and the canvas element', () => {
        render(<ConfettiContainer><TestChild /></ConfettiContainer>);

        // Check for the canvas
        expect(screen.getByTestId('confetti-canvas')).toBeInTheDocument();
        // Check for the button/child
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    test('should add 40 confetti particles to state upon clicking a child element', () => {

        // 1. Set up a mock function for setConfettis BEFORE render
        const mockSetConfettis = jest.fn();

        // 2. Spy on useState and ensure it uses our mockSetConfettis
        const useStateSpy = jest.spyOn(React, 'useState');
        useStateSpy.mockImplementationOnce(() => [
            [], // initial state: empty array
            mockSetConfettis // Inject our mock setter
        ]);

        // 3. RENDER the component AFTER the mock is set
        render(<ConfettiContainer><TestChild /></ConfettiContainer>);

        // 4. Get the clickable wrapper div
        const wrapperDiv = screen.getByText('Click Me').parentElement;

        // 5. Perform the click event
        act(() => {
            fireEvent.click(wrapperDiv!);
        });

        // 6. Check if setConfettis was called with the new array
        expect(mockSetConfettis).toHaveBeenCalledTimes(1);

        // Check if the new state array has exactly 40 elements
        const newConfettisArray = mockSetConfettis.mock.calls[0][0];
        expect(newConfettisArray).toHaveLength(40);

        // Check the structure of one particle
        expect(newConfettisArray[0]).toEqual(expect.objectContaining({
            width: 4,
            height: 10,
            alpha: 1
        }));

        // Clean up the spy after the test (optional but good practice)
        useStateSpy.mockRestore();
    });

    test('should set canvas dimensions and start the animation loop on mount', () => {
        render(<ConfettiContainer><TestChild /></ConfettiContainer>);

        // Check canvas dimensions are set to window size
        expect(mockCanvas.width).toBe(800);
        expect(mockCanvas.height).toBe(600);

        // Check that getContext was called
        expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');

        // Check that the animation loop starts
        expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    test('should re-run useEffect and restart rAF when confettis state changes', () => {
        render(<ConfettiContainer><TestChild /></ConfettiContainer>);
        expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);

        const wrapperDiv = screen.getByText('Click Me').parentElement;

        act(() => {
            fireEvent.click(wrapperDiv!);
        });

        expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2);
    });
});