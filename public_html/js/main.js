/* 
 * 
 */

var poemKey = $('article').attr('id');

$(document).ready(function(){

init();
var time;

function init(){
        GuiHelper.guiNotReady();
        //Initialize poem object
        var poem = new Poem(poemKey, poemSucceed);
        
        function poemSucceed(){
            //place poem text into screen
            //Add title
            GuiHelper.loadText(poem.getTitle(), poem.getAuthor(), poem.getOriginalLyrics(), poem.getTranslatedLyrics(), createAudio);
            
            //Create web audio object
            function createAudio(finish){
                audio = new Audio(poem.getFilename(), poem.getTriggers(), ready);   
            }
        }
}
 function ready (){
     GuiHelper.guiReady(audio);
     //if next button is pressed
    $("#btn-forward").click(function(){
        //move to next trigger
        audio.incrementLine(1);
    });

    //if prev button is pressed
    $("#btn-back").click(function(){
        //move to previous trigger
        audio.incrementLine(2);
    });
 }



//Bind event handler to object
$("#btn-play").click(function() {
    if($(this).hasClass("play")){ //if play button is pressed
        GuiHelper.addPauseBtn();
        //start audio
        audio.startSound();
    
    } else if ($(this).hasClass("pause")) { //if pause/stop button is pressed
        GuiHelper.addPlayBtn();
        //stop audio
        audio.pauseSound();
    }  
});
   
   

$("#visualization-canvas").mouseenter(function(){
    $("#visualization-controls").removeClass("invisible");
});
$("#visualization-canvas").mouseout(function(){
    $("#visualization-controls").addClass("invisible");
});
$("#visualization-controls, #visualization-controls > *").mouseenter(function(){
    $("#visualization-controls").removeClass("invisible");
});
$("btn").mouseout(function(){
    $("#visualization-controls").addClass("invisible");
});

$("#open-menu-btn-left").mouseenter(function(){
    GuiHelper.rotateLeft();
});
$("#poem-main-container > * ").click(function(){
    GuiHelper.rotateCenter();
});


$('#btn-hide-viz').click(function(){
    if($(this).hasClass("hideViz")){ //if play button is pressed
        GuiHelper.hideViz();
            
    } else if ($(this).hasClass("showViz")) { //if pause/stop button is pressed
        GuiHelper.showViz();
    }
});






var j = 1;
$("body").keypress(function(e){
   var code = e.keyCode || e.which;
   if(code == 48){
       $("#poem-pane-pane").append("<p>"+j+": "+time+"</p>");
   }
   j++;
});
//for(var b in window) { 
//  if(window.hasOwnProperty(b)) console.log(b); 

});
