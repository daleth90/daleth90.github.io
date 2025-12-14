---
title: 2D 線段相交
created: 2025-12-15
modified: 2025-12-15
---

![[2d-line-segment-intersection.png]]

$$
\begin{gathered}
P = A + \overrightarrow{AB} * t1 \\
P = C + \overrightarrow{CD} * t2
\end{gathered}
$$

$$
\begin{align*}
\enspace& A + t1 \cdot \overrightarrow{AB} = C + t2 \cdot \overrightarrow{CD} \\
\Rightarrow \enspace&
t1 \cdot \overrightarrow{AB} - t2 \cdot \overrightarrow{CD} = C - A \\
\Rightarrow \enspace&
\begin{bmatrix}
\overrightarrow{AB}.x & \overrightarrow{CD}.x \\
\overrightarrow{AB}.y & \overrightarrow{CD}.y
\end{bmatrix}
\begin{bmatrix}
t1 \\
-t2
\end{bmatrix}
=
\begin{bmatrix}
\overrightarrow{AC}.x \\
\overrightarrow{AC}.y
\end{bmatrix}
\\
\Rightarrow \enspace&
\begin{bmatrix}
t1 \\
-t2
\end{bmatrix}
=
\frac 1{\overrightarrow{AB}.x \cdot \overrightarrow{CD}.y - \overrightarrow{CD}.x \cdot \overrightarrow{AB}.y}
\begin{bmatrix}
\overrightarrow{CD}.y & -\overrightarrow{CD}.x \\
-\overrightarrow{AB}.y & \overrightarrow{AB}.x
\end{bmatrix}
\begin{bmatrix}
\overrightarrow{AC}.x \\
\overrightarrow{AC}.y
\end{bmatrix} \\
\Rightarrow \enspace&
\begin{bmatrix}
t1 \\
t2
\end{bmatrix}
=
\frac 1{\overrightarrow{AB}.x \cdot \overrightarrow{CD}.y - \overrightarrow{CD}.x \cdot \overrightarrow{AB}.y}
\begin{bmatrix}
\overrightarrow{CD}.y & -\overrightarrow{CD}.x \\
\overrightarrow{AB}.y & -\overrightarrow{AB}.x
\end{bmatrix}
\begin{bmatrix}
\overrightarrow{AC}.x \\
\overrightarrow{AC}.y
\end{bmatrix}
\end{align*}
$$

如果 t1 與 t2 都在 0~1 之間，代表 P 同時在兩個線段上，也就代表兩個線段有相交。

> [!note]
> 另外如果是判斷直線相交，或是直線與線段的相交，都可以用同一套公式，只是 t1 與 t2 的範圍不同而已。

## 程式碼

```csharp
public bool Intersect(Vector2 a, Vector2 b, Vector2 c, Vector2 d, out Vector2 p)
{
    const float Eplilon = 1e-6f;
    
    Vector2 ab = b - a;
    Vector2 cd = d - c;

    float det = ab.x * cd.y - cd.x * ab.y;  // Determinant
    if (Mathf.Abs(det) < Eplilon)  // Check if parallel
    {
        p = default;
        return false;
    }

    Vector2 ac = c - a;
    float t1 = (ac.x * cd.y - ac.y * cd.x) / det;
    float t2 = (ac.x * ab.y - ac.y * ab.x) / det;
    
    // Check if intersection lies on each segments
    if (t1 < 0f || t1 > 1f)
    {
        p = default;
        return false;
    }

    if (t2 < 0f || t2 > 1f)
    {
        p = default;
        return false;
    }

    p = a + ab * t1;
    return true;
}
```
