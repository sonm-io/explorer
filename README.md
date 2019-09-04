SONM blockchain explorer
------------------------
SONM blockchain explorer is a explorer for Ethereum based chains, written basically for [SONM sidechain](https://blockchain-monitor.sonm.com/).
In other this must be used for any chain.

This explorer collects chain data through `web3` interface, extract and save to postgres in relation based model.

For viewing used web based application written by react and postgres service for access to database from frontend.

Features
--------
 * block viewer
 * transaction viewer
 * address viewer with related history
 * erc20 token transfer detection
 * related address's page, eg contract page
 * configurable following contracts
 * search by address, transaction or block number
 * relation base data model
 * fast filler with configurable concurrency

Prerequisites
-------------
You should have installed:
 * git
 * make
 * go (>1.12)
 * node (>8) and npm
 * postgres (>11)
 * for proper run you should have your own ethereum node with synced state.

Installation
------------

1. clone the repo:
```
git clone https://github.com/sonm-io/explorer
```

2. apply database scheme
```
// install migration tool
go get -v github.com/rubenv/sql-migrate/...
// set postgres credentials and database name
vi ./dbconfig.yml
// migrate
sql-migrate up
```

3. build and run filler service:
```
// compile filler binary
make -C backend build
// pass database and web3 endpoint to config
vi ./backend/etc/filler.yaml
// run the filler
./backend/target/filler --config=./backend/etc/filler.yaml
```

4. run `postgrest` service
download or compile postgrest binary following this [instruction](http://postgrest.org/en/v6.0/install.html)

```
./postgrest /path/to/postgrest.conf
```

5. build frontend:
```
vi ./frontend/src/config.ts
make -C frontend node_modules build
open ./frontend/build/index.html
```
