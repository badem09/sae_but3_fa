<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

$adr_ip = $_GET['adr_ip'];
$nb_paquets = $_GET['nb_paquets'];
$continu = isset($_GET['continu']) && $_GET['continu'] === 'True';

$command = "ping -c $nb_paquets $adr_ip";
if ($continu) {
    $command = "ping $adr_ip";
}

$descriptorspec = array(
    0 => array("pipe", "r"), // stdin
    1 => array("pipe", "w"), // stdout
    2 => array("pipe", "w")  // stderr
);

$process = proc_open($command, $descriptorspec, $pipes);

if (is_resource($process)) {
    stream_set_blocking($pipes[1], 0); // Set non-blocking mode for stdout
    stream_set_blocking($pipes[2], 0); // Set non-blocking mode for stderr

    while (true) {
        $line = fgets($pipes[1]); // Read a line from the process output

        if ($line !== false) {
            // Check for the presence of "PING" to exclude the first line
            if (strpos($line, "PING") === false) {
                echo "data: $line\n\n";
                ob_flush();
                flush();
            }
        }

        // Check for process termination
        $status = proc_get_status($process);
        if (!$status['running']) {
            break;
        }

//        usleep(1000); // Sleep for 1ms (adjust as needed)

        // Check for client disconnect
        if (connection_aborted()) {
            break;
        }
    }

    fclose($pipes[1]);
    fclose($pipes[2]);
    proc_close($process);
    ob_flush();
    flush();
}
?>

