<!--
 * @Author: tangrenjie
 * @Date: 2020-08-31 17:59:13
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-03 14:10:09
 * @Descripttion: 
-->


#### 使用

```
    <template>
        <SceneCascader 
        v-modal="form.scene" 
        @change="changeScene"
        />
    </template>
    <script>
    export default {
        name:'xxx',
        data(){
            return {
                form: {scene:''}, // 默认显示全部
            }
        },
        methods:{
            changeScene(val){
                // 处理逻辑....
            }
        }
    }
    </script>
```

#### 参数说明


属性 | 类型 | 必填性 | 默认值
---|---|--- |---
apiSource | PRromise 或 Function | ==必填== | 无
size | String | 否 | small
clearable | Boolean | 否 | true
renderProps | Object | 否 | {}
v-model/value | 无 | 否 | 无


#### 扩展

> 支持elementUI Cascader的属性扩展，比如组件没有声明placeholder, 但你可以传，内部会接收。

#### 说明

组件内部数据的格式同elementUI Cascader数据的格式，如接口给的格式字段与组件内部定义的不一样，请传renderProps属性，例如 :renderProps= '{value: "id", label: "deptName"}'