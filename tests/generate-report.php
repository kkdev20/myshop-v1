<?php

$output = shell_exec('php vendor/bin/phpunit --testsuite Feature --testdox 2>&1');
$timestamp = date('Y-m-d H:i:s');

$html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <title>MyShop - Test Report</title>
</head>
<body>
    <h1>MyShop Test Report</h1>
    <p>Generated on: $timestamp</p>
    <pre>$output</pre>
</body>
</html>
HTML;

file_put_contents('tests/test-report.html', $html);
echo "HTML report generated: tests/test-report.html\n";