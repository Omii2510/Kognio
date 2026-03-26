netsh advfirewall firewall add rule name="Node 3000" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Node 5000" dir=in action=allow protocol=TCP localport=5000
echo Firewall rules added successfully!
pause
