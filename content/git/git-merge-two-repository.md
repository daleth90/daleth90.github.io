---
title: Git 合併兩個儲存庫
created: 2025-11-13
modified: 2025-11-13
---

因為自己有一個模板專案和一個通用套件專案，每次修改通用套件，都得輸出後再讓模板專案更新，後來覺得這兩個步驟感覺蠻冗的，畢竟只是自己的小專案。

因為套件專案本身就是一個 Unity 專案，所以也不適合 submodule，而且我也不想開兩次 Unity。所以看來該是把這兩個儲存庫合併起來了。

1. 先從兩個儲存庫中，選一個當作你的基底儲存庫，之後會把另外一個儲存庫合併進來，變成最終儲存庫。
2. 複製基底儲存庫到本地。
3. 在基底儲存庫新增一個新的 remote，連結到另外一個儲存庫。
4. 以防萬一，要 fetch 另外一個儲存庫的提交資訊。
5. 進行合併，使用 `--allow-unrelated-histories` 選項。這個步驟應該得用 console 才能做。  
   `git merge --allow-unrelated-histories <remote-name>/<remote-branch>`
6. 謹慎解決衝突。
7. 完成！可以把另外一個儲存庫的 remote 刪除了。

## References

- [Merge git repositories | Bitbucket Cloud | Atlassian Support](https://support.atlassian.com/bitbucket-cloud/kb/merge-git-repositories/)