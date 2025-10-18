---
title: markdown语法备忘
published: 2025-10-14
description: '记录一下markdown语法，不然很快又忘了'
image: ''
tags: [markdwon]
category: '备忘'
draft: false 
lang: ''
---

# 一级标题 
```markdown
# 一级标题<!--后面有空格-->
```

## 二级标题
```markdown
## 二级标题
```

### 三级标题
```markdown
### 三级标题
```

## 字型
_斜体_, **黑体**, `高亮`
```markdown
_斜体_, **黑体**, `高亮`
黑体的快捷键Crtl+B
```
## 列表
- this one
- that one
- the other one
```markdown
- this one
- that one
- the other one
```

## 块引号
> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.
```markdown
> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.
```

## 数字列表
1. first item
    - 1.1
    - 1.2
    - 1.3
2. second item
    ```
    代码块
    ```
3. third item
```markdown
1. first item
    - 1.1
    - 1.2
    - 1.3
2. second item
    ```
    代码块
    ```
3. third item
<!--四个空格控制缩进来控制层级-->
```

## 代码块
使用两行\`\`\`
一般来说bash中<必选参数>,[可选参数]
```python
print("hello world")#这是注释
```

## 转义字符
用反斜杠\，比如\`

## 链接
链接[fuwari](https://github.com/saicaca/fuwari)、章节[跳转到二级标题](#二级标题an-h2-header)、角标[^1]
[^1]: 角标内容.
```markdown
链接[fuwari](https://github.com/saicaca/fuwari)、章节[跳转到二级标题](#二级标题an-h2-header)、角标[^1]
[^1]: 角标内容.
```

## 水平分割线
---

123

---

456

---
```markdown
---

123

---

456

---
<!--内容和---之间有空格-->
```

## 定义列表
apples
: Good for making applesauce.
oranges
: Citrus!
tomatoes
: There's no "e" in tomatoe.
```markdown
apples
: Good for making applesauce.
oranges
: Citrus!
tomatoes
: There's no "e" in tomatoe.
```

## 行内块
| Line one
| Line too
| Line tree
```markdown
| Line one
| Line too
| Line tree
```

## 插入图片
可以使用markdown，或者html来插入图片，html的方式可以控制大小位置等元数据。
![](https://vip.123pan.cn/1826899604/yk6baz03t0m000d7w33girwfizdpc39iDIYvAqY2BIQOAcx1AdFy.jpg)
<img src="https://vip.123pan.cn/1826899604/yk6baz03t0m000d7w33girwfizdpc39iDIYvAqY2BIQOAcx1AdFy.jpg">
```markdown
![](https://vip.123pan.cn/1826899604/yk6baz03t0m000d7w33girwfizdpc39iDIYvAqY2BIQOAcx1AdFy.jpg)
<img src="https://vip.123pan.cn/1826899604/yk6baz03t0m000d7w33girwfizdpc39iDIYvAqY2BIQOAcx1AdFy.jpg">
```

## 数学公式
行内公式$\omega = d\phi / dt$
```markdown
$\omega = d\phi / dt$
<!--$-->
```
独占一行

$$I = \int \rho R^{2} dV$$

```markdown

$$I = \int \rho R^{2} dV$$
<!--$$-->

```

## 插入视频
### YouTube

<iframe width="100%" height="468" src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Bilibili
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1JA411h7Gw&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 文章的元数据

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
---
```

| 属性     | 描述                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | 帖子的标题。                                                                                                                                                                                      |
| `published`   | 帖子发布的日期。                                                                                                                                                                           |
| `description` | 帖子的简短描述。显示在索引页面上。                                                                                                                                                   |
| `image`       | 帖子的封面图片路径。 |
| `tags`        | 帖子的标签。                                                                                                                                                                                       |
| `category`    | 帖子的类别。                                                                                                                                                                                   |
| `draft`        | 如果此帖子仍然是草稿，则不会显示。     

## markdown拓展

::github{repo="cannian/fuwari"}

```markdown
::github{repo="cannian/fuwari"}
```

:::note
突出显示用户应考虑的信息。
:::

```markdown
:::note
突出显示用户应考虑的信息。
:::
```

:::tip
提示。
:::

```markdown
:::tip
提示。
:::
```

:::important
重要。
:::

```markdown
:::important
重要。
:::
```

:::warning
警告。
:::

```markdown
:::warning
警告。
:::
```

:::caution
注意。
:::

```markdown
:::caution
注意。
:::
```

:::note[自定义标题]
这个标题是自定义的。
:::

```markdown
:::note[自定义标题]
这个标题是自定义的。
:::
```
## GitHub syntax

 [!TIP]
> [The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```
## 隐藏

The content :spoiler[is hidden **ayyy**]!

```markdown
The content :spoiler[is hidden **ayyy**]!

```