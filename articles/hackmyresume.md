#HackMyResume + JSON Resume

The open source initiative to create a JSON-based standard for resumes. For developers, by developers.

>Links:

>[jsonresume](https://jsonresume.org/)

>[HackMyResume](https://github.com/hacksalot/HackMyResume)

>[Resume Editor](http://registry.jsonresume.org/)


## Just getting started? 

Copy and Paste your info into the [Resume Editor](http://registry.jsonresume.org/) and click the download button!

## Have a resume.json? 

Blindly copy and paste these commands (trust me, I know stuff). 

```bash
> npm install hackmyresume -g
> npm install jsonresume-theme-elegant-leonth
> hackmyresume BUILD res.json TO ./resume.all -t node_modules/jsonresume-theme-elegant-leonth
```

## Now view your new resume and profit! 

```bash 
> open ./resume.html
```