---
title: Git 出現無法捨棄變更的問題
---

## 症狀

現象是在 Git GUI 上 (Fork, SourceTree) 對特定檔案 discard 會沒有作用。

## 原因

如果使用 `git reset --hard`，就會看見關鍵的錯誤訊息。
```
Encountered 1 file(s) that should have been pointers, but weren't:
```

可能的原因：
- 使用者有使用 LFS，但是是後來才追加 LFS 規則，導致有些檔案後來才被加入 LFS，但在 Git 上又不是以 LFS 的格式存在，因此持續出錯。
- 有人修改了檔案大小寫，git 預設不區分大小寫，但 Windows 和 MacOS 都會區分大小寫，
	- 不要自作聰明把 git config 的 `core.ignoreCase` 改成 `true`，畢竟你可沒辦法保證其他人的 git config 有修改，我自己已經幹過這種蠢事了。

## 解決辦法

```bash
$ git add --renormalize .
$ git commit -m "Fix broken LFS files"
```

## References

- [Encountered 1 file(s) that should have been pointers, but weren't · Issue #1939 · git-lfs/git-lfs](https://github.com/git-lfs/git-lfs/issues/1939#issuecomment-692292514)
- [Git - gitfaq Documentation](https://git-scm.com/docs/gitfaq#Documentation/gitfaq.txt-WhydoIhaveafilethat8217salwaysmodified)
