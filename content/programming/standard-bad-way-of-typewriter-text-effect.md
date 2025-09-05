---
title: 文字打字效果的標準錯誤方法
created: 2025-09-05
modified: 2025-09-05
---

## 標準錯誤作法

最常見的錯誤作法，當然就是把字元一個一個加進字串。

```csharp
private IEnumerator ShowMessageProcess_Bad(string message, float delay)
{
    var text = string.Empty;
    for (var i = 0; i < message.Length; i++)
    {
        text += message[i];
        _textBox.text = text;
        yield return new WaitForSeconds(delay);
    }
}
```

![Typewriter Effect (BAD)](./typewriter_bad.gif)

這個看起來很容易的做法會出現以下問題：
- 如果你的文字是水平置中，文字就會跑來跑去的。
- 像西方語言者這種多字元單字，可能就會在單字打完後，觸發該單字換行，一樣文字就會跑來跑去的。
- 很難處理 Rich Text 的標籤，也浪費效能和引發 GC 問題。（要硬算新字串當然是算得出來啦，畢竟我有算過……）
- 你的字串有 100 個字元，就會出現 99 個不必要的字串，引發 GC 問題。

> [!note]
> 以前也有個很投機的作法是用 `<color=#00000000></color>` 把還沒顯示的字串用透明藏起來。但除了 GC 問題之外，碰到其它的 `<color>` 標籤就會失效。

## 正確做法

方法很簡單，用 `TMP_Text` 的 `maxVisibleCharacters` 屬性就好了。

> [!note]
> 話說以前沒有 TextMeshPro 的時候我還要自己算 Mesh 尺寸，真是太白癡了！

```csharp
private IEnumerator ShowMessageProcess_Good(string message, float delay)
{
    _textBox.text = message;
    for (var i = 0; i < message.Length; i++)
    {
        _textBox.maxVisibleCharacters = i + 1;
        yield return new WaitForSeconds(delay);
    }

    // Reset to default
    // Don't ask me why the default value is 99999, ask Unity.
    _textBox.maxVisibleCharacters = 99999;
}
```

![Typewriter Effect (GOOD)](./typewriter_good.gif)
