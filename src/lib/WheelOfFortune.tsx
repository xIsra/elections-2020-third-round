import React, { Component } from 'react'

const sections = ["שס", "ליכוד", "כחול לבן", "מרץ", "ישראל ביתנו", "העבודה-גשר-מרצ"];
const colors = ["#2077bc", "#fafafa"];


export default class WheelOfFortune extends Component {
    canvasRef = React.createRef<HTMLCanvasElement>();
    containerRef = React.createRef<HTMLDivElement>();
    wheels: HTMLCanvasElement[] = [];
    frame?: HTMLCanvasElement;

    angle = 0;
    running = false;

    innerWidth = 0;
    innerHeight = 0;

    csz?: string;



    componentDidMount() {
        const canvas = this.canvasRef.current;
        if (canvas == null) return;
        this.setContainerSize();
        this.drawWheel();
        this.drawFrame();
        this.repaint();

        window.addEventListener('resize', this.setContainerSize)
    }

    setContainerSize = () => {
        const container = this.containerRef.current;
        if (container == null) return;
        this.innerHeight = container.clientHeight;
        this.innerWidth = container.clientWidth;
        this.drawWheel();
        this.drawFrame();
        this.repaint();
    }

    drawWheel() {
        const sectionsLength = sections.length;
        // const innerHeight = window.innerHeight;
        const innerWidth = this.innerWidth;
        const innerHeight = this.innerHeight;
        const r = this.getScreenRadius();
        const newWheels = [];
        for (let selected = 0; selected < sectionsLength; selected++) {
            let c = document.createElement("canvas");
            c.width = c.height = 2 * r + 10;
            let ctx = c.getContext("2d"), cx = 5 + r, cy = 5 + r;
            if (ctx == null) continue;
            let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(1, "rgba(0,0,0,0.5)");
            for (let i = 0; i < sectionsLength; i++) {
                let a0 = 2 * Math.PI * i / sectionsLength;
                let a1 = a0 + 2 * Math.PI / (i == 0 ? 1 : sectionsLength);
                let a = 2 * Math.PI * (i + 0.5) / sectionsLength;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, a0, a1, false);
                ctx.fillStyle = colors[i % 2];
                ctx.fill();
                ctx.fillStyle = g;
                ctx.fill();
                ctx.save();
                if (i == selected) {
                    ctx.fillStyle = "#FFF";
                    ctx.shadowColor = "#FFF";
                    ctx.shadowBlur = r / 20;
                } else {
                    ctx.fillStyle = "#AAA";
                    ctx.shadowColor = "#000";
                    ctx.shadowBlur = r / 100;
                }
                // ctx.font = "bold " + r / sections.length * 1.6 + "px serif";

                ctx.font = "bold " + ((32 / 700) * innerHeight) + "px arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.translate(cx, cy);
                ctx.rotate(a);
                ctx.fillText(sections[i], r * 0.62, 0);
                ctx.restore();
            }
            newWheels.push(c);
        }
        this.wheels = newWheels;
    }

    drawFrame() {
        const r = this.getScreenRadius();
        this.frame = document.createElement("canvas");
        this.frame.width = this.frame.height = 10 + 2 * r * 1.25 | 0;
        let ctx = this.frame.getContext("2d"),
            cx = this.frame.width / 2,
            cy = this.frame.height / 2;
        if (ctx == null) return;
        ctx.shadowOffsetX = r / 80;
        ctx.shadowOffsetY = r / 80;
        ctx.shadowBlur = r / 20;
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.005, 0, 2 * Math.PI, true);
        ctx.arc(cx, cy, r * 0.995, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#fafafa";
        ctx.fill();
        ctx.shadowOffsetX = r / 40;
        ctx.shadowOffsetY = r / 40;
        // let g = ctx.createRadialGradient(cx - r / 7, cy - r / 7, 0, cx, cy, r / 3);
        // g.addColorStop(0, "#FFF");
        // g.addColorStop(0.2, "#F44");
        // g.addColorStop(1, "#811");
        // ctx.fillStyle = g;
        ctx.beginPath();
        // ctx.arc(cx, cy, r / 3.5, 0, 2 * Math.PI, false);
        // ctx.fill();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI - 0.2);
        ctx.beginPath();
        ctx.moveTo(- r * 1.1, - r * 0.05);
        ctx.lineTo(- r * 0.9, 0);
        ctx.lineTo(- r * 1.1, r * 0.05);
        ctx.fillStyle = "#08528c";
        ctx.fill();
    }

    getScreenRadius() {
        const innerWidth = this.innerWidth;
        const innerHeight = this.innerHeight;
        return Math.min(innerWidth, innerHeight) / 2.25 | 0;
    }

    repaint() {
        // const innerWidth = window.innerWidth;
        // const innerHeight = window.innerHeight;
        const innerWidth = this.innerWidth;
        const innerHeight = this.innerHeight;
        const canvas = this.canvasRef.current;
        if (canvas == null || this.frame == null) return;
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        let cx = innerWidth / 2, cy = innerHeight / 2;
        let ctx = canvas.getContext("2d");
        if (ctx == null) return;
        let selected = (Math.floor((- 0.2 - this.angle) * sections.length / (2 * Math.PI))
            % sections.length);
        if (selected < 0) selected += sections.length;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.angle);
        ctx.translate(-this.wheels[selected].width / 2, -this.wheels[selected].height / 2);
        ctx.drawImage(this.wheels[selected], 0, 0);
        ctx.restore();
        ctx.drawImage(this.frame, cx - this.frame.width / 2, cy - this.frame.height / 2);
    }

    spin(speed: number, duration: number) {
        let start = performance.now(),
            angle0 = this.angle;
        let animationFrame = () => {
            let now = performance.now();
            let t = (now - start) / duration;
            if (t > 1) t = 1;
            this.angle = angle0 + (speed * t - 0.5 * speed * t * t) * 100;
            this.repaint();
            if (t < 1)
                requestAnimationFrame(animationFrame);
            else
                this.running = false;
        }
        requestAnimationFrame(animationFrame);
        this.running = true;
    }


    run() {
        setInterval(() => {
            const sz = window.innerWidth + "/" + window.innerHeight;
            if (this.csz !== sz) {
                this.csz = sz;
                this.drawWheel();
                this.drawFrame();
                this.repaint();
            }
        }, 10);
    }

    start() {
        if (!this.running) {
            this.spin(0.5 + Math.random() * 0.125, 5000);
        }
    };

    render() {
        return (<div className="wheel-container" ref={this.containerRef} onClick={() => this.start()}>
            <canvas ref={this.canvasRef}></canvas>
        </div>)
    }
}
