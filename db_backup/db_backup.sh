now=`date +"%m_%d_%Y"`
echo "dump_$now"
mongodump --db vb --out "/home/scripts/dump/dump_$now"
tar -cvzf "dump_$now.tar.gz" "/home/scripts/dump/dump_$now"
