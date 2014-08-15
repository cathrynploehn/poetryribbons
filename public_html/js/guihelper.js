/* 
 * Helper functions to keep main gui running smoothly
 */

function GuiHelper () {}

/*
 * Changes play button to look like pause btn
 * @param Nothing
 * @returns Nothing
 */
GuiHelper.addPauseBtn = function () {
    //remove play class and add pause class
    var item = $(".play");
    $(item).removeClass("play btn-success").addClass("pause");
    //Change icon
    $(item).children().removeClass("glyphicon-play").addClass("glyphicon-pause");
};
/*
 * Changes pause button to look like play btn
 * @param Nothing
 * @returns Nothing
 */
GuiHelper.addPlayBtn = function () {
    //remove pause class and add play class
    var item = $(".pause");
    $(".pause").removeClass("pause").addClass("play btn-success");
    //Change icon
    $(item).children().removeClass("glyphicon-pause").addClass("glyphicon-play");
};

/*
 * Loads poem text onto the screen
 * @param original lyrics - array of string values representing lyrics, 
 *        translated lyrics - array of string values representing lyrics
 * @returns Callback function
 */
GuiHelper.loadText = function (title, author, originalLyrics, translatedLyrics, callback) {
    var line = 1;
    var stanza = 1;
    
    $(".header-poem-title").html(title);
    $(".header-poem-author").html("<small>by " + author + "</small>");

    $("#translatedLyrics-pane").append("<p class=\"lyrics-pane-padding\"></p>");
    $("#originalLyrics-pane").append("<p class=\"lyrics-pane-padding\"></p>");
    
    $(originalLyrics).each(function (index){
        if(this == "ssss"){
            $("#originalLyrics-pane").append("<p class=\"space\"></p>");
            stanza++;
        } else {
            if(line%2==0){
                $("#originalLyrics-pane").append("<p class=\"stanza" + stanza + " line line" + line + "\"><span class=\"line-number\">"+line+"</span><span class=\"line-content\">" + this +"</span></p>");
            } else {
                $("#originalLyrics-pane").append("<p class=\"stanza" + stanza + " line line" + line + "\"><span class=\"line-number-blank\">"+line+"</span><span class=\"line-content\">" + this +"</span></p>");
            }
            line++;
        }
    });

    $("#originalLyrics-pane").append('<p class="lyrics-pane-padding"></p>');

    line = 1;
    stanza = 1;
    $(translatedLyrics).each(function (index){
        if(this == "ssss"){
            $("#translatedLyrics-pane").append("<p class=\"space\"></p>");
            stanza++;
        } else {
            if(line%2==0){
                $("#translatedLyrics-pane").append("<p class=\"stanza" + stanza + " line line" + line + "\"><span class=\"line-number\">"+line+"</span><span class=\"line-content\">" + this +"</span></p>");
            } else {
                $("#translatedLyrics-pane").append("<p class=\"stanza" + stanza + " line line" + line + "\"><span class=\"line-number-blank\">"+line+"</span><span class=\"line-content\">" + this +"</span></p>");
            }

            
            line++;
        }
    });
    
    $("#translatedLyrics-pane").append('<p class="lyrics-pane-padding"></p>');

    $('.poem-lyrics-pane-lyrics').minimap();
    $(".line1").addClass("highlight"); //add highlight for first line

    callback();
};

/*
 * Changes highlight to match current line being read
 * @param current trigger, previous trigger
 * @returns Nothing
 */
GuiHelper.updateLyrics = function (currentTrigger, prevTrigger) {
    var classnamePrev = "line" + prevTrigger; //construct string for classname of line currently highlighted
    //alert("update previous " + classnamePrev);
    $("." + classnamePrev).removeClass("highlight"); //remove highlight for that line
    
    var classnameNext = "line" + currentTrigger; //construct string for classname of line to be highlighted
    $("." + classnameNext).addClass("highlight"); //add highlight for that line
    //alert("update next " + classnameNext);

   var top = $('#originalLyrics-pane .highlight').position().top; 
   console.log('top '+top);
   
   var containerHeight = $('#poem-lyrics-pane').outerHeight();
   containerHeight = containerHeight / 2;

   $('.poem-lyrics-pane-lyrics')
      .stop(true, true)
      .animate({'scrollTop': top - containerHeight}, 'slow', 'swing');
       // .scrollTop(440);
};

