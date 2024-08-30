<?php
require_once '../config/datebase.php';

session_start();

$query = "SELECT id_status, COUNT(*) AS count FROM tasks GROUP BY id_status";

$result = mysqli_query($connect, $query);

$count_open = 0;
$count_in_progress = 0;
$count_closed = 0;

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        switch ($row['id_status']) {
            case 1:
                $count_open = $row['count'];
                break;
            case 2:
                $count_in_progress = $row['count'];
                break;
            case 3:
                $count_closed = $row['count'];
                break;
        }
    }
}

mysqli_close($connect);

echo json_encode(array(
    'count_open' => $count_open,
    'count_in_progress' => $count_in_progress,
    'count_closed' => $count_closed
));
?>

