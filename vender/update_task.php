<?php
require_once '../config/datebase.php';

session_start();

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$task = isset($_POST['task']) ? trim($_POST['task']) : '';

if ($id > 0 && !empty($task)) {
    $query = "UPDATE tasks SET task = ? WHERE id = ?";
    $stmt = mysqli_prepare($connect, $query);
    mysqli_stmt_bind_param($stmt, 'si', $task, $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Не удалось обновить задачу']);
    }
    mysqli_stmt_close($stmt);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Недостаточно данных для обновления задачи']);
}

mysqli_close($connect);
?>
