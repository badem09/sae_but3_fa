<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

$adr_ip = $_GET['adr_ip'];
$nb_paquets = $_GET['nb_paquets'];
$continu = isset($_GET['continu']) && $_GET['continu'] === 'True';
$accessed = False;
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
    $start_time = time(); // Record the start time

    while (true) {
        $line = fgets($pipes[1]); // Read a line from the process output
        if ($line !== false) {
            $accessed = True;
            if (strpos($line, "PING") === false) { // To exclude the first line of output
                if (strpos($line, "ping statistics") !== false ||
                    strpos($line, "packets transmitted") !== false ||
                    strpos($line, "rtt min/avg/max/mdev") !== false) {
                    echo "data: data_resume:$line\n\n"; // Send summary statistics to the client
                } else {
                    echo "data: data_table:$line\n\n"; // Send regular data to the client
                }
                ob_flush();
                flush();
            }
        }

        // Check for process termination
        $status = proc_get_status($process);
        if (!$status['running']) {
	    echo "data: sortie status";
            break;
        }

        // Check for client disconnect
        if (connection_aborted()) {
        	echo "data: stop connection";
            break;
        }
        // If the ping has been running for more than 10 seconds : Ip unreachable
        if (!$accessed && time() - $start_time > 10) {
            echo "data: data_unvalid_ip:L'adresse : $adr_ip à l'air d'être inaccessible. \n\n";
            ob_flush();
            flush();
            break;
        }
    }
    echo "data: stop 3";
    fclose($pipes[1]);
    fclose($pipes[2]);
    proc_close($process);
    ob_flush();
    flush();
}
?>

