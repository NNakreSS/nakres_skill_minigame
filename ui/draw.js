class SircleCanvas {
    canvas = document.querySelector('canvas')
    ctx = this.canvas.getContext("2d");
    canvasW = this.canvas.width;
    canvasH = this.canvas.height;
    centerX = this.canvasW / 2;
    centerY = this.canvasH * 1.5;
    sircleStart = 150
    sircleEnd = 30
    constructor(radius) {
        this.radius = radius
    }

    drawCanvas = (color = 'rgb(255 ,255 , 255)') => {
        this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);

        this.ctx.shadowColor = "black";
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 20;
        this.ctx.arc(this.centerX, this.centerY, this.radius, Math.PI * this.sircleStart / 180, Math.PI * this.sircleEnd / 180, false);
        this.ctx.stroke();
        this.ctx.closePath();

        // border
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.arc(this.centerX, this.centerY, this.radius + 15, Math.PI * this.sircleStart / 180, Math.PI * this.sircleEnd / 180, false);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.arc(this.centerX, this.centerY, this.radius - 15, Math.PI * this.sircleStart / 180, Math.PI * this.sircleEnd / 180, false);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    newArea = (color, startAngle, endAngle, radius, lineW, blr) => {
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = blr;
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineW;
        this.ctx.arc(this.centerX, this.centerY, radius, startAngle, endAngle, false);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}


