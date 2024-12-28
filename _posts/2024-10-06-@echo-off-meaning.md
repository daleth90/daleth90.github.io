---
layout: post
title: "@echo off 的意思"
tags:
  - batch
---

`echo [on|off]` 可用來開關命令回應 (command echoing) 功能。預設值為 `on`。

<!--more-->
[echo 文件](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/echo)

### echo on

命令回應功能開啟時 (預設為開啟)，每個命令之後都會跟隨一次回應。

```shell
echo on
echo This is Line 1
echo This is Line 2
echo This is Line 3
pause
```

```
D:\Projects\Test>echo on

D:\Projects\Test>echo This is Line 1
This is Line 1

D:\Projects\Test>echo This is Line 2
This is Line 2

D:\Projects\Test>echo This is Line 3
This is Line 3

D:\Projects\Test>pause
請按任意鍵繼續 . . .
```

### echo off

命令回應功能關閉後，每個命令之後就不會再有回應了。但是第一行的 `echo off` 仍會顯示回應。

```shell
echo off
echo This is Line 1
echo This is Line 2
echo This is Line 3
pause
```

```
D:\Projects\Test Batch>echo off
This is Line 1
This is Line 2
This is Line 3
請按任意鍵繼續 . . .
```

### @echo off

根據 echo 文件的內容，我們可以知道 (@) 是個通用的單行 echo off 功能。
因此要連帶第一行的 `echo off` 的回應一起消失，需要改寫為 `@echo off`。

> To prevent echoing a particular command in a batch file, insert an (@) sign in front of the command. To prevent echoing all commands in a batch file, include the **echo off** command at the beginning of the file.

```shell
@echo off
echo This is Line 1
echo This is Line 2
echo This is Line 3
pause
```

```
This is Line 1
This is Line 2
This is Line 3
請按任意鍵繼續 . . .
```
