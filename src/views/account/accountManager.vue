<template>
  <div class="app-container">
    <div align="right">
      <el-button class="add-button" type="text" @click="showDialogNew()">没有账号？点击新增</el-button>
    </div>
    <!-- 表头筛选 -->
    <div class="form">
      <div class="input">
        <el-form :inline="true" :model="formInline" class="form-wrapper">
          <div>
             <el-form-item  label="uid">
              <el-input v-model="formInline.uid" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="账户id">
              <el-input v-model="formInline.account_id" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="cookieToken">
              <el-input v-model="formInline.cookieToken" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="设备id">
              <el-input class="input" v-model="formInline.device_id" placeholder="请输入" ></el-input>
            </el-form-item>
          </div>
         <div>
            <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
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
        <el-table-column prop="uid" label="角色uid" min-width="30%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="accountId" label="账户id" min-width="30%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="cookieToken" label="cookieToken" min-width="90%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="deviceId" label="设备id" min-width="90%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="operation" label="操作" min-width="60%" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="medium" type="primary" @click="signHandle(scope.row)">手动签到</el-button>
            <el-button size="medium" @click="showDialog(scope.row)">编辑</el-button>

              <!-- 编辑账号弹窗 -->
              <el-dialog class="dialog" title="新增/编辑账户" :visible.sync="dialogFormVisible" width="30%">
                <el-form :model="form">
                  <el-form-item label="id" v-show="type===1" :label-width="formLabelWidth">
                    <el-input v-model="form.id" autocomplete="off" style="width:90%;" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="角色uid" :label-width="formLabelWidth">
                    <el-input v-model="form.uid" autocomplete="off" style="width:90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="账户id" :label-width="formLabelWidth">
                    <el-input v-model="form.account_id" autocomplete="off" style="width:90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="cookieToken" :label-width="formLabelWidth">
                    <el-input v-model="form.cookieToken" autocomplete="off" style="width:90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="设备id" :label-width="formLabelWidth">
                    <el-input v-model="form.device_id" autocomplete="off" style="width:90%;"></el-input>
                  </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="updateAccount(form.id, form.uid, form.account_id, form.cookieToken, form.device_id)">确 定</el-button>
                </div>
              </el-dialog>&emsp;
              <!-- 账号编辑弹窗end -->
            
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
      func: '',
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
      form: {
        uid: '',
        account_id: '',
        cookieToken: '',
        device_id: ''
      },
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
    var url = '/genShin/user_info?size=10' + '&page=' + (page - 1)
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
      var url = '/genShin/user_info'
      let params = {}
      if(this.formInline.account_id != ""){
        params.accountId = this.formInline.account_id
      }
      if(this.formInline.cookieToken != ""){
        params.cookieToken = this.formInline.cookieToken
      }
      if(this.formInline.device_id != ""){
        params.deviceId = this.formInline.device_id
      }
      if(this.formInline.uid != ""){
        params.uid = this.formInline.uid
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
      var url = '/genShin/user_info'
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

    signHandle(row){
      var url = '/genShin/sign?id=' + row.id
      this.axios
        .get(url)
        .then(response => {
        this.loading = false
        if(response.data.retcode != -1){
          this.$message({
            message: '签到成功 ( ੭ ˙ᗜ˙ )੭',
            type: 'success'
          });
          this.dialogFormVisible = false
          this.select(1)
        }else{
          this.$message.error(response.data.message);
        }
      })
      .catch(error => {
        this.loading = false
        alert(error)
      })
    },

    // 新增弹窗
    showDialogNew(){
      console.log(this.class)
      this.type = 0
      this.dialogFormVisible = true;
      this.form.id = ''
      this.form.uid = ''
      this.form.account_id = ''
      this.form.device_id = ''
      this.form.cookieToken = ''
      this.func = 'new'
    },

    // 编辑弹窗
    showDialog(row){
      console.log(this.class)
      this.type = 1
      this.dialogFormVisible = true;
      this.form.id = row.id
      this.form.uid = row.uid
      this.form.account_id = row.accountId
      this.form.device_id = row.deviceId
      this.form.cookieToken = row.cookieToken
      this.func = 'update'
    },

    // 编辑按钮
    updateAccount(id, uid, account_id, cookieToken, device_id) {
      var url = '/genShin/user_info'
      let params = {}
      params.id = id
      if(account_id != ""){
        params.accountId = account_id
      }
      if(cookieToken != ""){
        params.cookieToken = cookieToken
      }
      if(device_id != ""){
        params.deviceId = device_id
      }
      if(uid != ""){
        params.uid = uid
      }
      // 新增账号
      if(this.func === "new"){
        this.axios
          .post(url, null, {params: params})
          .then(response => {
          this.loading = false
          if(response.data.retcode != -1){
            this.$message({
              message: '新增成功 ( ੭ ˙ᗜ˙ )੭',
              type: 'success'
            });
            this.dialogFormVisible = false
            this.select(1)
          }else{
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {
          this.loading = false
          alert(error)
        })
      }
      else{
        this.axios
          .put(url, null, {params: params})
          .then(response => {
          this.loading = false
          const h = this.$createElement;
          if(response.data.retcode != -1){
            this.$message({
              message: '修改成功 ( ੭ ˙ᗜ˙ )੭',
              type: 'success'
            });
            this.dialogFormVisible = false
            this.select(1)
          }else{
            this.$message.error(response.data.message);
          }
          this.dialogFormVisible = false
          this.select(1)
        })
        .catch(error => {
          this.loading = false
          alert(error)
        })
      }
      
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
