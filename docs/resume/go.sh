rm -rf ../node_modules
. ~/.nvm/nvm.sh
nvm i 8
npm install hackmyresume http-server -g;
npm install jsonresume-theme-elegant-leonth
hackmyresume BUILD resume.json TO ./resume.all -t ../node_modules/jsonresume-theme-elegant-leonth
rm ./index.html
mv ./resume.html ./index.html
http-server

