/* 
 * Class Poem
 * Attributes: Author, Poem Title, Poem File name
 * Methods: Get poem author, title, poem file name, lyrics, triggers
 * 
 * Constructor:
 * @Param
 * Author: String
 * Title: String
 * Filename: String
 * Lyrics: String[]
 * Triggers: Integer[]
 * 
 * Attributes:
 * Author: String
 * Title: String
 * Filename: String
 * Lyrics: String[]
 * Triggers: Integer[]
 * 
 */
var poem;
function Poem (title, author, callback){
    //Get JSON for lyrics, triggers of poem
    //sample data for now
    
    poem = this;
    function init () {
        var originalLyrics = [
            "Roses are red",
            "Violets are blue",
            "Coding is cool",
            "and so are you!"
        ];
        var triggers = [
            3,
            5,
            7,
            8
        ];
        
        var translatedLyrics;
        
        $.getJSON("./json/orviz-daniel-quiereme", function( data ){
            originalLyrics = data['originalLyrics'];
            translatedLyrics = data['translatedLyrics'];
            triggers = data['triggers'];
            
        }).done(function(){
            //Set all attributes
            poem.author = author;
            poem.title = title;
            poem.filename = "./audio/orviz-daniel-quiereme.mp3";
            poem.originalLyrics = originalLyrics;
            poem.translatedLyrics = translatedLyrics;
            poem.triggers = triggers;
            
            callback();            
        });
    }

    this.getAuthor = function(){
        var author1 = this.author;
        return author1;
    };
    this.getTitle = function(){
        var title1 = this.title;
        return title1;
    };
    this.getFilename = function(){
        var filename1 = this.filename;
        return filename1;
    };
    this.getOriginalLyrics = function(){
        var lyrics1 = this.originalLyrics;
        return lyrics1;
    };
    this.getTranslatedLyrics = function(){
        var lyrics1 = this.originalLyrics;
        return lyrics1;
    };
    this.getTriggers = function(){
        var triggers1 = this.triggers;
        return triggers1;
    };

    init();
}


