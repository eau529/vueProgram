<template>
<!-- <div style="margin-bottom: 20px;">
  <el-button
    size="small"
    @click="addTab(editableTabsValue)"
  >
    add tab
  </el-button>
</div> -->

<el-tabs @click="setActiveItem"  v-model="editableTabsValue" type="card" >
<template v-for="(item) in editableTabs" 
 
    :label="item.title"
    :name="item.name"
    >

  <!-- 单个标签页样式 -->
  <template  >
  
    <el-tab-pane  
    v-if="item.name>0"
  >
   <template #label  >
       <el-image  class="a1"  style="width:100px;height:100px"
                :src="editableTabs[item.name].url"
                v-if="item.name-1==editableTabsValue"
                >
        </el-image>
        <el-image  style="width:100px;height:100px"
                :src="editableTabs[item.name].url"
                v-if="item.name-1!=editableTabsValue"
                >
        </el-image>
    </template>         
  </el-tab-pane>
  </template>

</template>
</el-tabs>


  <!-- 走马灯 -->
<el-row>
  <el-carousel :interval="50000000" arrow="always" style="width:80%" height="550px" indicator-position="none"  trigger="click" ref="carousel" @change="changeIndex" >
  <!-- temp只能包含单个el元素 -->
  <template v-for="(item) in editableTabs"
    :key="item.name"
    :label="item.title"
    :name="item.name">
    <el-carousel-item  v-if="item.name>0" style="text-align: center;"
    >
          <el-image 
        style="height:100%;position: flex;" 
        :src="editableTabs[item.name].url"
        >
        </el-image>   

      
    </el-carousel-item>
    </template>
    
  </el-carousel>



  <el-table
    :data="tableData"
    style="width: 20%;height: 550px;"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="tag"
      label="标签"
      width="155"
      >
    
    </el-table-column>
    <el-table-column
      prop="confidence"
      label="置信度"
      width="155">
    </el-table-column>
  </el-table>
</el-row>

</template>

<script>




 export default {
    name: "child",
	  props: ["fileList"],
    data() {
      return {
        editableTabsValue: '2',
        tableData:[
          {
            tag:"火焰",
            confidence:"96%"
          },
          {
            tag:"消防栓",
            confidence:"89%"
          }
        ],
        editableTabs: [{
          tab: 'Tab 0',
          name: 0,
          url:'src\\assets\\img\\login-bg.jpg'
        }
        ],
        tabIndex: 2,
        a1:"a1",
        f1:"f1",  
        isActive: true, 
        error: null,
        ys1:true,
        ys2:false,
      }
    },

    methods: {
      init(){
        //data数组的添加要用自带的api，直接赋值不会给你创建数组
        console.log('init方法启动');
        // this.editableTabs.splice(0,1);
        
        for(var i=1;i<36;i++){
          this.editableTabs.push({
          name: i,
          tab:'90'+i+'%',
          url:'src\\assets\\Datacluster Fire and Smoke Sample\\Datacluster Fire and Smoke Sample ('+i+').jpg'
        });
        }
        // this.editableTabs.shift();
        console.log(this.editableTabs.url);
      },
      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      },

      consoleLog(){
        console.log(this.editableTabsValue)
      },

      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
       
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      changeIndex(e){
        this.editableTabsValue=e
      },
       setActiveItem(){
	      this.$refs.carousel.setActiveItem(this.editableTabsValue);
        // alert(this.editableTabsValue);
	    },

  

    },

     created() {
        this.init() //接收参数
    },

  ready () {
        this.$watch('fileList', function(newVal, oldVal){
            console.log('newVal');//这里再感受下值拿到了没
        });
    },
    computed: {
 
  }

  }
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .fl{
    display: flex;
    justify-content: space-around;
  }
   .a1{
    border: 1.5px blue ridge;
    width: 80%;
    height: 600px;
   
  } 
  .type{
	  background: #f0f0f0;
	  color: #7c7c7c;
	}
	.type_tips{
	  background: #17a4fc;
	  color: #fff;	
	}

</style>