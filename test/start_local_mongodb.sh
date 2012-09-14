if [ -f /usr/local/etc/mongod.conf ]; then
  mongod run --config /usr/local/etc/mongod.conf --rest
else
  conf=$(find /usr/local/Cellar/mongodb/ -name mongod.conf)
  if [ ! -z $conf ]; then
    mongod run --config $conf --rest
  fi
fi
