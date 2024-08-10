---
layout: post
title: Result Pattern 與錯誤處理
tags:
  - c#
  - result-pattern
  - error-handler
---

有些狀況下，我們會有個流程進行一系列的工作。但每一個步驟都有可能失敗，而且失敗的狀況還
不只一種。對於這種狀況，我們會想要明確的知道失敗的種類，讓我們安全的進行後續處理。

<!--more-->

例如以下直觀的程式碼，執行了服務型遊戲的登入流程。但只要經過網路與伺服器，事情總是不像下面的程式碼這麼單純。我們希望能夠顯示各種錯誤，並針對特定幾個錯誤做特殊處理。

```csharp
// 太過理想的程式碼，每一步都會出錯
public async Task EnterGameAsync() {
    await CheckAppVersionAsync();
    await UpdateContentAsync();
    await LoginAsync();
    await SyncPlayerDataAsync();
}
```

### Error Class

首先為了統一大部份的錯誤處理流程，我們會需要一個名為 Error 的類別。每個人對 Error 物件的需求不盡相同，所以實際的欄位可根據需求調整，但總之需要這樣子的物件。我通常會寫個名為 ErrorCode 的 enum 來定義各種錯誤。有時候我們也會想要知道更細節的錯誤資訊，因此又會需要 string 來保存錯誤訊息。

```csharp
public class Error
{
    private readonly ErrorCode _errorCode;
    private readonly string _message;
    
    public ErrorCode ErrorCode => _errorCode;
    public string Message => _message;
    
    public Error(ErrorCode errorCode, string message = null)
    {
        _errorCode = errorCode;
        _message = message;
    }
    
    public override string ToString()
    {
        if (string.IsNullOrEmpty(_message))
        {
            return $"ErrorCode: {_errorCode}";
        }
        else
        {
            return $"ErrorCode: {_errorCode} => {_message}";
        }
    }
}
```

### Result Class

接著我們製作了一個名為 Result 的物件。成功時，我們取得該步驟所需回傳的物件；失敗時，我們處理 Error 物件。

```csharp
public class Result
{
    protected readonly bool _isSuccess;
    protected readonly Error _error;
    
    public bool IsSuccess => _isSuccess;
    public bool IsFailure => !_isSuccess;
    public Error Error => _error;
    public ErrorCode ErrorCode => _error.ErrorCode;
    public string ErrorMessage => _error.Message;
    
    public Result()
    {
        _isSuccess = true;
    }
    
    public Result(ErrorCode errorCode, string message = null)
    {
        _error = new Error(errorCode, message);
    }
    
    #region Static Methods
    public static Result Success()
    {
        return new Result();
    }
    
    public static Result<T> Success<T>(T instance)
    {
        return new Result<T>(instance);
    }
    
    public static Result Failure(ErrorCode errorCode, string message = null)
    {
        return new Result(errorCode, message);
    }
    
    public static Result<T> Failure<T>(ErrorCode errorCode, string message = null)
    {
        return new Result<T>(errorCode, message);
    }
    
    public static Result Failure(Error error)
    {
        return new Result(error.ErrorCode, error.Message);
    }
    
    public static Result<T> Failure<T>(Error error)
    {
        return new Result<T>(error.ErrorCode, error.Message);
    }
    #endregion
}

public class Result<T> : Result
{
    private readonly T _value;
    
    public T Value => IsSuccess ? _value : default;
    
    public Result(T data) : base()
    {
        _value = data;
    }
    
    public Result(ErrorCode errorCode, string message = null) : base(errorCode, message)
    {
    
    }
}
```

### 結果

原本的程式碼調整後如下。

```csharp
// 使用 Result 模式
public async Task EnterGameAsync() {
    Result checkVersionResult = await CheckAppVersionAsync();
    if (checkVersionResult.IsFailure)
    {
        ShowPopupError(checkVersionResult.Error);
        return;
    }
    
    Result updateContentResult = await UpdateContentAsync();
    if (updateContentResult.IsFailure)
    {
        ShowPopupError(updateContentResult.Error);
        return;
    }
    
    int loginRetry = 0;
    Result loginResult;
    while (loginRetry < 5)
    {
        loginResult = await LoginAsync();
        if (loginResult.IsFailure)
        {
            await Task.Delay(1000);
            continue;
        }
    }
    
    if (loginResult.IsFailure)
    {
        ShowPopupError(loginResult.Error);
        return;
    }
    
    Result syncPlayerDataResult = await SyncPlayerDataAsync();
    if (syncPlayerDataResult.IsFailure)
    {
        ShowPopupError(syncPlayerDataResult.Error);
        return;
    }
}
```

### 再改進

我們可以發現，雖然 Result 模式把錯誤明確化了，但是程式碼明顯變得......蠻冗長的。在比較簡單的狀況下，我們可以直接用 Result 模式解決問題，但若是碰到比較多步驟的流程，程式碼真的可以長到難以維護，我們可能會需要更好的做法。

你可能會想到 Reactive Programming (Rx)，但 Rx 處理的是事件響應，問題不太一樣。我們可以使用類似的 Railway Oriented Programming 來改進。

[下一篇：Result Pattern 與軌道導向程式設計](https://www.wentaichi.me/blog/result-pattern-and-railway-oriented-programming/)
