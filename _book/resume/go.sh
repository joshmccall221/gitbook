sudo npm install hackmyresume -g;
npm install jsonresume-theme-elegant-leonth;
hackmyresume BUILD res.json TO ./resume.all -t ../node_modules/jsonresume-theme-elegant-leonth;
cp ./resume.html ./index.html;
open ./index.html
