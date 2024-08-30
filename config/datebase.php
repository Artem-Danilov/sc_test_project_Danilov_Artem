<?

$server = 'localhost';
$login = 'root';
$pass = '';
$nameDb = 'sc_test_bd';

$connect = mysqli_connect($server, $login, $pass, $nameDb);
if ($connect == false) {
	echo("Error: Unable to connect to MySQL " . mysqli_connect_error());
} 