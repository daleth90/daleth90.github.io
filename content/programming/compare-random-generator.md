---
title: 亂數產生器演算法比較
created: 2025-08-15
modified: 2025-08-25
---

## 線性同餘生成器 (LCG)

[Linear Congruential Generator (LCG)](https://en.wikipedia.org/wiki/Linear_congruential_generator) 似乎是最常拿來教學的演算法，畢竟是早期算法，又很容易實作。基本概念很簡單：$X_{n+1} = (aX_n + c) \bmod m$。意思就是下一個生成數是由當前的生成數經過某個公式計算出來的。

而 [Lehmer RNG](https://en.wikipedia.org/wiki/Lehmer_random_number_generator) 是網路上很容易查到的演算法，它也是一種 LCG。特性是 c = 0，等於只有乘法項，所以又稱為 Multiplicative Linear Congruential Generator (MLCG)。因為 MLCG 只是 LCG 的一種集合，所以一起討論比較方便。

但因為亂數品質和破解問題，[Numerical Recipes 第三版](https://numerical.recipes/book.html)的 7.1 節開頭和 7.1.1 節，有跟你說為啥==不要用 LCG 這種爛東西==。雖然做遊戲通常不太需要擔心亂數安全性問題，不過我自己測試的確覺得大部份的隨機品質真的蠻爛的，網路上容易查到的 [32 位元版本](https://learn.microsoft.com/en-us/archive/msdn-magazine/2016/august/test-run-lightweight-random-number-generation)還特別爛。

```csharp
public class RandomGenerator
{
    // 使用 long 是常態，但有些參數集會造成計算溢位，想測試的時候請適時換成 ulong
    private const long m = 1L << 32;
    private const long a = 1664525L;
    private const long c = 1013904223L;

    private long seed;

    public RandomGenerator(long seed)
    {
        this.seed = seed;
    }

    public RandomGenerator()  // 自動用 DateTime 當種子
        : this(DateTime.UtcNow.Ticks % m) { }

    public double Next()
    {
        seed = (a * seed + c) % m;
        return (seed * 1.0) / m;
    }

    public int NextInt(int minInclusive, int maxExclusive)
    {
        return minInclusive + (int)(Next() * (maxExclusive - minInclusive));
    }
}
```

### 測試程式碼

```csharp
using System;
using System.Text;

public class Program
{
    public static void Main()
    {
        var sb = new StringBuilder();
        var rng = new RandomGenerator();
        for (var i = 0; i < 50; i++)
        {
            if (i != 0 && i % 10 == 0)
            {
                sb.AppendLine();
            }

            int randomValue = rng.NextInt(0, 100);  // 遊戲開發最常用的 100% 機率
            sb.Append((randomValue % 10).ToString());  // 以 10% 為單位來判讀分布
            sb.Append(',');
        }

        Console.Write(sb.ToString());
    }
}
```

### 各種 LCG 參數集測試結果

```text
# MINSTD (C++ 11 的 minstd_rand0)
# m = 2^31 − 1, a = 16807, c = 0
# 可以看到相同數字短期內頻繁出現的狀況
7,0,6,6,6,3,7,5,8,6,
6,4,2,6,4,6,8,8,4,9,
0,6,6,5,3,8,2,3,1,2,
9,4,2,0,5,1,1,5,4,3,
5,8,8,7,6,2,4,2,2,1,
```

```text
# MINSTD 改進版 (C++ 11 的 minstd_rand)
# m = 2^31 − 1, a = 48271, c = 0
# 還是有相同數字短期內頻繁出現的狀況，但比原版好一點
6,4,4,9,5,2,6,1,6,6,
0,8,1,6,7,2,0,3,9,3,
6,7,8,9,5,5,3,9,1,1,
1,0,4,6,8,3,4,3,9,9,
3,5,1,2,3,5,8,1,3,0,
```

```text
# C17
# m = 2^31, a = 1103515245, c = 12345
9,6,2,5,9,9,3,6,5,1,
4,8,8,8,3,1,4,3,6,9,
6,4,1,4,4,2,3,2,3,4,
0,9,3,5,9,3,9,1,0,5,
1,0,7,7,8,6,8,1,8,6,
```

```text
# Numerical Recipes 第二版推薦參數
# m = 2^32, a = 1664525, c = 1013904223
# 我感覺這個參數算是比較好一點
7,1,5,3,2,3,0,9,2,8,
1,7,6,7,0,0,9,1,4,0,
5,8,5,0,5,9,2,7,9,2,
4,4,9,8,4,2,7,5,1,9,
6,3,0,9,8,9,2,7,5,6,
```

## 組合線性同餘生成器 (CLCG)

https://en.wikipedia.org/wiki/Combined_linear_congruential_generator

簡單來說就是把當前的種子根據適用範圍用不同的參數集或算法來計算。有點懶得寫。

## 置換同餘生成器 (PCG)

置換同餘生成器（Permuted Congruential Generator, PCG）開發於 2014 年。（竟然還做了[官方網站](https://www.pcg-random.org/)？）該算法在線性同餘生成器（LCG）的基礎上增加了輸出置換函數（output permutation function），以此優化 LCG 算法的統計性能。

有好幾種版本，一般使用狀況比較推薦所謂的 PCG32 演算法（PCG-XSH-RR 演算法）。以下參考 https://github.com/imneme/pcg-c-basic/blob/master/pcg_basic.c 實作。

```csharp
public record struct Pcg32
{
    private const ulong Multipliar = 6364136223846793005UL;

    public ulong State { get; set; }
    public ulong Increment { get; set; }

    public Pcg32(ulong state, ulong stream)
    {
        State = state;
        Increment = (stream << 1) | 1;

        State += Increment;
        Next();
    }

    public Pcg32() : this(0xcafef00dd15ea5e5, 0xa02bdbf7bb3c0a7) { }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public uint Next()
    {
        ulong oldState = State;
        State = oldState * Multipliar + Increment;
        uint xorshifted = (uint)(((oldState >> 18) ^ oldState) >> 27);
        int rot = (int)(oldState >> 59);
        return (xorshifted >> rot) | (xorshifted << ((-rot) & 31));
    }
}
```

> [!todo]
> - PCG32 我好像沒寫完，改天再重看一次。
> - C++ 版的好像有倒轉算法，如果桌遊類型需要倒轉的時候還蠻重要的。改天再研究。
