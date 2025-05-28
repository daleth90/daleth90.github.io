---
title: 使用 git hook 檢查約定式提交
tags:
  - git
---

[Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) 是一系列可以在特定時機點觸發的自定義腳本，我們可以用 commit-msg 這個 hook 來檢查使用者的提交是否符合[[git-conventional-commits|約定式提交]]的規範。如果以非零的數值退出，就視為失敗，Git 會放棄提交。

下面的腳本我忘記是從哪裡抄來的，可能要檢查一下內容。types 可以根據團隊需求調整。

```shell
#!/bin/sh

# set values from config file to variables
function set_config_values() {
  types=('feat' 'fix' 'refactor' 'chore' 'perf')
}

# build the regex pattern based on the config file
function build_regex() {
  set_config_values

  regexp="^[.0-9]+$|"

  regexp="${regexp}^([Rr]evert|[Mm]erge):? .*$|^("

  for type in "${types[@]}"
  do
    regexp="${regexp}$type|"
  done

  regexp="${regexp%|})(\(.+\))?: "
}

# get the first line of the commit message
INPUT_FILE=$1
commit_message=`head -n1 $INPUT_FILE`

# Print out a standard error message which explains
# how the commit message should be structured
function print_error() {
  regular_expression=$2
  echo -e "[Invalid Commit Message]"
  echo -e "------------------------"
  echo -e "Valid commit format: \"<type>[optional scope]: <description>\"\n"
  echo -e "Valid types: ${types[@]}"
  echo -e "Your commit message: \"$commit_message\""
}

build_regex

if [[ ! $commit_message =~ $regexp ]]; then
  # commit message is invalid according to config - block commit
  print_error
  exit 1
fi
```
