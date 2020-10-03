FROM node:6.11
WORKDIR /usr/caterpillar

# expose ports
EXPOSE 3000
EXPOSE 3010
EXPOSE 3200
EXPOSE 8090

# download some tools needed later
RUN apt-get update && apt-get install -y \
    dos2unix \
    vim

# install global packages
RUN npm install -g \
    ethereumjs-testrpc \
    gulp-cli \
    httpserver \
    @angular/cli@1.0.0

# copy the package.jsons of the three projects and install dependencies
COPY caterpillar-core/package.json /usr/caterpillar/caterpillar-core/
WORKDIR /usr/caterpillar/caterpillar-core
RUN npm install
COPY execution-panel/package.json /usr/caterpillar/execution-panel/
WORKDIR /usr/caterpillar/execution-panel
RUN npm install
COPY services-manager/package.json /usr/caterpillar/services-manager/
WORKDIR /usr/caterpillar/services-manager
RUN npm install

# copy project contents
WORKDIR /usr/caterpillar
COPY caterpillar-core caterpillar-core
COPY execution-panel execution-panel
COPY services-manager services-manager

# build all projects
WORKDIR /usr/caterpillar/caterpillar-core
RUN gulp build
WORKDIR /usr/caterpillar/execution-panel
RUN ng build
WORKDIR /usr/caterpillar/services-manager
RUN gulp build

# run launch script
COPY scripts /usr/caterpillar/scripts
WORKDIR /usr/caterpillar/scripts
RUN find . -type f -print0 | xargs -0 dos2unix
CMD sh /usr/caterpillar/scripts/launch.sh