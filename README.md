Docker
-----

You can build the image like this

    docker build --rm=true -t gitlist .

And run it like this

    docker run --rm=true -p 8888:80 -v /path/repo:/repos gitlist

The web interface will be available on host machine at port 8888 and will show
repositories inside /path/repo
