---
title: 解決 WebGL 的 null function 錯誤
---

## 問題

跳出這個錯誤但看不懂 StackTrace。

```
RuntimeError: null function or function signature mismatch
```

## 解決方法

前往 `Player Setting -> Publisher Setting -> Debug Symbols`，設定成 `Embedded`。讓 Exception 變成人類可讀的內容，方便排查實際問題。

Debug Symbols 有 3 個選項：
- Off：就是沒有 Debug Symbols，所以你看到的 Stack Trace 都是人類看不懂的東西。
- External：建置時把 Debug Symbols 寫在外部檔案，需要符號資訊的時候得先經過額外的網路下載，所以會比較慢，但初始下載的檔案會比 Embeded 小。
- Embeded：建置時把 Debug Symbols 直接寫在內部，所以取得符號資訊會比較快，但缺點就是初始下載的檔案比較大。開發偵錯時比較適合使用。

如果你對 WebGL 的特殊性還不熟悉，那可以先檢查看看你是不是有用到 WebGL 不支援的多執行緒或相關類型，特別是與 `System.Threading` 命名空間相關的 `Task` 類別。

## References

- [Unity - Scripting API: WebGLDebugSymbolMode](https://docs.unity3d.com/ScriptReference/WebGLDebugSymbolMode.html)