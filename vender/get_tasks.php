<?php
require_once '../config/datebase.php'; 

session_start();

$query_tasks = "SELECT t.id, t.task, s.name AS status_name FROM tasks t JOIN status s ON t.id_status = s.id_status ORDER BY t.id_status ASC";
$result_tasks = mysqli_query($connect, $query_tasks);

if (!$result_tasks) {
    die("Ошибка выполнения запроса: " . mysqli_error($connect));
}

$tasks = array();
while ($row = mysqli_fetch_assoc($result_tasks)) {
    $tasks[] = $row;
}

mysqli_close($connect);

header('Content-Type: application/json');
echo json_encode($tasks);
?>
