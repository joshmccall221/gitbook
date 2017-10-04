#TtsAudiobook 

##Tts Audiobook
## Links
[A practical intelligence amplification hack that really works](https://www.turnkeylinux.org/blog/practical-intelligence-amplification)

##Scenario
Listening to drm ebooks with tts on my phone.

##Install Kindle and Calibre
>kindle v1.20

>calibre v3.7


```
brew cask install kindle calibre
```

##Download the DeDRM tools 
```
wget https://github.com/apprenticeharper/DeDRM_tools/releases/download/v6.5.4/DeDRM_tools_6.5.4.zip
```

##Install DeDRM plugin
- calibre -> Preferences -> Change calibre behavior (CMD-P)
- Plugins -> Load plugin from file -> DeDRM_tools/DeDRM_calibre_plugin/DeDRM_plugin.zip

##KFX support
>see: https://www.mobileread.com/forums/showthread.php?s=5aefa0f17123555263f8d05351b51f1d&t=283371
Amazon's new format throws a wrench into things. Before you download your books in the kindle app, run this:

```
chmod -x /Applications/Kindle.app/Contents/MacOS/renderer-test
```
##Download the books in the kindle app
- Kindle -> Preferences... (cmd-,) -> Content Folder
  - Set this to somewhere easy to get to
- right click book in library -> download 

##Convert in Calibre
- Calibre -> Add books (A) 
  - Find kindle book we just downloaded
- Select book -> Convert -> Ok

Now in the preview you should have to formats: azw, mobi

##Moon+ Reader
- Download Android Transfer: [https://www.android.com/filetransfer/](https://www.android.com/filetransfer/)
- Download Moon+ Reader: [https://play.google.com/store/apps/details?id=com.flyersoft.moonreader](https://play.google.com/store/apps/details?id=com.flyersoft.moonreader)

