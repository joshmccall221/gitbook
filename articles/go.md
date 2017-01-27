# Go!

 #### =====>  Intro

Checklist: 

 [ ] [awesome-go](https://github.com/avelino/awesome-go)

 [ ] [A Tour of Go (Youtube)](https://www.youtube.com/watch?v=ytEkHepK08c&wl_token=0dimQXNqGLkKpjxQYpxBatIfMZZ8MTQ4NTU2NTk5NUAxNDg1NDc5NTk1&wl_id=Vlie-srOU8c)
   [ ] [A Tour of Go ](https://tour.golang.org/welcome/1)
 [ ] [Vim-go](https://www.youtube.com/watch?v=7BqJ8dzygtU)

 [ ] [Build Web Apps with Go Language (golang)](https://www.youtube.com/watch?v=Vlie-srOU8ca)



### Getting going with Go! 
#### Install : 

* [ubuntu: install go](https://www.digitalocean.com/community/tutorials/how-to-install-go-1-6-on-ubuntu-16-04)

#### hello world :


```
┌──(~) n(vagrant)──────────────────────────────────(✔)─
└──➤cat ~/work/src/github.com/joshmccall221/hello/hello.go        
package main

import "fmt"

func main() {
        fmt.Printf("hello, world\n")
}
┌──(~) n(vagrant)──────────────────────────────────(✔)─
└──➤ go install github.com/joshmccall221/hello  
┌──(~) n(vagrant)──────────────────────────────────(✔)─
└──➤ hello
hello, world
┌──(~) n(vagrant)──────────────────────────────────(✔)─
└──➤ which hello
/home/vagrant/work/bin/hello
```


#### hello world (unicode) :

```
┌──(~) n(vagrant)──────────────────────────────────(✔)─
└──➤ cat ~/work/src/github.com/joshmccall221/hello_jap/hello_jap.go 

package main

import "fmt"

func main() {
        fmt.Println("Hello, 世界")
        }

┌──(~) n(vagrant)──────────────────────────────────(✔)─
└──➤ go install github.com/joshmccall221/hello_jap
┌──(~) n(vagrant)──────────────────────────────────(✔)─
└──➤ hello_jap 
Hello, 世界世
```
