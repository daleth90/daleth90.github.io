---
title: Marshal 類別
---

`Marshal` 是一個用來處理[[csharp-memory-types#非託管記憶體 (Unmanaged Memory)|非託管記憶體]]的方法集合。主要有以下功能：
- 分配非託管記憶體
- 複製非託管記憶體區塊
- 將託管類型轉換成非託管類型
- 其它與非託管程式碼互動的方法

## 範例 1：在非託管記憶體寫入 1~20

```csharp
using System.Runtime.InteropServices;
using System.Text;

namespace Playground
{
    internal class Program
    {
        private static void Main()
        {
            var sb = new StringBuilder();

            // Request memory block for 20 bytes
            nint hglobal = Marshal.AllocHGlobal(20);
            try
            {
                // Write 1~20 to the memory
                for (int i = 0; i < 20; i++)
                {
                    Marshal.WriteByte(hglobal, i, (byte)(i + 1));
                }

                // Print the memory to the console
                for (int i = 0; i < 20; i++)
                {
                    sb.Append(Marshal.ReadByte(hglobal, i));
                    sb.Append(' ');
                }

                Console.WriteLine(sb.ToString());
                Console.ReadLine();
            }
            finally
            {
                Marshal.FreeHGlobal(hglobal);
            }
        }
    }
}
```

## 範例 2：來回轉換 string 與 IntPtr(nint)

```csharp
using System.Runtime.InteropServices;

namespace Playground
{
    internal class Program
    {
        private static void Main()
        {
            nint hglobal = Marshal.StringToHGlobalUni("Hello World!!");
            try
            {
                string? text = Marshal.PtrToStringUni(hglobal);
                Console.WriteLine(text != null ? text.ToString() : "NULL");
                Console.ReadLine();
            }
            finally
            {
                Marshal.FreeHGlobal(hglobal);
            }
        }
    }
}
```

## References

- [C#【必备技能篇】Marshal是什么？怎么用？_c# marshal-CSDN博客](https://blog.csdn.net/sinat_40003796/article/details/128252073)
- [Marshal Class (System.Runtime.InteropServices) | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.marshal?view=net-7.0)
