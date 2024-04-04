function main() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // const pumkin = new Pumpkin(
    //     canvas.width/2,
    //     canvas.height/2,
    //     Math.min(canvas.width, canvas.height) * 0.5

    // );

    class Bar {
        constructor(x, y, width, height, color, index){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
            
        }
        update(micInput){
            const sound = micInput * 1000;
            if(sound > this.height){
                this.height = sound;
            } else{
                this.height -= this.height * 0.03;
            }
        }
        draw(context, volume){
            context.strokeStyle = this.color;
            context.save();
            context.translate(0, 0);
            context.rotate(this.index * 0.03);
            context.scale(1 + volume * 0.2,1 + volume * 0.2)

            context.beginPath();
            // context.moveTo(this.x, this.y);
            // context.lineTo(this.y, this.height);
            context.bezierCurveTo(0, 0, this.height, this.height, this.x, this.y );
            context.stroke();

            context.rotate(this.index * 0.02);
            context.strokeRect(this.y + this.index * 1.5, this.height, this.height/2, this.height);
            context.beginPath();
            context.arc(this.x + this.index * 2.5, this.y, this.height * 0.5, 0, Math.PI * 2);
            context.stroke();
            context.restore();
        }
    }
    const fftSize = 512;
    const micrphone =  new Microphone(fftSize);
    let bars = [];
    let barWidth = canvas.width/(fftSize/2);
    function createBar(){
        for (let i = 0; i < (fftSize/2); i++) {
            let color = 'hsl(' + i * 2 + ', 100%, 50%)'
            bars.push(new Bar(0, i * 1.5, 5, 50, color, i))
            
        }
    }
    createBar();
    // console.log(bars);
    let angle = 0;
    let sofVolume = 0;

    function animate() {
        if(micrphone.initializad){       
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // generates audio sample frome micrphone
        const samples = micrphone.getSamples();
        const voluma = micrphone.getSamples();
        // animate bars based on micrphone data
        angle -= 0.001 + (0.001 * 0.05);
        
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2)
        ctx.rotate(angle);
        bars.forEach(function(bar, i){
            bar.update(samples[i])
            bar.draw(ctx, voluma);
        });
            ctx.restore();
            sofVolume = sofVolume * 0.9 + voluma * 0.1;
        }
        requestAnimationFrame(animate)
    }
    animate()
}
