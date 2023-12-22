<?php

$adr_ip = $_GET['adr_ip'];
if (isset($_GET['nb_paquets'])){
$nb_paquets = $_GET['nb_paquets'];
$command = "ping -c $nb_paquets $adr_ip";

}
$continu = isset($_GET['continu']) && $_GET['continu'] === 'True';

$accessed = false;
$data_lines = []; // Initialize as an empty array

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
	//echo $start_time;
        $line_stdout = fgets($pipes[1]);
        $line_stderr = fgets($pipes[2]);

        if ($line_stdout !== false) {
            if (strpos($line_stdout, 'PING') === false && trim($line_stdout) !== '') {
            $accessed = true;
                if (strpos($line_stdout, "ping statistics") !== false ||
                    strpos($line_stdout, "packets transmitted") !== false ||
                    strpos($line_stdout, "rtt min/avg/max/mdev") !== false) {
                    $data_lines[] = "data: data_resume:$line_stdout\n\n"; // Append to the array
                } else {
                    $data_lines[] = "data: data_table:$line_stdout\n\n"; // Append to the array
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

        // If the ping has been running for more than 10 seconds without response
        if (!$accessed && time() - $start_time > 10) {
            $data_lines[] = "data: data_unvalid_ip:L'adresse : $adr_ip à l'air d'être inaccessible. \n\n";
            ob_flush();
            flush();
            break;
        }
    }

    // Send stderr content as a single message
    if (!empty($stderr_content)) {
        $data_lines[] = "data: data_error:" . $stderr_content . "\n\n";
        ob_flush();
        flush();
    }

    fclose($pipes[1]);
    fclose($pipes[2]);
    proc_close($process);
    ob_flush();
    flush();
}

// At the end of the script, $data_lines should be an array with multiple elements
?>

