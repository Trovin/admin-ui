FROM geekykaran/headless-chrome-node-docker:latest
ADD ./start-chrome.sh /opt/
CMD ["sh", "/opt/start-chrome.sh", "&"]

FROM 632123226415.dkr.ecr.us-west-2.amazonaws.com/bhn-nodeangular-base-image:latest
RUN mkdir -p /opt/tarball_name/
ADD ./tarball_name/ /opt/tarball_name/
ADD ./runDeploy.sh /opt/

EXPOSE 8443
ENTRYPOINT ["sh", "/opt/runDeploy.sh", "&"]