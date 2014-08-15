function Animation (){}

Animation.draw = function(audio, callback){
    Animation.model1(audio);   

    if (audio.isPlaying) {
        audio.updateTriggers();
        
        requestAnimFrame(function(){
            Animation.draw(audio);
        }); 
    } else {

    }
};

Animation.model1 = function(audio){
     //draw line
        var canvas = document.getElementById('visualization-canvas');
        var drawContext = canvas.getContext('2d');
        drawContext.clearRect(0, 0, drawContext.canvas.width, drawContext.canvas.height);
        
        var CANVAS_HEIGHT = drawContext.canvas.height;
        var CANVAS_WIDTH = drawContext.canvas.width-50;

        data = audio.updateVisualData();

        var width = Math.floor(1/data.freqsData.length, 10);

        // Draw the time domain chart.
      for (var i = 0; i < data.binCount; i+=25) {
            var value = data.timesData[i];
            var percent = value / 256;
            var freq_height = CANVAS_HEIGHT * (percent);
            var offset = CANVAS_HEIGHT - freq_height - 1;
            var barWidth = CANVAS_WIDTH/data.binCount;
            drawContext.fillStyle = 'black';
            drawContext.beginPath();
            drawContext.arc(i * barWidth,offset,3,0,2*Math.PI);
            drawContext.fill();
            //drawContext.fillRect(i * barWidth, offset, 1, 2);
        }
    };

Animation.model2 = function(){
     //draw line
        var canvas = document.getElementById('visualization-canvas');
        var drawContext = canvas.getContext('2d');
        drawContext.clearRect(0, 0, drawContext.canvas.width, drawContext.canvas.height);
        
        var CANVAS_HEIGHT = drawContext.canvas.height;
        var CANVAS_WIDTH = drawContext.canvas.width-50;

        data = audio.updateVisualData();

        var width = Math.floor(1/data.freqsData.length, 10);

        // Draw the time domain chart.
      for (var i = 0; i < data.binCount; i+=25) {
            var valueX = data.timesData[i];
            var valueY = data.freqsData[i];
            var percentX = valueX / 256;
            var percentY = valueY / 256;
            
            var times_height = CANVAS_HEIGHT * (percentX);
            var freq_height = CANVAS_WIDTH * (percentY);
            
            var barWidth = CANVAS_WIDTH/data.binCount;
            drawContext.fillStyle = 'black';
            drawContext.beginPath();
            drawContext.arc(freq_height,times_height,3,0,2*Math.PI);
            drawContext.fill();
            //drawContext.fillRect(i * barWidth, offset, 1, 2);
        }
    };
