---
layout: post
title: 為何 Unity 的 Round() 是往偶數捨入？
tags:
  - unity
  - round
  - 小知識
---

首先，.NET 預設的 `Round()` 就是這樣，我想 Unity 官方其實也沒想那麼多，就只是把原本只支援 `double` 的 `Math` 類別改成支援 `float` 而已。

至於為什麼預設會使用 `ToEven`，是由於財經與統計方面的關係。

<!--more-->

### 統計的誤差

往偶數捨入這個方法，稱為奇進偶捨法，原文是銀行家捨入法 (Banker's Rounding)。那事情一定跟錢有關，是絕對不能出錯的東西。

傳統的四捨五入遇到五時，必定是往更大的數字移動。結果就是 1 到 9 這九個數字，有 4 個數字會觸發捨去，5個數字觸發進位。也就是說，當資料足夠隨機的狀況下，進位的次數必定比捨去還要多，導致數字慢慢變大。

而奇進偶捨法遇到五時，根據離偶數的距離，會有一半的機會捨去或進位。也就是說 1 到 9 這九個數字，捨去和進位的機率是一樣的。注意這並不表示奇進偶捨法更加準確，而是因為偏差更容易透過「隨機」來消除掉。

舉例來說，以下是平均分佈的資料。我們可以發現，明明是平均分佈，最廣為人知的四捨五入法竟然有誤差，而奇進偶捨法可以獲得與原本相同的結果。

$Avg(1,1.5,2,2.5,3) = 2$  
$Avg(RoundAwayFromZero(1,1.5,2,2.5,3)) = Avg(1,2,2,3,3) = 2.2$  
$Avg(RoundToEven(1,1.5,2,2.5,3)) = Avg(1,2,2,2,3) = 2$

但是我們寫程式的數學計算經常只是普通的數學，大部份狀況都不是都用在統計上。所以 .NET 後來的 `Math.Round()` 新增了 `MidpointRounding` 參數來給使用者選擇捨入的方式。

至於 Unity 應該不會積極的跟進，我想還是得自己寫傳統的四捨五入。

順帶一提，Excel 的 `ROUND()` 是四捨五入，所以沒注意的話統計結果會跟程式寫的不一樣。

### 為什麼不使用 .NET 的 Math.Round()

有些人可能會覺得，既然 .NET 有支援四捨五入，為何不把 `float` 轉型成 `double` 使用就好。但是轉型時其實會出現誤差，有時會導致四捨五入不如預期。通常小數第二位以內的數字轉換時不會有問題，但如果到小數第二位以上的轉換，那就會開始出現精度問題了。

舉例來說，我們可以看到 -16.345 這個數字，捨入到小數點第二位時，會因為 `float` 到 `double` 的轉型產生偏差，導致結果不如預期。因此老老實實寫個支援 `float` 的四捨五入是必要的，才不會錯的不明不白。

```csharp
Console.WriteLine($"float {-16.345f} => {Math.Round(-16.345f, 2, MidpointRounding.AwayFromZero)}");
Console.WriteLine($"double {-16.345d} => {Math.Round(16.345d, 2, MidpointRounding.AwayFromZero)}");
Console.WriteLine($"float {-16.345f} => double {(double)-16.345f}");

// Output:
// float -16.345 => -16.34
// double -16.345 => 16.35
// float -16.345 => double -16.344999313354492
```

### 浮點數誤差

自己實作四捨五入時，要注意浮點數誤差，你以為的 11.5 可能其實是 11.499999999999998，導致結果不如預期。解決方案是把小數位和 0.5 做類似 `Approximate` 的處理。老樣子得自己寫，別相信 .NET 和 Unity 的 `Approximate` 是能用的。

```csharp
public static bool Approximate(float a, float b)
{
    float diff = a - b;
    if (diff < 0f)
    {
        diff = -diff;
    }
    
    return diff < 0.00001f;
}
```

### 程式碼

這裡只處理了最傳統的四捨五入，也就是對應 .NET 的 `MidpointRounding.AwayFromZero`。我想通常不會用到其它的捨入法。需要其它的捨入法，只要針對接近 0.5 的小數部分做特別處理即可。

```csharp
public const float Tolerence = 0.00001f;

public static float Round(float value)
{
    return RoundToInt(value);
}
    
public static int RoundToInt(float value)
{
    int integer = (int)value;
    float fraction = value - integer;
    if (Mathf.Abs(fraction) >= 0.5f - Tolerence)
    {
        if (fraction > 0f)
        {
            return integer + 1;
        }
        else if (fraction < 0f)
        {
            return integer - 1;
        }
    }
    
    return integer;
}
```

### References

- https://learn.microsoft.com/en-us/dotnet/api/system.math.round?view=net-8.0
- https://www.reddit.com/r/Unity3D/s/fIAgprmI3T
- https://blogs.sas.com/content/iml/2019/11/11/round-to-even.html
