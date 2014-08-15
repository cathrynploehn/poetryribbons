<?php 
	// Connects to Our Database 
	$conn = mysql_connect("localhost", "cathryn_pr", "8yreqF{5eePh") or die("Can't connect"); 
	 
	if(! $conn )
	{
		die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("poetryribbons") or die(mysql_error()); 
?>