import { useCallback, useEffect, useState } from "react";
import './ConfettiWrapper.css';

interface ConfettiContainerProps {
    children: React.ReactNode
}

interface Confetti {
    x: number;
    y: number;
    dx: number;
    dy: number;
    width: number;
    height: number;
    angle: number;
    rotationSpeed: number;
    color: string;
    alpha: number;
}

const ConfettiContainer = ({ children }: ConfettiContainerProps) => {
    const [confettis, setConfettis] = useState<Array<Confetti>>([]);


    useEffect(() => {
        const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');

        function animate() {
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                confettis.forEach((c, i) => {
                    c.x += c.dx;
                    c.y += c.dy;
                    c.dy += 0.2; // gravity
                    c.angle += c.rotationSpeed;
                    c.alpha -= 0.01;

                    ctx.save();
                    ctx.translate(c.x, c.y);
                    ctx.rotate((c.angle * Math.PI) / 180);
                    ctx.fillStyle = c.color;
                    ctx.globalAlpha = c.alpha;
                    ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
                    ctx.restore();

                    if (c.alpha <= 0) confettis.splice(i, 1);
                });
            }
            requestAnimationFrame(animate);
        }
        animate();
    }, [confettis])

    const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const targetElement = e.target as HTMLElement;
        const { x, y, width, height } = targetElement.getBoundingClientRect();
        const newConfettis = [...confettis];
        for (let i = 0; i < 40; i++) {
            newConfettis.push({
                x: x + width / 2,
                y: y + height / 2,
                dx: (Math.random() - 0.5) * 6,
                dy: Math.random() * -4 - 2,
                width: 4,
                height: 10,
                angle: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                alpha: 1
            });

        }
        setConfettis(newConfettis);
    }, [confettis])


    return (
        <>
            <div onClick={onClick}>{children}</div>
            <canvas id="confetti-canvas"></canvas>
        </>
    )
}

export default ConfettiContainer;
