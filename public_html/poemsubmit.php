<?php 

//MySQL Database Connect
 include 'datalogin.php';

$path = 'submitpoem-step1.html';

$anonymous = '';
$is_error = false;
if (isset($_POST['submitted'])) {

	if (isset($_POST['anonymous'])) {
		$anonymous = isset($_POST['anonymous']);
	}	

	if($anonymous != 'anonymous') {
			if(trim($_POST['firstname']) === '')	{
				$is_error = true;
				$firstname_err = true;			
			} else {
				$first_name = $_POST['firstname'];
			}
			if(trim($_POST['lastname']) === '')	{
				$is_error = true;
				$lastname_err = true;
			} else {
				$last_name = $_POST['lastname'];
			}
	} else {
		$first_name = 'Anonymous';
		$last_name = ' ';
	}
	if(trim($_POST['poemtitle']) === '') {
		$is_error = true;
		$poemtitle_err = true;	
	} else {
		$poemtitle = $_POST['poemtitle'];
		$poem_name = 'poem_submit';
	}
	if(trim($_POST['originalText']) === '') {
		$is_error = true;
		$poemtext_err = true;	
	} else {
		$poem_text = explode("\r\n", $_POST['originalText']);
	}
	if(trim($_POST['translatedText']) === '') {
	} else {
		$poem_translatedText = explode("\r\n", $_POST['translatedText']);
	}
	if($_FILES != NULL){
		if($_FILES['audioInputFile']['size'] === 0 || $_FILES['audioInputFile']['size'] > 4194304){
			$is_error = true;
			$audio_err =  true;
		} else {
			$temp = explode(".", $_FILES["audioInputFile"]["name"]);
			$extension = end($temp);

			move_uploaded_file($_FILES["audioInputFile"]["tmp_name"], "tmpupload/" . $_FILES["audioInputFile"]["name"]);
			$audio_file = "tmpupload/" . $_FILES["audioInputFile"]["name"];
			//$audio_file = $_FILES['audioInputFile']['tmp_name']. '.' . $extension;
		}
	}
	if($is_error) {
		$path = 'submitpoem-step1.html';
		echo 'ERROR';
	} else {
		$path = 'submitpoem-step2.html';
	}
} 

if (is_ajax()) {
	echo 'ajax success';
  if (isset($_POST["triggers"])) { //Checks if action value exists
   	
  	$triggers = $_POST["triggers"];
  	$originalLyrics = $_POST["originalLyrics"];

  	$title = $_POST["title"];
  	$author = $_POST["author"];
  	$poemkey = $_POST["poemkey"];
  	$poem_filename = $_POST["filename-original"];

  	$tbl_name = 'poem_index';
   	$sql = "INSERT INTO $tbl_name(poem_key, poem_title, poem_author, filename)VALUES('$poemkey', '$title', '$author', '$poem_filename')";

   	$retval = mysql_query( $sql, $conn );
	if(! $retval ){
	  die('Could not enter data: ' . mysql_error());
	}

	$sql = "SELECT poem_id FROM poem_index WHERE poem_key = '$poemkey' ORDER BY poem_id DESC";
	$retval = mysql_query( $sql, $conn );
	if(! $retval ){
	  die('Could not enter data: ' . mysql_error());
	}
	$row = mysql_fetch_array($retval, MYSQL_ASSOC);
	$poemid = $row['poem_id'];
   	
   	$tbl_name = 'original_lines';
   	$sql = '';
   	$sql = "INSERT INTO $tbl_name(poem_id, lyric, lyric_index, lyric_trigger) VALUES ";
	$it = new ArrayIterator($originalLyrics);

    // a new caching iterator gives us access to hasNext()
    $cit = new CachingIterator( $it );

    // loop over the array
    foreach ( $cit as $value )
    {
        // add to the query
        $sql .= "(".$poemid.", '" .$cit->current()."' ,".$cit->key().", ".$triggers[$cit->key()].")";
        // if there is another array member, add a comma
        if( $cit->hasNext() )
        {
            $sql .= ",";
        }
    }


	//$sql.="INSERT INTO $tbl_name(poem_key, poem_title, poem_author)VALUES('$poemkey', '$title', '$author')";
    
   	$retval = mysql_query( $sql, $conn );
	if(! $retval ){
	  die('Could not enter data: ' . mysql_error());
	}

	if(isset($_POST["translatedLyrics"])){
		$translatedLyrics = $_POST["translatedLyrics"];
		$translatorName = $_POST["author"];

		$sql = '';
	   	$sql = "INSERT INTO translation_index(poem_id, translator_name) VALUES('$poemid', '$translatorName')";		

	   	$retval = mysql_query( $sql, $conn );
		if(! $retval ){
		  die('Could not enter data: ' . mysql_error());
		}
		
		$sql = "SELECT translation_id FROM translation_index WHERE poem_id = '$poemid' ORDER BY translation_id DESC";
		$retval = mysql_query( $sql, $conn );
		if(! $retval ){
		  die('Could not enter data: ' . mysql_error());
		}
		$row = mysql_fetch_array($retval, MYSQL_ASSOC);
		$transid = $row['translation_id'];

		$tbl_name = 'translated_lines';
	   	$sql = '';
	   	$sql = "INSERT INTO $tbl_name(poem_id, transation_id, lyric_index, lyric) VALUES ";
		$it = new ArrayIterator($translatedLyrics);

	    // a new caching iterator gives us access to hasNext()
	    $cit = new CachingIterator( $it );

	    // loop over the array
	    foreach ( $cit as $value )
	    {
	        // add to the query
	        $sql .= "(".$poemid.", ".$transid.", ".$cit->key()." , '".$cit->current()."')";
	        // if there is another array member, add a comma
	        if( $cit->hasNext() )
	        {
	            $sql .= ",";
	        }
	    }


		$retval = mysql_query( $sql, $conn );
		if(! $retval ){
		  die('Could not enter data: ' . mysql_error());
		}


	}


	echo "Entered data successfully\n";
	
	mysql_close($conn);
	$path = 'poemsubmit-success.html';
  }
}
 
//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

include_once($path);
?>