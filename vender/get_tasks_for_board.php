<?php
require_once '../config/datebase.php'; 

$query_tasks = "SELECT t.id, t.task, s.name AS status_name, t.id_status FROM tasks t JOIN status s ON t.id_status = s.id_status 
ORDER BY t.id_status ASC";
$result_tasks = mysqli_query($connect, $query_tasks);

if (!$result_tasks) {
    die("Ошибка выполнения запроса: " . mysqli_error($connect));
}

$tasks = [
    'open' => [],
    'in_progress' => [],
    'closed' => []
];

while ($row = mysqli_fetch_assoc($result_tasks)) {
    switch ($row['id_status']) {
        case 1:
            $tasks['open'][] = [
                'id' => $row['id'],
                'task' => $row['task'],
                'status_name' => $row['status_name']
            ];
            break;
        case 2:
            $tasks['in_progress'][] = [
                'id' => $row['id'],
                'task' => $row['task'],
                'status_name' => $row['status_name']
            ];
            break;
        case 3:
            $tasks['closed'][] = [
                'id' => $row['id'],
                'task' => $row['task'],
                'status_name' => $row['status_name']
            ];
            break;
    }
}

mysqli_close($connect);

header('Content-Type: application/json');
echo json_encode($tasks);
?>
