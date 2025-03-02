#!/bin/bash

# Update package lists
sudo apt update -y

# Install required packages
sudo apt install -y apache2 unzip

# Stop Apache service before deploying new files
sudo systemctl stop apache2


# Remove existing deployment files to avoid conflicts
sudo rm -rf /var/www/html/src/pages

