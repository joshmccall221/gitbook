[ ! -d "$NVM_DIR/bash_completion" ] && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash;
. /home/$(whoami)/.nvm/nvm.sh;
nvm i --lts;
nvm use --lts; node --version;
node --version
