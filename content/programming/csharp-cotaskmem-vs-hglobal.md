---
title: CoTaskMem v.s. HGlobal
---

`AllocCoTaskMem` 和 `AllocHGlobal` 是 [[csharp-marshal-class|Marshal 類別]]分配[[csharp-memory-types#非託管記憶體 (Unmanaged Memory)|非託管記憶體]]的 API。

根據 .NET 9 的文件，官方說 `AllocHGlobal` 方法只應該在 Windows 上呼叫特定 Win32 API 的時候用到，**不過到底是哪些 API 也沒講**。一般要取用非託管記憶體，.NET 6 以前應該應該要使用 `AllocCoTaskMem`，.NET 6 之後要使用 `NativeMemory` 類別。

`CoTaskMem` 過去主要用在 COM 接口的溝通，分配的是 COM 的 heap，而 `HGlobal` 分配的是程序的 heap。然而應該是 VS2012 之後，`CoTaskMem` 與 `HGlobal` 因為都使用了程序本身的 heap，因此幾乎已經沒有差異了。

總結以上，我想應該是優先使用 `CoTaskMem` 系列。

## References

- [Marshal.AllocHGlobal Method (System.Runtime.InteropServices) | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.marshal.allochglobal?view=net-9.0)
- [Marshal.AllocCoTaskMem(Int32) Method (System.Runtime.InteropServices) | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.marshal.alloccotaskmem?view=net-9.0)
- [c# - Marshal.AllocHGlobal VS Marshal.AllocCoTaskMem, Marshal.SizeOf VS sizeof() - Stack Overflow](https://stackoverflow.com/questions/1887288/marshal-allochglobal-vs-marshal-alloccotaskmem-marshal-sizeof-vs-sizeof)
