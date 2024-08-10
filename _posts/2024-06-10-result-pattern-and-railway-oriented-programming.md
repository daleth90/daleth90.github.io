---
layout: post
title: Result Pattern 與軌道導向程式設計 (Railway Oriented Programming)
tags:
  - c#
  - result-pattern
  - error-handler
---

[上一篇：Result Pattern 與錯誤處理](https://www.wentaichi.me/blog/result-pattern-and-error-handler/)

按照 Result Pattern 的概念，我們經常需要處理各種錯誤。但是為了適當的處理錯誤，程式碼總是會變得太長，導致不容易閱讀。像是以下的程式碼：

<!--more-->

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

我們可以使用 Railway Oriented Programming 的概念重寫一下，可以看到明顯的差異：

```csharp
// 使用 ROP 重寫過的樣子
public async Task EnterGameAsync() {
    return await Result.Success()
        .Bind(async () => await CheckAppVersionAsync())
        .Bind(async () => await UpdateContentAsync())
        .BindRetry(async () => await LoginAsync(), 5, 1000)
        .Bind(async () => await SyncPlayerDataAsync());
}
```

### Railway Oriented Programming

[Railway Oriented Programming (ROP)](https://fsharpforfunandprofit.com/rop/) 是 Scott Wlaschin 在 [NDC London 2014 的演講中](https://vimeo.com/113707214)公開發表的概念。這個概念就是專門處理錯誤處理流程的，用來解決我們上面看到的冗長程式碼。

你可以想像每個工作項目都有兩條軌道，成功軌道與失敗軌道。你自己按照工作流程拼接好所有的軌道後，讓你的流程火車就從成功軌道開始走，工作項目本身就會幫你把流程火車引導至它該去的地方，你只要在終點等著結果即可。

![ROP Example]({{ site.baseurl }}/assets/blogs/rop-example.png)

畢竟 XOP (X 可以替換成任何字母) 這個縮寫好像已經被濫用了，這個做法的影響範圍也不像 OOP 這麼大，ROP 就只是單純用來處理錯誤流程的概念。你可以把這個寫法想像成 "Railway Model of Control Flow"，可能會比較好理解。

Scott 原本的概念中，把單線軌道與雙線軌道的 API 區別的很明確，可能是年代差異和語法差異導致有點混亂。而且針對 ROP 的 API 名稱和用法，找不太到所謂的「標準套件」或「公認模板」，大家實作出來的都有些出入。

C# 陣營有 Vladimir Khorikov 的 [CSharpFunctionalExtensions](https://github.com/vkhorikov/CSharpFunctionalExtensions)，寫得蠻完整的，但我其實只需要 Result 的那一部份，而且我覺得 API 可以更單純些，此外我自己使用時也發現有時需要寫自己的其它擴充 API 會更好用。因此以下舉例如何實作常用的軌道 API。

我自己整合原本的概念以及 [CSharpFunctionalExtensions](https://github.com/vkhorikov/CSharpFunctionalExtensions) 的 API，列出最常用的 API：Bind、Tap、Finally。

### 常用的軌道 API

##### Bind

Bind 是最基本也最常用的軌道：
1. 若前一項工作成功，則執行自己的工作，並且回傳成功或失敗
2. 若前一項工作已經失敗，則回傳失敗

![Bind Example](https://fsharpforfunandprofit.com/posts/recipe-part2/Recipe_Railway_Transparent.png)

```csharp
public static Result<K> Bind<T, K>(this Result<T> result, Func<T, Result<K>> func)
{
    if (result.IsFailure)
    {
        return Result.Failure<K>(result.Error);
    }

    return func.Invoke(result.Value);
}

// Example
Result<K> result = Result.Success(new T())
    .Bind(FindKWithT);

private Result<K> FindKWithT(T t)
{
    // Do Something
    // Return success or failure
}
```

##### Tap

Tap 也是最基本的軌道之一，是平行線軌道，用來執行附加的工作，不會回傳結果：
1. 若前一項工作成功，則執行自己的工作，且必定回傳前一項的成功
2. 若前一項工作已經失敗，則回傳前一項的失敗

P.S. 這在原本的概念是 Map(Tee(x)) 實在是有點複雜。

![Tap Example](https://fsharpforfunandprofit.com/posts/recipe-part2/Recipe_Railway_MapAdapter.png)

```csharp
public static Result<T> Tap<T>(this Result<T> result, Action<T> action)
{
    if (result.IsFailure)
    {
        return result;
    }
    
    action.Invoke(result.Value);
    return result;
}

// Example
Result<T> result = Result.Success(new T())
    .Tap(DoSomething);

private void DoSomething(T t)
{
    // Do Something
}
```

##### Finally

Finally 代表軌道的終點，最後成功軌道和失敗軌道會匯流，取得最後的結果，或是執行最後的工作。

![ROP Example]({{ site.baseurl }}/assets/blogs/rop-finally-example.png)

```csharp
public static void Finally<T>(this Result<T> result, Action<Result<T>> action)
{
    return action.Invoke(result);
}

public static K Finally<T, K>(this Result<T> result, Func<Result<T>, K> func)
{
    return func.Invoke(result);
}

// Example
HttpResponse response = Result.Success(new T())
    .Finally(CreateHttpResponse);

private HttpResponse CreateHttpResponse(Result<T> result)
{
    if (result.IsFailure)
    {
        // return response with ErrorCode
    }

    // return response with OK
}
```

### 衍生 API 範例

基於以上概念，可以衍生出其它軌道流程。以下舉出幾個例子。

##### TapDouble

TapDouble 是基於 Tap 的改寫，有時候你會想要在前一項工作失敗時做些事情，在兩條軌道上都可以執行工作：
1. 若前一項工作成功，則執行自己的工作，且必定回傳成功
2. 若前一項工作已經失敗，則執行自己的工作 (可以是相同或不同的工作)，且繼續回傳失敗

這個概念通常用在 logging 或 tracing 方面。

P.S. 當然你也可以自己寫個 TapFailure 做個區別，實際上的實作應該是很自由的。

```csharp
public static Result<T> TapDouble<T>(this Result<T> result, Action<Result<T>> action)
{
    action.Invoke(result);
    return result;
}

// Example
Result<T> result = Result.Success(new T())
    .TapDouble(DoSomething);

private void DoSomething(T t)
{
    // Do Something
}
```

##### Compensate

把前一項工作失敗，透過某些特殊工作讓它再轉換成成功的結果。

```csharp
public static Result<T> Compensate<T>(this Result<T> result, Func<Result<T>> func)
{
    if (result.IsSuccess)
    {
        return Result.Success(result.Value);
    }

    return func.Invoke();
}
```

##### BindRetry

有些工作項目會被預期失敗，像是 WebRequest 逾時的時候，我們就會需要重試幾次。

P.S. 這裡用 Exponential Backoff 寫得正式一點，你也可以調整成適合你的 API。一樣，概念實作應該是很自由的。

```csharp
// Retry with exponential backoff
// See: https://cloud.google.com/memorystore/docs/redis/exponential-backoff

private static readonly double RandomSeconds = new Random().NextDouble();
private static readonly double[] DefaultBackoffTimes = new double[] { 1.0, 2.0, 4.0, 8.0 };

public static async Task<Result> BindWithRetry(this Result result,
            Func<Task<Result>> func, Func<Result, bool> retryCondition, double[] customBackoffTimes = null)
{
    if (result.IsFailure)
    {
        return result;
    }

    double[] backoffTimes = customBackoffTimes ?? DefaultBackoffTimes;
    for (var i = 0; i < backoffTimes.Length; i++)
    {
        Result funcResult = await func.Invoke();
        if (funcResult.IsSuccess)
        {
            return funcResult;
        }

        bool shouldRetry = retryCondition.Invoke(funcResult);
        if (!shouldRetry)
        {
            return funcResult;
        }

        double backoffTime = i < backoffTimes.Length - 1 ? backoffTimes[i] : backoffTimes[^1];
        await Task.Delay((int)((backoffTime + RandomSeconds) * 1000));
    }

    // Final attempt
    return await func.Invoke();
}
```

### 總結

Railway Oriented Programming 專門用來處理會出現錯誤的工作流程，讓你寫出更容易閱讀的程式碼。當然不要[濫用](https://fsharpforfunandprofit.com/posts/against-railway-oriented-programming/)在不符合這個情境的狀況。

雖然我整理出來的基本 API 只有 3 個，但依照類似的概念可以再衍生出更多不同的軌道形狀與 API，[CSharpFunctionalExtensions](https://github.com/vkhorikov/CSharpFunctionalExtensions) 提供的 API 當然更多，但也不要被套件的 API 綁死，畢竟都是建立在 Result 的擴充方法，我自己也會根據專案習慣寫出適當的衍生 API，有需要的時候你也可以依樣畫葫蘆來寫出自己需要的軌道形狀。
