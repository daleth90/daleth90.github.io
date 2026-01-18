---
title: "@echo off 的意思"
created: 2024-10-06
modified: 2026-01-18
---

[echo 文件](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/echo)

`echo [on|off]` 可用來開關命令回應 (command echoing) 功能。預設值為 `on`。

## echo on

echo 功能預設為開啟。意思是每個命令的輸入都會顯示在終端機上。

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

## echo off

echo 功能關閉後，命令的輸入就不會再顯示了。但是以下範例第一行的 `echo off` 在執行的當下，因為還沒關掉，所以這一行仍會顯示。

```shell
echo off
echo This is Line 1
echo This is Line 2
echo This is Line 3
pause
```

```
D:\Projects\Test>echo off
This is Line 1
This is Line 2
This is Line 3
請按任意鍵繼續 . . .
```

## @echo off

根據文件，我們知道 `@` 是個專門只關閉單行 echo 的特殊字元。
所以如果要連帶第一行的 `echo off` 的回應一起消失，要在前面加上 `@`，改寫成 `@echo off`。

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
