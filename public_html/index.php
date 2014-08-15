<?php 
include 'datalogin.php';

$path = 'start.html';
$err_msg = ' ';

$poem_name = '';

if(!empty($_POST['poem'])) {
	if(trim($_POST['poem']) === '')	{
		$err_msg = 'Something went wrong. Please try again.';
		console.log($err_msg);
	} else {
		$path = 'main.html';
		$poem_name = $_POST["poem"];
		 
	}
}
if(!empty($_POST['poem-user'])){
	$poemkey = $_POST['poem-user'];
	$poem_name = trim($poemkey);
	$filename_json = 'json/'.trim($poemkey).'.json';

	$file_content = "{ ";

	$sql = "SELECT poem_id, filename, poem_author, poem_title, filename FROM poem_index WHERE poem_key = '$poemkey'";
    $retval = mysql_query( $sql, $conn );
    if(! $retval )
    {
      die('Could not get data: ' . mysql_error());
    }

    $row = mysql_fetch_array($retval, MYSQL_ASSOC);
    
    $poem_id = $row['poem_id'];
    $filename = $row['filename'];
    $author_name = $row['poem_author'];
	$poem_title = $row['poem_title'];
	$poem_filename = $row['filename'];

	$file_content .= '"title": "'.$poem_title.'",';
	$file_content .= '"author": "'.$author_name.'",';
	$file_content .= '"filename-original": "'.$filename.'",';

	$poem_originalLyrics =  array();
	$poem_translatedLyrics = array();
	$poem_triggers = array();

	$sql = "SELECT *
            FROM  original_lines
            WHERE poem_id = '$poem_id'
            ORDER BY lyric_index ASC";

    $retval = mysql_query( $sql, $conn );
    if(! $retval )
    {
      die('Could not get data: ' . mysql_error());
    }
    
    while($row = mysql_fetch_array($retval, MYSQL_ASSOC))
    {
       array_push($poem_originalLyrics, $row['lyric']);
       array_push($poem_triggers, $row['lyric_trigger']);
    } 

    $file_content .= '"originalLyrics": ';
    $file_content .= json_encode($poem_originalLyrics);
    $file_content .= ',';
    $file_content .= '"triggers": [';
	$file_content .= implode(",",$poem_triggers);
    $file_content .= ']';

    $sql = "SELECT *
            FROM  translated_lines
            WHERE poem_id = '$poem_id'
            ORDER BY lyric_index ASC";

    $retval = mysql_query( $sql, $conn );
    if(! $retval )
    {
      die('Could not get data: ' . mysql_error());
    }
    while($row = mysql_fetch_array($retval, MYSQL_ASSOC))
    {
       array_push($poem_translatedLyrics, $row['lyric']);
    }     
    $file_content .= ', "translatedLyrics":';
	$file_content .= json_encode($poem_translatedLyrics);
    $file_content .= '}';
    $path = 'main.html';

    $fp = fopen($filename_json, 'w');
    fwrite($fp, $file_content);
    fclose($fp);
}

include_once($path);
mysql_close($conn);
?>
