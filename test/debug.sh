cf ssh kupit-o2p-srv -c 'kill -usr1 $(pgrep node)' &&  
cf ssh -N -T -L 9229:127.0.0.1:9229 kupit-o2p-srv 