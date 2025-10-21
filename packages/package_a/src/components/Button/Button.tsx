import { useState } from 'react';
import './button.css';
import ConfettiContainer from '../ConfettiWrapper/ConfettiWrapper';

const Button = () => {
    const [count, setCount] = useState<number>(0);


    return (
        <div >
            <ConfettiContainer>
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </ConfettiContainer>
        </div>
    )
}

export default Button;
