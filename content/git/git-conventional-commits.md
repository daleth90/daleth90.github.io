---
title: Git 約定式提交
tags:
  - git
---

[約定式提交 (Conventional Commits)](https://www.conventionalcommits.org) 是一種提交訊息格式的規範，提交格式是：
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

例如：
```
feat(i18n): Bahasa Indonesia translations (#1981)
```

```
fix(explorer): Prevent html from being scrollable when mobile explorer is open (#1895)

* Fixed html page being scrollable when mobile explorer is open
* Prettier code
* Addressed comment
```

約定式提交有以下好處：
1. 在閱覽大量提交時，可以從 type 和 scope 快速知道該提交的內容方向
2. 可以利用工具自動化產生 changelog
3. 可以驅動開發者分割成數個小提交，方便利用 rebase 調整整份 PR

如果有設定 git hook，就可以在提交時[[git-conventional-commits-validate-with-hook|自動進行格式檢查]]。

