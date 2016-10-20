<?php

try {
    if (mt_rand(0, 1)) {
        throw new \Exception('Sorting saving error', 422);
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    header('HTTP/1.1 422 Bad Request', true, 422);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
