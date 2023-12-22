<?php

use PHPUnit\Framework\TestCase;

class PingActionTest extends TestCase
{
    public function testAdresseValide()
    {
        ob_start();
        $adr_ip = '93.184.216.34';
        $nb_paquets = 2;
        $_GET['adr_ip'] = $adr_ip;
        $_GET['nb_paquets'] = $nb_paquets;

        include '/home/sae_but3_fa/test/ping_action_t.php';

        $nb_pings = count(array_filter($data_lines, function ($line) {
            return strpos($line, 'data_table') !== false;
        }));
        $this->assertTrue($nb_paquets >= $nb_pings);
        ob_end_clean();
    }

    public function testURLValide()
    {
        ob_start();
        $adr_ip = 'example.com';
        $nb_paquets = 2;
        $_GET['adr_ip'] = $adr_ip;
        $_GET['nb_paquets'] = $nb_paquets;

        include '/home/sae_but3_fa/test/ping_action_t.php';

        $nb_pings = count(array_filter($data_lines, function ($line) {
            return strpos($line, 'data_table') !== false;
        }));
        $this->assertTrue($nb_paquets >= $nb_pings);
        ob_end_clean();
    }

    public function testUrlNonValide()
    {
        ob_start();
        $adr_ip = 'example';
        $nb_paquets = 2;
        $_GET['adr_ip'] = $adr_ip;
        $_GET['nb_paquets'] = $nb_paquets;

        include '/home/sae_but3_fa/test/ping_action_t.php';

        $this->assertEquals(1, count($data_lines));
        $this->assertStringContainsString('data_error', $data_lines[0]);
        ob_end_clean();
    }
    
    public function testAdresseNonValide()
    {
        ob_start();
        $adr_ip = '1.2.3.4';
        $nb_paquets = 2;
        $_GET['adr_ip'] = $adr_ip;
        $_GET['nb_paquets'] = $nb_paquets;

        include '/home/sae_but3_fa/test/ping_action_t.php';

        $this->assertEquals(1, count($data_lines));
        $this->assertStringContainsString('data_unvalid_ip', $data_lines[0]);
        ob_end_clean();
    }

}

