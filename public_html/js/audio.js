/* 
 * Creates audio context with handlers to start and stop sound operation. 
 */

function Audio(url, poemTriggers, callback){
    var audioObject = this;

    // Interesting parameters to tweak!
    this.SMOOTHING = 0.5;
    this.FFT_SIZE = 2048;
    
     this.context;
     var startOffset = 0;
     var startTime = 0;
    
    this.currTime = 0; //current place in audio file
    this.lagTime = 0; //offset from buffer
    
    this.mainSource;
    this.mainBuffer;
    
    var analyser;
    var freqs;
    var times;
    
    var triggers = poemTriggers;
    
    this.isPlaying = false;
    this.initialized = false;
    
    var currentTrigger = 1;
    var prevTrigger = -1;
    
    this.activateViz = true;

    initializeAudio(url);
    
    this.startSound = function () {
        this.startTime = context.currentTime;
         
        if(this.currTime === 0){
            this.lagTime = context.currentTime;
        } else {
            this.lagTime = context.currentTime - this.currTime;
        }
         
         mainSource = context.createBufferSource();
         // Connect graph
         mainSource.buffer = mainBuffer;
         mainSource.loop = false; 
        
        // Create a ScriptProcessorNode.
        var processor = context.createScriptProcessor(2048);
        
        // Assign the onProcess function to be called for every buffer.
        processor.onaudioprocess = this.onProcess;
        
        // Assuming source exists, connect it to a script processor.
        mainSource.connect(processor);
        mainSource.connect(analyser);
        
         mainSource.connect(context.destination);
         
         // Start playback, but make sure we stay in bound of the buffer.
         mainSource.start(0, startOffset % buffer.duration);
         this.isPlaying = true;
         
         if(this.activateViz){
            Animation.draw(this);
         }
         
         if(this.initialized === false){
            
            this.initialized = true;
         }
    };
    this.pauseSound = function() {
        mainSource.stop();
        // Measure how much time passed since the last pause.
        startOffset += context.currentTime - startTime;
        
        //update current time
        this.currTime = context.currentTime - this.lagTime;
        time = context.currentTime - this.lagTime;
        
        this.isPlaying = false;
    };

    //process sound
    function onProcess(e) {
        var leftIn = e.inputBuffer.getChannelData(0);
        var rightIn = e.inputBuffer.getChannelData(0);
        var leftOut = e.outputBuffer.getChannelData(0);
        var rightOut = e.outputBuffer.getChannelData(0);
    }

    this.getTriggers = function() {
        return triggers;
    }

    this.updateTriggers = function() {
        if(this.currTime >= triggers[currentTrigger]){
            while(this.currTime >= triggers[currentTrigger]){
                prevTrigger = currentTrigger;
                currentTrigger++;
                GuiHelper.updateLyrics(currentTrigger, prevTrigger);
            }
        } else if (this.currTime <= triggers[prevTrigger]) {
            while(this.currTime <= triggers[prevTrigger]){
                prevTrigger = currentTrigger;
                currentTrigger--;
                GuiHelper.updateLyrics(currentTrigger, prevTrigger);
            }
        }
    
        //update current time
        this.currTime = context.currentTime - this.lagTime;
        time = parseInt(this.currTime / 60) + ':' + parseInt(this.currTime % 60); //format current time to 2 decimal places
        GuiHelper.updateTimer(time);
        time = context.currentTime - this.lagTime;
    };

    this.setTimeLine = function() {
        var prevT = 0;

        if((this.isPlaying)){
            
            if(prevTrigger === -1){
                        prevTrigger = 0;
            }
            
            prevT = prevTrigger + 1;
            //alert(prevT);
            GuiHelper.markLine(prevT + 1);

            if(!(currentTrigger == triggers.length + 1)){
                currentTrigger++;
                prevTrigger++;
                //alert(currentTrigger + ' ' + prevTrigger);
                GuiHelper.updateLyrics(currentTrigger, prevTrigger);
            }

            triggers[prevTrigger] = (context.currentTime - this.lagTime).toFixed(3);
            console.log('Trigger ' + prevTrigger +' set: ' + triggers[prevTrigger]);
            GuiHelper.updateTriggers(triggers); 


        }
    }

    this.setLine = function(index) {
        if(index > -1 && index <= triggers.length){
            var playIt = false;
            var msg = '';
            
            if(this.isPlaying){
                this.pauseSound();
                playIt = true;
            }
            
            if(prevTrigger === -1){
                prevTrigger = 0;
            } 

            
            prevTrigger = currentTrigger;        
            currentTrigger = index;
                        
            GuiHelper.updateLyrics(currentTrigger, prevTrigger);
            
            if (index === 1) {
                prevTrigger = -1;
            }

            startOffset = triggers[currentTrigger-1];
            msg += 'Start offset:' + startOffset;
                    
            this.currTime = triggers[currentTrigger-1]; 
            
            if(playIt){
                this.startSound();
            }
        }
    }

    this.incrementLine = function(type) {
        var playIt = false;
        var msg = '';
        
        if(this.isPlaying){
            this.pauseSound();
            playIt = true;
        }
        
        if(prevTrigger === -1){
            prevTrigger = 0;
        }

        
            if(type === 1 && !(currentTrigger == triggers.length)){
                currentTrigger++;
                prevTrigger++;
                
                GuiHelper.updateLyrics(currentTrigger, prevTrigger);
            } else if (type === 2 && !(prevTrigger === 0)){
                currentTrigger--;
                prevTrigger--;            
                GuiHelper.updateLyrics(currentTrigger, (currentTrigger+1));
            }
            //alert('Current trigger: ' + currentTrigger + 'Prev trigger: ' + prevTrigger);


        //set start offset according to trigger
        startOffset = triggers[currentTrigger-1];
        msg += 'Start offset:' + startOffset;
        
        //alert(msg);
        
        this.currTime = triggers[currentTrigger-1]; 
        
        if(playIt){
            this.startSound();
        }
    };

    this.updateVisualData = function() {
        // Get the frequency data from the currently playing music
        //analyser.smoothingTimeConstant = this.SMOOTHING;
        //analyser.fftSize = this.FFT_SIZE;
        
        freqs = new Uint8Array(analyser.frequencyBinCount);
        times = new Uint8Array(analyser.frequencyBinCount);
        
        
        analyser.getByteFrequencyData(freqs);
        analyser.getByteTimeDomainData(times);
        
        var data = new soundData();
        
        return data;
    };
    
    function soundData(){
            this.timesData = times;
            this.freqsData = freqs;
            this.binCount = analyser.frequencyBinCount;
    };
    
    function initializeAudio(url){
        //Initialize Audio Context
        var contextClass = (window.AudioContext || 
          window.webkitAudioContext || 
          window.mozAudioContext || 
          window.oAudioContext || 
          window.msAudioContext);
        if (contextClass) {
          // Web Audio API is available.
          context = new contextClass();
        } else {
          // Web Audio API is not available. Ask the user to use a supported browser.
          alert("Sorry, this app is not supported on your browser :(");
        }

        //load the audio into the Audio Context
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function() {
            context.decodeAudioData(request.response, function(theBuffer) {
            buffer = theBuffer;
            mainBuffer = buffer;

            analyser = context.createAnalyser();

            analyser.connect(context.destination);
            analyser.minDecibels = -140;
            analyser.maxDecibels = 0;

            freqs = new Uint8Array(analyser.frequencyBinCount);
            times = new Uint8Array(analyser.frequencyBinCount);
            
            callback(audioObject);
          });
        };
        request.send();

        //function createSource (buffer) {
        //    var source = context.createBufferSource();
        //    source.buffer = buffer;
        //    source.connect(context.destination);
        //    mainSource = source;
        //    alert("Source created");
        //}
    }
}