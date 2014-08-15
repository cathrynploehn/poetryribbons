/* 
 * 
 */

var poemKey = $('article').attr('id');

$(document).ready(function(){

init();
var time;
var audio;
var poem;

function init(){
        GuiHelper.guiNotReady();
        //Initialize poem object
        new Poem(poemKey, poemSucceed);
        function poemSucceed(poemObj){
            poem = poemObj;
            createAudio();

            //Create web audio object
            function createAudio(finish){
                new Audio(poem.getFilename(), poem.getTriggers(), ready);   
            }
        }
}
 function ready (audioObj){
    audio = audioObj;
    audio.activateViz = false;
     GuiHelper.guiReadyPoemSubmit(audio);
    
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

    $('#btn-save').click(function() {
        $('#save-container').show();

    });

    $('label#review').click(function (){
        GuiHelper.showViz();
        GuiHelper.clearControls();   
        $('#btn-check').hide();
        audio.activateViz = true;
        audio.setLine(1);
    });

    $('label#edit').click(function (){
        GuiHelper.hideViz();
        GuiHelper.greyControls();   
        $('#btn-check').show(); 
        audio.activateViz = false;        
    });

    $('#btn-savePoem').click(function() {
        if($('#btn-play').hasClass("pause")) { //if pause/stop button is pressed
            GuiHelper.addPlayBtn();
            //stop audio
            audio.pauseSound();
            GuiHelper.greyControls();
        }  
        poem.setTriggers(audio.getTriggers());
        poem.saveJSON();
    });
 }



//Bind event handler to object
$("#btn-play").click(function() {
    if($(this).hasClass("play")){ //if play button is pressed
        GuiHelper.addPauseBtn();
        //start audio
        audio.startSound();
    
        GuiHelper.clearControls();
    
    } else if ($(this).hasClass("pause")) { //if pause/stop button is pressed
        GuiHelper.addPlayBtn();
        //stop audio
        audio.pauseSound();
        GuiHelper.greyControls();
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
