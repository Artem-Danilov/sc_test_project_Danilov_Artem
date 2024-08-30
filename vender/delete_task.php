<?php
require_once '../config/datebase.php'; 

session_start();

$taskId = isset($_POST['id']) ? intval($_POST['id']) : 0;
if ($taskId <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid task ID']);
    exit;
}

$query = "DELETE FROM tasks WHERE id = ?";
$stmt = mysqli_prepare($connect, $query);
mysqli_stmt_bind_param($stmt, 'i', $taskId);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete task']);
}

mysqli_stmt_close($stmt);
mysqli_close($connect);
?>
