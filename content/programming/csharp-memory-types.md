---
title: C# 記憶體種類
created: 2023-09-29
modified: 2023-09-29
---

## 託管記憶體 (Managed Memory)

```csharp
var student = new Student();
```

使用 `new` 關鍵字就會分配到一個堆積記憶體 (heap memory) 區塊，不需要手動釋放。由 GC 管理並決定何時釋放。因此稱為託管記憶體。

## 堆疊記憶體 (Stack Memory)

```csharp
unsafe
{
    var stackMemory = stackalloc byte[100];
}
```

堆疊記憶體也不需要手動釋放，離開 scope 後就會自動被釋放。堆疊記憶體的容量非常小 (ARM、x86 和 x64 架構下，堆疊記憶體預設大小為 1 MB)，如果超出使用容量就會擲出 `StackOverflowException`。

## 非託管記憶體 (Unmanaged Memory)

```csharp
nint nativeMemory0 = default;
nint nativeMemory1 = default;
try
{
    nativeMemory0 = Marshal.AllocHGlobal(256);
    nativeMemory1 = Marshal.AllocCoTaskMem(256);
}
finally
{
    Marshal.FreeHGlobal(nativeMemory0);
    Marshal.FreeCoTaskMem(nativeMemory1);
}
```

使用 [[csharp-marshal-class|Marshal 類別]]的 `Marshal.AllocHGlobal` 或 `Marshal.AllocCoTaskMem` 來分配非託管記憶體。非托管就是不受 GC 管理的意思，因此需要手動呼叫 `Marshal.FreeHGlobal` 或 `Marshal.FreeCoTaskMem` 來釋放，若沒有正確釋放會發生記憶體洩漏。

至於 [[csharp-cotaskmem-vs-hglobal|AllocCoTaskMem 和 AllocHGlobal]]，應該都是選擇 `AllocCoTaskMem`，`AllocHGlobal` 是為了特殊目的使用的。

## References

- [.NET高性能编程 - C#如何安全、高效地玩转任何种类的内存之Span的本质(一)。 - justmine - 博客园 (cnblogs.com)](https://www.cnblogs.com/justmine/p/10006621.html)

