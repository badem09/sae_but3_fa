<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

$adr_ip = $_GET['adr_ip'];
$nb_paquets = $_GET['nb_paquets'];
$continu = isset($_GET['continu']) && $_GET['continu'] === 'True';
$accessed = false;
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

// To avoid time and repetition restrictions (sur le nombre de ping)
set_time_limit(0);
ob_end_flush();

if (is_resource($process)) {
    stream_set_blocking($pipes[1], 0); // Set non-blocking mode for stdout
    stream_set_blocking($pipes[2], 0); // Set non-blocking mode for stderr
    $start_time = time(); // Record the start time
    $stderr_content = ''; // Variable to store stderr content

    while (true) {

        $line_stdout = fgets($pipes[1]);
        $line_stderr = fgets($pipes[2]);

        if ($line_stdout !== false) {
            $accessed = true;
            if (strpos($line_stdout, 'PING') === false){
                if (strpos($line_stdout, "ping statistics") !== false ||
                    strpos($line_stdout, "packets transmitted") !== false ||
                    strpos($line_stdout, "rtt min/avg/max/mdev") !== false) {
                    echo "data: data_resume:$line_stdout\n\n"; // Send summary statistics to the client
                } else {
                    echo "data: data_table:$line_stdout\n\n"; // Send regular data to the client
                }
                flush();
                ob_flush();
            }
        }

        if ($line_stderr !== false) {
            $stderr_content .= $line_stderr;
        }

        // Check for process termination
        $status = proc_get_status($process);
        if (!$status['running']) {
            break;
        }

        // Check for client disconnect
        if (connection_aborted()) {
            break;
        }

        // If the ping has been running for more than 10 seconds
        if (!$accessed && time() - $start_time > 10) {
            echo "data: data_unvalid_ip:L'adresse : $adr_ip à l'air d'être inaccessible. \n\n";
            ob_flush();
            flush();
            break;
        }
    }

    // Send stderr content as a single message
    if (!empty($stderr_content)) {
        echo "data: data_error:" . $stderr_content . "\n\n";
        ob_flush();
        flush();
    }

    fclose($pipes[1]);
    fclose($pipes[2]);
    proc_close($process);
    ob_flush();
    flush();
}
?>
