import { useState } from 'react';
import './button.css';

const Button = () => {
    const [count, setCount] = useState<number>(0);


    return (
        <div >
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
        </div>
    )
}

export default Button;