GuiHelper.updateTimer = function (time){
    $("#audio-time-holder").html(time);
};

GuiHelper.guiReady = function (audio){
    $("#btn-play").addClass("play");
    $("#btn-begin-reading").removeClass("btn-begin-reading-loading");
    $("#btn-begin-reading").addClass("play btn-success");
    
    $("#btn-play").html("<span class=\"glyphicon glyphicon-play\"></span>");
    $(".audio-controller").prepend('<button type="button" id="btn-back" class="btn btn-lg"><span class="glyphicon glyphicon-chevron-left"></span></button>');
    $(".audio-controller").append('<button type="button" id="btn-forward" class="btn btn-lg"><span class="glyphicon glyphicon-chevron-right"></span></button>');
    $(".audio-controller").append("<span id=\"audio-time-holder\"></span>");
    
    $("#btn-begin-reading").html("<div>Begin reading</div><div class=\"glyphicon glyphicon-arrow-right\"></div>");
    
    Animation.model1(audio);
    
    $("#btn-begin-reading").click(function(){
        $("#onboarding-container").slideUp("slow");
    });

     //Restart poem
    $("#btn-replay").click(function(){
            //move to previous trigger
            audio.setLine(1);
    });
};
GuiHelper.guiReadyPoemSubmit = function (audio){
    $("#btn-play").addClass("play");
    $("#btn-begin-reading").removeClass("btn-begin-reading-loading");
    $("#btn-begin-reading").addClass("play btn-success");
    
    $("#btn-play").html("<span class=\"glyphicon glyphicon-play\"></span>");
    $(".audio-controller").prepend('<button type="button" id="btn-back" class="btn btn-lg"><span class="glyphicon glyphicon-chevron-left"></span></button>');
    $(".audio-controller").append('<button type="button" id="btn-forward" class="btn btn-lg"><span class="glyphicon glyphicon-chevron-right"></span></button>');
    $(".audio-controller").prepend('<button type="button" id="btn-replay" class="btn btn-lg"><span class="glyphicon glyphicon-repeat"></span></button>');
    $(".audio-controller").append('<button type="button" id="btn-check" class="btn btn-lg"><span class="glyphicon glyphicon-ok-circle"></span></button>');
    $(".audio-controller").append("<span id=\"audio-time-holder\"></span>");
    $(".audio-controller").append('<div class="review-btn-group"><div class="btn-group" data-toggle="buttons"><label id="edit" class="btn reviewToggle active"><input type="radio" name="reviewToggle" id="edit">Edit</label><label id="review" class="btn reviewToggle"><input type="radio" name="reviewToggle" id="review">Review</label></div><button type="button" id="btn-save" class="btn btn-lg"><span class="glyphicon glyphicon-floppy-disk"></span></button></div>');
    $(".audio-controller").append('');

    $("#btn-begin-reading").html("<div>Begin recording</div><div class=\"glyphicon glyphicon-arrow-right\"></div>");
    
    Animation.model1(audio);
    
    $("#btn-begin-reading").click(function(){
        $("#onboarding-container").slideUp("slow");
    });

    GuiHelper.updateTriggers(audio.getTriggers());

     //mark line
     $("#btn-check").click(function(){
            //alert('check');
            audio.setTimeLine();
    });
    
     //Restart poem
    $("#btn-replay").click(function(){
            //move to previous trigger
            audio.setLine(1);
    });
    
    $("#btn-begin-reading").click(function(){
        $("#onboarding-savepoem").slideUp("slow");
    });

     $("#btn-resume-editing").click(function(){
        $("#save-container").slideUp("slow");
    });

    GuiHelper.hideViz();
    GuiHelper.greyControls();
};

