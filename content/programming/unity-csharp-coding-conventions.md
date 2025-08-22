---
title: Unity C# 程式碼慣例
created: 2023-08-23
modified: 2025-08-07
---

## 編碼慣例

基本上參考 Unity 建議與 Microsoft 官方慣例，不足或定義不清楚的部分可參考 Google 的慣例。

- [.NET 檔 C# 編碼慣例 | Microsoft Learn](https://learn.microsoft.com/zh-tw/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- [Clean up your code: How to create your own C# code style | Unity Blog](https://blog.unity.com/engine-platform/clean-up-your-code-how-to-create-your-own-c-code-style)
- [C# at Google Style Guide | styleguide](https://google.github.io/styleguide/csharp-style.html)

## 程式碼樣式

強烈建議使用 [.editorconfig](https://editorconfig.org/) 設置規則，以下為大致內容。

1. 縮排使用 4 格空白字元，而不是 Tab。
2. 明文規定 UTF-8 編碼，否則中文字元在 Git 上會是亂碼
3. 一般 private 成員變數以底線(\_)與小寫字母開頭；區域變數使用 Camel Case。
	- 但 private 的 const 與 static readonly 比照常數規則。
4. 常數變數 (const 與 static readonly) 使用 Pascal Case。
5. 事件 (event) 使用 Pascal Case。
6. public 成員變數：
	- 若在一般帶有邏輯的類型，使用 Pascal Case
	- 若在純資料類型 (e.g. JSON, DTO)，可使用 Camel Case。
7. 明確宣告 `public`, `internal`, `private` 修飾詞，不要隱藏。
8. `using` 宣告時，`System` 最優先，再來以字母順序排序。
9. 大括號：
	- 基本上使用 BSD 風格，大括號起始換行。
	- 一律要有大括號 (e.g. if 檢查後 return 的情況)
	- property 若有需求可使用單行寫法。
10. `var` 關鍵字：在單行內可明確知道變數類型時使用 `var`，類型資訊不在此行的時候就不適用。
	- `var position = new Vector2(3f, 5f);`
	- `for (var i = 0; i < 10; i++)`
	- `var text = "Hello World!";`
	- `var request = Factory.Create<HttpRequest>();`
11. 使用簡寫宣告式，只因為 VS 一直跳這種建議。
	- `private readonly List<int> _cache = new(4);`
12. 實作套件時經常需要使用 internal 封裝類型。在這種狀況下，其成員公開方法仍建議繼續使用 `public`，若發生設計變更把類型切換回 `public` 時比較方便修改。

## 其它

1. 迴圈：盡可能使用 `for`，避免 `foreach`。即使 `GetEnumerator()` 已回傳 `struct` 類型，仍有 GC 存在。
2. 委派：使用 `Action` 與 `Func`，而不是建立 `delegate` 類型。
3. `List` 與 `Dictionary` 等 `Collection` 類型，建構時盡量給予適當的初始 capacity，以避免擴張造成的 GC。
4. 每幀運作的程式碼不要使用 LINQ 以避免不必要的 GC。
5. `MonoBehaviour` 的成員變數盡可能使用 `[SerializeField]` 與 `private`，而不是 `public`。

## 範例程式碼

```csharp
using System;
using DG.Tweening;
using UnityEngine;

namespace Physalia
{
    internal class Example : MonoBehaviour
    {
        public event Action Finished;
        
        private bool _isRunning;
        private float _remainTime;
        
        public float RemainTime => _remainTime;
        
        private void OnDisable()
        {
            StopTimer();
        }
        
        public void StartTimer(float time)
        {
            _isRunning = true;
            _remainTime = time;
        }
        
        private void StopTimer()
        {
            _isRunning = false;
        }
        
        private void Update()
        {
            _remainTime -= Time.deltaTime;
            if (_remainTime <= 0f)
            {
                _isRunning = false;
                _remainTime = 0f;
                Finished?.Invoke();
            }
        }
    }
}
```
