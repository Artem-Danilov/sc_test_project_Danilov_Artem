<?php
require_once '../config/datebase.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['task'])) {
    $taskText = trim($_POST['task']);

    if (!empty($taskText)) {

        $query = "INSERT INTO tasks (task, id_status) VALUES (?, ?)";
        
        if ($stmt = mysqli_prepare($connect, $query)) {
            $id_status = 1;
            
            mysqli_stmt_bind_param($stmt, 'si', $taskText, $id_status);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
        }
    }
}
mysqli_close($connect);

header('Location: ../index.html');
exit;

