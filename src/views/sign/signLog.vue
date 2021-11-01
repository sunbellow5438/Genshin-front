<template>
  <div class="app-container">
    <!-- 表头筛选 -->
    <div class="form">
      <div class="input">
        <el-form :inline="true" :model="formInline" class="form-wrapper">
          <div>
             <el-form-item  label="账户id">
              <el-input v-model="formInline.accountId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="结果">
              <el-input v-model="formInline.response" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="formInline.status" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="时间">
              <el-input class="input" v-model="formInline.datetime" placeholder="请输入" ></el-input>
            </el-form-item>
          </div>
         <div>
            <el-form-item>
            <el-button type="primary" @click="onSubmit()">查询</el-button>
            <el-button @click="reSet">重置</el-button>
          </el-form-item>
         </div>
         
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        :row-style="{height:'60px'}"
        :border="true"
        style="width: 100%">
        <el-table-column prop="accountId" label="账户id" min-width="30%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="response" label="结果" min-width="90%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="status" label="状态" min-width="20%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="datetime" label="时间" min-width="90%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="operation" label="操作" min-width="20%" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="medium" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </p>
    <!-- 分页 -->
    <el-pagination
      align="center"
      background
      layout="prev, pager, next"
      v-show="total>0" :total="total" 
      :page.sync="listQuery.page" 
      @current-change="(current)=>{select(current)}"
      >
     
    </el-pagination>
  </div>


</template>

<script>
import {isEmpty } from 'lodash';
export default {
  data() {
    return {
      loading: false,
      //表格数据
      tableData: [],
      // 分页器
      total: 10,
      listQuery: {
        page: 1,
        limit: 10
      },
      // 输入框
      formInline: {
        uid: '',
        account_id: '',
        cookieToken: '',
        device_id: ''
      },
      // 新增/编辑弹窗
      dialogFormVisible: false,
      // type用于控制dialog是否显示id输入框
      type : 0,
      formLabelWidth: '100px'


    }
  },

  mounted: function() {},

  created() {
    // this.getList()
    this.select(1)
  },

  methods: {
    // 分页查询
    select(page){
    var url = '/genShin/signLogs?size=10' + '&page=' + (page - 1)
    this.loading = true
    this.axios
      .get(url)
      .then(response => {
        this.tableData = response.data.data.content
        this.total = response.data.data.total
        this.loading = false
      })
      .catch(error => {
        this.loading = false
        alert(error)
      })
    },

    // 通过条件查询
    onSubmit() {
      var url = '/genShin/signLogs'
      let params = {}
      if(this.formInline.accountId != ""){
        params.accountId = this.formInline.accountId
      }
      if(this.formInline.response != ""){
        params.response = this.formInline.response
      }
      if(this.formInline.status != ""){
        params.status = this.formInline.status
      }
      if(this.formInline.datatime != ""){
        params.datatime = this.formInline.datatime
      }
      
      this.axios
        .get(url, {params: params})
        .then(response => {
        this.tableData = response.data.data.content
        this.total = response.data.data.total
        this.loading = false
      })
      .catch(error => {
        this.loading = false
        alert(error)
      })
      },
    
    // 重置按钮
    reSet() {
      var url = '/genShin/signLogs'
      this.axios
        .get(url)
        .then(response => {
        this.$router.go(0)
        this.formInline = ''
        // this.tableData = response.data.data.content
        // this.total = response.data.data.total
        // this.loading = false
        })
        .catch(error => {
          this.loading = false
          alert(error)
        })
    },



    // 删除按钮
    handleDelete(row) {
      var url = '/genShin/user_info?' + 'id=' + row.id
      this.axios
        .delete(url)
        .then(response => {
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          alert(error)
        })
      this.$alert('删除成功', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.go(0)
        }
      });
      },

    page_change() {
      console.log("")
    }
    }
}
</script>

<style>
/* 头部样式 */
.el-header{
    background-color: #ffffff;
    text-align: center;
    line-height: 20px;
    margin: 0px;
    padding: 0px;

  }

.el-button{
  background: #ffffff;
}
.el-button:hover{
    background-color: #ffb99f;
    color: #606266;
  }
.el-button:focus{
    background-color: #ffb99f;
    color: #606266;  
  }

.el-button--danger{
  background: #ff0000;

}

.el-button--primary{
  background: #f96c38;
  border-color: #f96c38;
}

.el-button--primary:hover{
    background-color: #f96c38;
    border-color: #f96c38;  
  }
.add-button:hover{
  background-color: #ffffff;
}

.add-button:focus{
    background-color: #ffffff;
  }

/* 表头样式 */
.form{
  width: 100%;
  padding: 10px;
  margin: 10px auto;
  display: flex;
  /*实现垂直居中*/
  /* align-items: center; */
  /*实现水平居中*/
  justify-content: center;
  box-shadow:1px 0px 3px rgba(116, 111, 111, 0.5);

}

/* 输入框样式 */
.input{
  margin-top: 0px;
  margin-bottom: -22px;
  width: 100%;
}

.form-wrapper{
  display: flex;
  justify-content: space-between;
}

/* 表格样式 */
.table{
  box-shadow:1px 0px 3px rgba(116, 111, 111, 0.5);
}

</style>>
