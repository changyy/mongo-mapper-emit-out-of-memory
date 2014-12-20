Environment:
===============================

AWS EC2 m3.medium:
```
$ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 14.04.1 LTS
Release:        14.04
Codename:       trusty

$ free -m
             total       used       free     shared    buffers     cached
Mem:          3951        665       3286          9          4         42
-/+ buffers/cache:        618       3333
Swap:            0          0          0
```

Mongod Version:
```
$ mongo
MongoDB shell version: 2.6.6
connecting to: test
> db.version()
2.6.6
> quit()
```

Test:
```
$ npm install
$ time NODE_PATH=node_modules node index.js 
[Error: connection closed]



[DONE] RESET DATABASE
[DONE] generate test data
[DONE] jsMode is true
[DONE] jsMode is false

real    3m9.926s
user    0m0.444s
sys     0m0.042s

$ tail -f /var/log/mongodb/mongod.log 
2014-12-20T16:19:30.243+0000 [initandlisten] connection accepted from 127.0.0.1:59825 #148 (3 connections now open)
2014-12-20T16:19:30.244+0000 [initandlisten] connection accepted from 127.0.0.1:59826 #149 (4 connections now open)
2014-12-20T16:19:30.245+0000 [initandlisten] connection accepted from 127.0.0.1:59827 #150 (5 connections now open)
2014-12-20T16:19:30.245+0000 [initandlisten] connection accepted from 127.0.0.1:59828 #151 (6 connections now open)
2014-12-20T16:19:30.247+0000 [conn148] CMD: drop test.tmp.mr.rec_9
2014-12-20T16:19:30.254+0000 [conn148] build index on: test.tmp.mr.rec_9_inc properties: { v: 1, key: { 0: 1 }, name: "_temp_0", ns: "test.tmp.mr.rec_9_inc" }
2014-12-20T16:19:30.254+0000 [conn148]   added index to empty collection
2014-12-20T16:19:30.262+0000 [conn148] build index on: test.tmp.mr.rec_9 properties: { v: 1, key: { _id: 1 }, name: "_id_", ns: "test.tmp.mr.rec_9" }
2014-12-20T16:19:30.263+0000 [conn148]   added index to empty collection
2014-12-20T16:19:50.385+0000 [conn148] Assertion: 10000:out of memory BufBuilder
```
