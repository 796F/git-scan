git-scan
========

scan open source

# 1. install Tor

install tor and give it a first run

`brew install tor`

`tor`

# 2. symlink our config file

tor looks for the tor config file `torrc` in the `/usr/local/etc/tor` folder.  

link that location to the config in our github.  

`ln /path/to/project/git-scan/config/torrc /usr/local/etc/tor/torrc`

restart tor

# important notes

1.  Tor throttles how often you can swap IP addresses.  10000ms is the fastest we can change identities. anything less will *work* but you won't get a reliable IP change.

2.  I have not yet tested whether geo-IP effects the results from github's api.  
