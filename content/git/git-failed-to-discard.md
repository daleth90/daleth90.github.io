---
title: Git 出現無法捨棄變更的問題
created: 2023-10-19
modified: 2025-11-16
---

## 症狀

現象是在 Git GUI 上 (Fork, SourceTree) 對特定檔案 discard 會沒有作用。

如果使用 `git reset --hard`，就會看見關鍵的錯誤訊息。
```
Encountered 1 file(s) that should have been pointers, but weren't:
```

## 原因1

使用者是有使用 LFS，但是是後來才追加 LFS 規則，導致有些檔案後來才被加入 LFS，但在 Git 上又不是以 LFS 的格式存在，因此持續出錯。

### 解決辦法

```bash
$ git add --renormalize .
$ git commit -m "Fix broken LFS files"
```

## 原因2

有人修改了檔案大小寫，或系統上甚至有 2 份檔名只有大小寫不一樣的檔案。Git 預設不區分大小寫 (`core.ignoreCase=false`)，但 Windows 和 MacOS 都會區分大小寫，不要自作聰明想說讓環境規則一致然後把 `core.ignoreCase` 改成 `true`，畢竟你可沒辦法保證其他人的 git config 有修改，我自己已經幹過這種蠢事了。

### 解決辦法

```bash
$ git rm --cached AFile.txt
$ git commit -m 'Remove files conflicting in case'
$ git checkout .
```

> [!note]
> 這段的錯誤成因和解決辦法不是那麼確定。要再確認。

## References

- [Encountered 1 file(s) that should have been pointers, but weren't · Issue #1939 · git-lfs/git-lfs](https://github.com/git-lfs/git-lfs/issues/1939#issuecomment-692292514)
- [Git - gitfaq Documentation](https://git-scm.com/docs/gitfaq#Documentation/gitfaq.txt-WhydoIhaveafilethat8217salwaysmodified)
- [如何在 Windows 使用 Git 版控時可以區分檔案名稱大小寫 | The Will Will Web](https://blog.miniasp.com/post/2021/12/28/git-config-core-ignorecase-false-in-Windows)
