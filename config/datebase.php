<?

$server = 'localhost';
$login = 'dartemaz_sc_test';
$pass = 'Temoha2003';
$nameDb = 'dartemaz_sc_test';

$connect = mysqli_connect($server, $login, $pass, $nameDb);
if ($connect == false) {
	echo("Error: Unable to connect to MySQL " . mysqli_connect_error());
} 