GuiHelper.guiNotReady = function (){
    //add spinner
    var opts = {
        lines: 5, // The number of lines to draw
        length: 0, // The length of each line
        width: 10, // The line thickness
        radius: 9, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 42, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 72, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
      };
        var target1 = document.getElementById('btn-play');
        var spinner1 = new Spinner(opts).spin(target1);
        
    var opts2 = {
        lines: 5, // The number of lines to draw
        length: 0, // The length of each line
        width: 10, // The line thickness
        radius: 8, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 42, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#fff', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 72, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
      };
        var target2 = document.getElementById('btn-begin-reading');
        var spinner2 = new Spinner(opts2).spin(target2);
        
        var canvas = document.getElementById('visualization-canvas');
        var drawContext = canvas.getContext('2d');

        //resize canvas to fit poem pane
        drawContext.canvas.height = document.getElementById('poem-pane-pane').offsetHeight;
        drawContext.canvas.width  = document.getElementById('poem-pane-pane').offsetWidth;
};

GuiHelper.rotateLeft = function(){
    $('#left-menu').removeClass('left-menu-inactive'); 
    $('#left-menu').addClass('left-menu-active');
    $('#poem-main-container').removeClass('rotate-main-center');
    $('#poem-main-container').addClass('rotate-main-left'); 
};

GuiHelper.rotateCenter = function(){
    $('#left-menu').removeClass('left-menu-active');
    $('#left-menu').addClass('left-menu-inactive'); 
    $('#poem-main-container').removeClass('rotate-main-left');
    $('#poem-main-container').addClass('rotate-main-center');
};

GuiHelper.hideViz = function(){
    $('#btn-hide-viz').addClass('showViz');
    $('#btn-hide-viz').removeClass('hideViz');
    
    $('#hide-visual-text small').html("show visual");
    $('#poem-pane-pane').addClass('hide');
    $('#poem-lyrics-pane').removeClass('col-md-7');
    $('#poem-lyrics-pane').addClass('middle');
    $('#poem-lyrics-pane').addClass('col-md-8');
    $('#poem-lyrics-pane').addClass('col-md-offset-2');
    
    $('.audio-controller').removeClass('col-md-7');
    $('.audio-controller').removeClass('col-md-offset-5');
    $('.audio-controller').addClass('col-md-12');
};
GuiHelper.showViz = function(){
    $('#btn-hide-viz').addClass('hideViz');
    $('#btn-hide-viz').removeClass('showViz');
    
    $('#hide-visual-text small').html("hide visual");
    $('#poem-pane-pane').removeClass('hide');
    $('#poem-lyrics-pane').removeClass('col-md-8');
    $('#poem-lyrics-pane').addClass('col-md-7');
    $('#poem-lyrics-pane').removeClass('middle');
    $('#poem-lyrics-pane').removeClass('col-md-offset-2');
    
    $('.audio-controller').removeClass('col-md-12');
    $('.audio-controller').addClass('col-md-7');
    $('.audio-controller').addClass('col-md-offset-5');
};

GuiHelper.updateTriggers = function(triggers){
    $('#trigger-pane').html('<p class="lyrics-pane-padding"></p>');
    $(triggers).each(function(index) {
        $('#trigger-pane').append('<p class="stanza"><span class="line-number">'+ (index + 1) +': </span><span class="line-content"> ' + this +'</span></p>');
    });

};

GuiHelper.markLine = function(prevTrigger){
    console.log('prevTrigger: ' + prevTrigger);
    var classnamePrev = "line" + prevTrigger; //construct string for classname of line to be highlighted
    //add highlight for that line
    $("." + classnamePrev).addClass('alert-success');
    $("." + classnamePrev + " .check-area").html('<span class="glyphicon glyphicon-ok-circle"></span>')

    //alert("update next " + classnameNext);
};

GuiHelper.greyControls = function(){
    $('#btn-check').css('color', 'rgba(0,0,0,0.2)');
}
GuiHelper.clearControls = function(){
    $('#btn-check').css({'color' : 'black'});
}

$('#btn-question').click(function() {
    $('#onboarding-container').show();
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

GuiHelper.reviewMode= function(){

}