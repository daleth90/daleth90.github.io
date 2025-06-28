---
title: Git 最佳原則
---

以下的原則都是為了達成 [[git-core-purposes|Git 的核心目標]]。  
不論在哪個團隊、哪個工作流，都能自己掌控的基本原則。

## 提交原則

1. commit 應該是最小且完整的單位
2. commit 訊息都要能清楚表達其修改內容
3. 要經常 commit

提交原則應該是最基本的，不論在哪個團隊、哪個工作流，至少提交是自己能掌控的事情。

## 分支原則

1. 使用 feature branch 工作
2. 分支名稱也要能表達其內容
3. 用 commit 紀錄表達開發步驟
4. 使用 interactive rebase 調整歷史紀錄
5. 經常與開發主支線整合
6. 整合開發主支線時使用 pull with rebase 而不是 pull with merge

## 合併原則

1. 讓分支維持小規模
2. 合併時使用 rebase and merge 方法

## References

- [Introduction to GitLab Flow](https://gitlab.com/gitlab-org/gitlab-foss/-/blob/0fdb03ee16f0ccd7f122a4f0af23ee628d1de3c9/doc/workflow/gitlab_flow.md)
- [What are GitLab Flow best practices?](https://about.gitlab.com/topics/version-control/what-are-gitlab-flow-best-practices/)