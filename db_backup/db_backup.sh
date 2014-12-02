now=`date +"%m_%d_%Y"`
name="dump_$now"
mongodump --db vb --out "/home/scripts/dump/$name"
tar -cvzf "dump_$now.tar.gz" "/home/scripts/dump/$name"
