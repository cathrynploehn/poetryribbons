/* 
 * Class Poem
 * Attributes: Author, Poem Title, Poem File name
 * Methods: Get poem author, title, poem file name, lyrics, triggers
 * 
 * Constructor:
 * @Param
 * Author: String
 * Title: String
 * Callback: function to be called after text loaded
 * 
 * Attributes:
 * Author: String
 * Title: String
 * Filename: String
 * originalLyrics: String[]
 * translatedLyrics: String[]
 * Triggers: Integer[]
 * 
 */
function Poem (poemkey, callback){
    //Get JSON for lyrics, triggers of poem
    //
        poemVar = this;
        var originalLyrics;
        var translatedLyrics;
        var triggers;
        var filename;
        var author;
        var translator;
        var title;

        if(poemkey === 'poem_submit'){
                filename = $('#audio-file').attr('value');
                /*filename = filename.substring(3, filename.length);
                filename = '..\\' + filename;*/
                triggers = [];

                var k = 0;

                originalLyrics = [];
                $('#originalLyrics-pane p span.line-content').each(function() {
                    var value = $(this).text();
                    if(value === ''){
                        originalLyrics.push("ssss");
                    } else {
                        originalLyrics.push(value);
                    }
                    
                    if( k > 0){
                        triggers.push((k-1) * 100);
                    }
                    k++;
                  });


                translatedLyrics = [];
                $('#translatedLyrics-pane p span.line-content').each(function() {
                    var value = $(this).text();
                    if(value === ''){
                        translatedLyrics.push("ssss");
                    } else {
                        translatedLyrics.push(value);
                    }
                  });

                //alert(translatedLyrics);

                author = $('#first_name').text() + ' ' + $('#last_name').text();
                title = $('.header-poem-title').text();

                poemVar.author = author;
                poemVar.title = title;
                poemVar.filename = filename;
                poemVar.originalLyrics = originalLyrics;
                poemVar.translatedLyrics = translatedLyrics;
                poemVar.triggers = triggers;
            

                var titleshort = title.replace(/\s+/g, '');
                var first_name = $('#first_name').text();
                var last_name = $('#last_name').text();
                
                if(first_name === 'Anonymous'){
                    poemVar.poemkey = first_name + '-' + titleshort;
                } else {
                    poemVar.poemkey = last_name + '-' + first_name + '-' + titleshort;
                }
                    
                callback(this);

        } else {
           poemkey = "./json/" + poemkey + ".json";
        
            $.getJSON(poemkey, function( data ){
                originalLyrics = data['originalLyrics'];
                translatedLyrics = data['translatedLyrics'];
                triggers = data['triggers'];
                filename = data['filename-original'];
                author = data['author'];
                title = data['title'];
                translator = data['translator'];
                
            }).done(function(){
                //Set all attributes
                poemVar.author = author;
                poemVar.title = title;
                poemVar.filename = filename;
                poemVar.originalLyrics = originalLyrics;
                poemVar.translatedLyrics = translatedLyrics;
                poemVar.triggers = triggers;
                
                callback();            
            }); 
        }
        
}

Poem.prototype.getAuthor = function(){
    var author1 = this.author;
    return author1;
};
Poem.prototype.getTitle = function(){
    var title1 = this.title;
    return title1;
};
Poem.prototype.getFilename = function(){
    var filename1 = this.filename;
    return filename1;
};
Poem.prototype.getOriginalLyrics = function(){
    var lyrics1 = this.originalLyrics;
    return lyrics1;
};
Poem.prototype.getTranslatedLyrics = function(){
    var lyrics1 = this.translatedLyrics;
    return lyrics1;
};
Poem.prototype.getTriggers = function(){
    var triggers1 = this.triggers;
    return triggers1;
};

Poem.prototype.setTriggers = function(audiotriggers){
    this.triggers = audiotriggers;
};

Poem.prototype.getJSON = function(){
    var JSONtext = '{ '
        + '"poemkey": "' + this.poemkey + '",'
        + '"title": "' + this.title + '",'
        + '"author": "' + this.author + '",'
        + '"translator": "' + this.translator + '",'
        + '"filename-original": "' + this.filename + '",'
        + '"originalLyrics": [';

        //alert(this.originalLyrics);

        $.each(this.originalLyrics, function(key, value) {
            JSONtext += '"' + value + '" ,';
        });

        JSONtext = JSONtext.substring(0, (JSONtext.length-1));
        JSONtext += '],';

        if(this.translatedLyrics.length != 0){
            JSONtext += '"translatedLyrics" :[';
            $.each(this.translatedLyrics, function(key, value) {
                JSONtext += '"' + value + '" ,';
            });
            JSONtext = JSONtext.substring(0, (JSONtext.length-1));
            JSONtext += '],';
        }
        


        JSONtext += '"triggers": [ ';
        $.each(this.triggers, function(key, value) {
            JSONtext += value + ',';
        });
        JSONtext = JSONtext.substring(0, (JSONtext.length-1));
        JSONtext += ']}';

        return JSONtext;
}   

Poem.prototype.saveJSON = function(){
    var JSONtext = this.getJSON();
    alert(JSONtext);
    var JSONdata = JSON.parse(JSONtext);
    alert(JSONdata);

    $('body').append(JSONtext);

    var JSONfilename = "./json/" + this.poemkey + ".json";

    $.ajax({
      type: "POST",
      url: "./poemsubmit.php",
      data: JSONdata,
      //dataType: "json",
      success: function(dataResult){
        $('body').html(dataResult);
      },
      error: function(xhr, desc, err) {
        alert(xhr);
        alert("Details: " + desc + "\nError:" + err);
      //dataType: "json"
        }
    });

    //$.post("./poemsubmit.php", JSON, function(returnedData) {
    //})
}   