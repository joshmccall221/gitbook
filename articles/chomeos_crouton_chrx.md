#ChomeosCroutonChrx

##Chomeos Crouton Chrx
Chromebooks / ChromeOS is the bomb! My daily driver and what I do all my development on currently!

##Chomeos
Here is a couple of tips/tricks to get you going:

### Powerwash
Screw something up? Need a fresh start?

> From login screen:
> Ctrl + Shift + R

*note*: may have to do this twice because of reasons....

### Development Mode
> From login screen:
> esc + [refesh(F3 on my model)] + Power

When machine reboots, press space to toggle development mode!

## Crouton
If you like chromeOS but want to do "Dev-y" things but don't want to deal with drivers:
> [crouton: wiki](https://github.com/dnschneid/crouton/wiki)
> [crouton: wiki: Auto-Installer-via-Bash-(Perfect-Ubuntu-for-Installation-for-Programmers!!!)](https://github.com/dnschneid/crouton/wiki/Auto-Installer-via-Bash-(Perfect-Ubuntu-for-Installation-for-Programmers!!!))

### Pro Tip
To get to shell:
> Ctrl + Alt + T
> crosh: shell <Enter>

#### Starting Crouton
crouton will create some start scripts for you:
```
chronos@localhost / $ start
startcode            starti3              startxfce4
startcli             startgnome           startidea            startxiwi
```
They are found here:
```
chronos@localhost / $ which startcode
/usr/local/bin/startcode
```
I made the startcode and it looks like:
```
chronos@localhost / $ cat $(which startcode)
sudo startxiwi -T code
```
Running `startcode`:
```
chronos@localhost / $ startcode
```

Gives you:
![startcode](/images/startcode.png)

This forwards your xsession using crouton integration extension to display your GUI IDE in a tab. Toggle fullscreen to hide the url or launch in window mode:

```
chronos@localhost / $ cat $(which startcode)
sudo startxiwi code
```
Personally I love the tabbed workflow of having three tabs: docs/jira ticket, ide, localhost.

## Chrx
Want more of a linux feel while still being able to use ChromeOS without a reboot:
> [chrx](https://chrx.org/)

My setup:
![chrxSetup](/images/chrx.png)
