# emaction backend

这个项目托管了 emaction 的后端代码。

如有需要，你可以参考[这篇文章](https://eallion.com/self-hosted-github-flavored-reactions/)，在自己的 Cloudflare 账号中托管一个后端，从而自己保存数据。

如果不想托管在 Cloudflare，你还可以按照下面的接口文档，自己实现一个后端，托管到任意位置。~~也就俩接口，我相信作为 CRUD 小能手的你准能搞定。~~

## 接口文档

1. 获取特定`targetId`已收到的所有 reactions

    `endpoint: /reactions`

    `method: GET` 

    **入参:**

    | 字段 | 类型 | 必填 | 备注 |
    | --- | --- | --- | --- |
    | targetId | String | 是 | 目标 id |

    **入参示例：**

    ```jsx
    /reactions?targetId=fakeid
    ```

    **出参：**

    | 字段 | 字段 | 字段 | 类型 | 备注 |
    | --- | --- | --- | --- | --- |
    | code |  |  | Int | 0成功 1失败 |
    | msg |  |  | String | 提示信息 |
    | data |  |  | Object | 具体数据 |
    |  | reactionsGot |  | Array | 收到的 reactions |
    |  |  | reaction_name | String | reaction 名称 |
    |  |  | count | Int | 点击次数 |

    **出参示例：**

    ```json
    {
        "code": 0,
        "msg": "success",
        "data": {
            "reactionsGot": [
                {
                    "reaction_name": "thumbs-up",
                    "count": 261
                },
                {
                    "reaction_name": "smile-face",
                    "count": 199
                }
            ]
        }
    }
    ```

2. 新增/更新一个 reaction
    
    `endpoint: /reaction`
    
    `method: PATCH`
    
    **入参：**
    
    | 字段 | 类型 | 必填 | 备注 |
    | --- | --- | --- | --- |
    | targetId | String | 是 | 目标 id |
    | reaction_name | String | 是 | reaction 名称 |
    | diff | Int | 是 | 数量变动，只接受 1 或 -1。任何大于 1 的值将重置为 1，小于 -1 的值将重置为 -1 |
    
    **入参示例：**
    
    ```json
    /reaction?targetId=fakeid&reaction_name=smile-face&diff=1
    ```
    
    **出参：**
    
    | 字段 | 类型 | 备注 |
    | --- | --- | --- |
    | code | Int | 0成功 1失败 |
    | msg | String | 提示信息 |
    
    **出参示例：**

    ```json
    {
        "code": 0,
        "msg": "success"
    }
    ```