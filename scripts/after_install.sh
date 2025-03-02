#!/bin/bash

# Extract the frontend files into the correct directory
sudo unzip -o /var/www/html/src/pages/frontend.zip -d /var/www/html/src/pages/

# Set correct ownership and permissions
sudo chown -R ubuntu:ubuntu /var/www/html/src/pages
sudo chmod -R 755 /var/www/html/src/pages

# Restart Apache to apply changes
sudo systemctl restart apache2
