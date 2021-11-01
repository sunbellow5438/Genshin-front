<template>
  <div class="app-container">
    <div align="right">
      <el-button class="add-button" type="primary" @click="showDialogNew(1)">新增定时任务</el-button>
    </div><br>
    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        :row-style="{height:'60px'}"
        :border="true"
        style="width: 100%">
        <el-table-column prop="uid" label="角色uid" min-width="30%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="cronExpression" label="运行时间" min-width="30%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="90%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" min-width="30%" header-align="center" align="center">
        </el-table-column>

        <el-table-column prop="status" label="状态" min-width="20%" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateAccount(scope.row.id, scope.row.uid, scope.row.remark, scope.row.cronExpression, scope.row.status)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="operation" label="操作" min-width="40%" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="medium" @click="showDialog(scope.row)">编辑</el-button>

              <!-- 编辑弹窗 -->
              <el-dialog class="dialog" title="新增/编辑" :visible.sync="dialogFormVisible" width="30%">
                <el-form :model="form">
                  <el-form-item label="id" v-show="type === 1" :label-width="formLabelWidth">
                    <el-input v-model="form.id" autocomplete="off" style="width:90%;" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="角色uid" :label-width="formLabelWidth">
                    <el-input v-model="form.uid" v-bind:disabled="type!=0" style="width:90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input v-model="form.remark" autocomplete="off" style="width:90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="运行时间(corn)" :label-width="formLabelWidth">
                    <el-input v-model="form.cronExpression" autocomplete="off" style="width:90%;"></el-input>
                  </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="updateAccount(form.id, form.uid, form.remark, form.cronExpression, scope.row.status)">确 定</el-button>
                </div>
              </el-dialog>&emsp;
              <!-- 编辑账号弹窗end -->
            
            <el-button size="medium" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>


</template>

<script>
import {isEmpty } from 'lodash';
export default {
  data() {
    return {
      func: '',
      loading: false,
      //表格数据
      tableData: [],

      // 新增/编辑弹窗
      dialogFormVisible: false,
      form: {
        uid: '',
        account_id: '',
        remark: '',
        cronExpression: '',
        createTime: ''
      },
      // type用于控制dialog是否显示id输入框     
      type: 0,
      formLabelWidth: '110px'


    }
  },

  mounted: function() {},

  created() {
    // this.getList()
    this.select()
  },

  methods: {
    // 分页查询
    select(){
    var url = '/genShin/schedule'
    this.loading = true
    this.axios
      .get(url)
      .then(response => {
        // 把接口返回的status转化为布尔值
        let resultData = []
        resultData = response.data.data
        for(var i = 0; i < resultData.length; i++) {
          if(resultData[i].status === 1){
            resultData[i].status = true
          }
          else{
            resultData[i].status = false
          }
          }
        this.tableData = resultData
        this.loading = false
      })
      .catch(error => {
        this.loading = false
        alert(error)
      })
    },

    
    // 新增定时任务
    addSchedule(uid, account_id, cookieToken, device_id){
      var url = '/genShin/user_info'
      let json = {}
      json.uid = uid
      json.accountId = account_id
      json.cookieToken = cookieToken
      json.deviceId = device_id
      this.axios
        .post(url, json)
        .then(response => {
        this.loading = false
        if(response.data.retcode != -1){
          const h = this.$createElement;
          this.$message({
            message: '新增成功 ( ੭ ˙ᗜ˙ )੭',
            type: 'success'
          });
          this.dialogFormVisible = false
        this.select(1)
        }else{
          console.log(response.data.message)
          this.$message.error(response.data.message);
        }
      })
      .catch(error => {
        this.loading = false
      })

    },

    // 新增弹窗
    showDialogNew(){
      this.type = 0
      this.dialogFormVisible = true
      this.form.id = ''
      this.form.uid = ''
      this.form.remark = ''
      this.form.cronExpression = ''
      this.func = "new"
    },

    // 编辑弹窗
    showDialog(row){
      this.type = 1
      this.dialogFormVisible = true
      this.form.id = row.id
      this.form.uid = row.uid
      this.form.remark = row.remark
      this.form.cronExpression = row.cronExpression
      this.func = "update"
    },

    // 编辑按钮
    updateAccount(id, uid, remark, cronExpression, status) {
      let json = {}
      json.uid = uid
      json.remark = remark
      json.cronExpression = cronExpression
      console.log(this.func)
      // 如果是新增
      if(this.func === "new"){
        var url = '/genShin/schedule'
        json.status = 0
        this.axios
          .post(url, json)
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
          this.dialogFormVisible = false
          this.select(1)
        })
        .catch(error => {
          this.loading = false
          alert(error)
        })
      }
      // 如果是修改
      else{
        var url = '/genShin/schedule/update'
        json.id = id
        if(status === true){
          json.status = 1
        }
        else{
          json.status = 0
        }
        this.axios
          .put(url, json)
          .then(response => {
          this.loading = false
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
      var url = '/genShin/schedule/delete'
      let json = row.id
      this.axios
        .delete(url, json)
        .then(response => {
          this.loading = false
          if(response.data.retcode != -1){
            this.$alert('删除成功', '删除', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.go(0)
              }
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
