#!/bin/bash
# Usage: Edit then run update.sh. Changes JavaScript to  rewrite hostnames.
# Edit these values to match your environment
REPO_PATH=/home/ozten/Projects/repo_the_web
HOSTNAME=dev.repotheweb.org:8001

# Do not edit below this line
cd $REPO_PATH
git checkout www/repotheweb.org/include.js
git pull
FILES='www/repotheweb.org/include.js www/rhapsody.com/index.html www/music-blog.com/index.html'
for file in $FILES; do
    sed -e"s/repotheweb\.org/${HOSTNAME}/g" $file > ${file}.tmp
    mv ${file}.tmp $file
done