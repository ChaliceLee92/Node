#!/bin/sh
cd /Users/liyanhuan/Desktop/Node/node-blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log