<template>
<div>
  <div class="function-title-wrap">预标注 - 新建任务
  </div>
  <div class="container" style="font-size: 14px">
    <el-row >
      <el-col :span="4"></el-col>
      <el-col :span="8" >
        <el-form-item>
            <el-row>
              数据集类型：
            </el-row>
          <el-row>
            <el-radio-group v-model="datasetType"  class="ml-4" >
              <el-radio label="a" size="large"  >训练集</el-radio>
              <el-radio label="b" size="large">测试集</el-radio>
            </el-radio-group>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            数据集版本：
          </el-row>
          <el-row>
            <el-select v-model="select_datasets" clearable placeholder="选择数据集" style="width: 100%">
              <el-option
                  v-for="item in select_datasets_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-row>
          <el-col style="font-size: 12px; color: rgb(126,129,140)">
            仅支持对「物体检测模型」、「混合模型」、「图像文字识别模型」和「结构化图像文字识别模型」的未发布数据集版本发起预标注。
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row>
            模型版本：
          </el-row>
          <el-row>
            <el-select v-model="select_datasets" clearable placeholder="请选择或搜索" style="width: 100%">
              <el-option
                  v-for="item in select_datasets_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-row>

        </el-form-item>
        <el-form-item>
            <el-row>
              选择标签：
            </el-row>
            <div style="background-color: rgb(243,245,251); text-align: center; padding: 50px" >
              <el-row>
                <el-col >
                  <el-image src="src/assets/img/pre-calibrate-create-block.png"  style="width: 25%; "></el-image>
                </el-col>
                <el-col style="font-size: 12px; color: grey">
                  请先选择模型版本
                </el-col>
              </el-row>

            </div>
        </el-form-item>
      </el-col>
      <el-col :span="4">

      </el-col>
      <el-col :span="8" style="border-left: 0.5px solid grey; padding-left: 20px; padding-top: 15px">
        <el-row type="flex" align="middle" style="margin-bottom: 20px">
          <el-image src="src/assets/img/notice.png"></el-image>
          发起要求
        </el-row>
        <el-row>
          未标注图片数 > 0；
        </el-row>
      </el-col>
    </el-row>



  </div>
  <el-row  >
    <el-col :span="24" >
      <div class="container" style="text-align: right;">
        <el-button  type="primary" disabled>确 定</el-button>
        <el-button >取 消</el-button>
      </div>
    </el-col>
  </el-row>





</div>

</template>


<script setup>
import {ref} from "vue";
let datasetType = ref("a")
let select_datasets = ref("")
const select_datasets_options = [
  {
    label: '消防器材丢失标注（V1-混合模型）',
    value: '消防器材丢失标注（V1-混合模型）',
  },
  {
    label: '消防器材示例',
    value: '消防器材示例',
  },
]



</script>

<style scoped>
.function-title-wrap{
  font-size: 20px;
  color: rgb(101,102,108);
  letter-spacing: 0;
  line-height: 30px;
  font-weight: 600;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 5px;
  vertical-align: center;
}
</style>
