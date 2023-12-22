<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

if (isset($_GET['adr_ip'])) {
$adr_ip = $_GET['adr_ip'];
if (isset($_GET['nb_paquets'])){
$nb_paquets = $_GET['nb_paquets'];
$command = "ping -c $nb_paquets $adr_ip";

}

$continu = isset($_GET['continu']) && $_GET['continu'] === 'True';
$accessed = false;

if ($continu) {
    $command = "ping $adr_ip";
}

runCommand($command);
}
/**
 * Retourne la ligne d'output selon si c'est un resume ou un ligne de ping
 * @param {string} $ligne_stdout : ligne d'output
 */
function handleOutput($line_stdout){
    if (strpos($line_stdout, 'PING') === false &&  trim($line_stdout) !== ''){
        if (strpos($line_stdout, "ping statistics") !== false ||
            strpos($line_stdout, "packets transmitted") !== false ||
            strpos($line_stdout, "rtt min/avg/max/mdev") !== false) {
            echo "data: data_resume:$line_stdout\n\n"; // Envoie les lignes de resume (fin de commande) au client PLUS UTILISE
        } else {
            echo "data: data_table:$line_stdout\n\n"; // Envoie ligne de ping au client
        }
    }
    flush();
    ob_flush();
}

/*
 * Lance la commande ping (process) recupere son output et l'envoie au client selon son type (voir handleOutput)
 * @param {string} $command : commande a lancer  
 */
function runCommand($command){
    $descriptorspec = array(
        0 => array("pipe", "r"), // stdin
        1 => array("pipe", "w"), // stdout
        2 => array("pipe", "w")  // stderr
    );

    $process = proc_open($command, $descriptorspec, $pipes);

    // Pour eviter les restriction de temps et de repetitions (sur le nombre de ping)
    set_time_limit(0);
    ob_end_flush();

    if (is_resource($process)) {
        stream_set_blocking($pipes[1], 0); // Set non-blocking mode for stdout
        stream_set_blocking($pipes[2], 0); // Set non-blocking mode for stderr
        $start_time = time(); 
        $stderr_content = ''; 

        while (true) {

            $line_stdout = fgets($pipes[1]);
            $line_stderr = fgets($pipes[2]);

            if ($line_stdout !== false) {
                $accessed = true;
                handleOutput($line_stdout);
            }

            if ($line_stderr !== false) {
                $stderr_content .= $line_stderr;
            }

            // Si le process est termine
            $status = proc_get_status($process);
            if (!$status['running']) {
                break;
            }

            // Si le client se deconnecte
            if (connection_aborted()) {
                break;
            }

            // Si le ping n'a retourne aucune ligne et qu'il a ete lance il y a plus de 10 sec
            if (!$accessed && time() - $start_time > 10) {
                echo "data: data_unvalid_ip:L'adresse : $adr_ip à l'air d'être inaccessible. \n\n";
                ob_flush();
                flush();
                break;
            }
        }

        // Envoie au client le contenu de stderr en 1 seul message (peut etre sur plusieurs lignes)
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
}

?>
