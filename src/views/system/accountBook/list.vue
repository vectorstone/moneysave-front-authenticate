<template>
  <div>
    <div style="margin: 15px">
      <el-button type="primary" @click="handleUpload">upload<i class="el-icon-upload el-icon-right"></i></el-button>
      <el-button type="primary" @click="handleDownload">download<i class="el-icon-download el-icon-right"></i></el-button>
      <!-- <el-button size="mini" type="success" @click="handleSaveFather()">新增父节点</el-button> -->
    </div>
    <div>
      <!-- 条件选择范围 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 时间选择器 startTime,endTime-->
            <div class="block">
              <!--<span class="demonstration">Default</span>-->
              <el-date-picker v-model="dateList" type="datetimerange" range-separator="To"
                              start-placeholder="Start date"
                              end-placeholder="End date"
                              value-format="yyyy-MM-dd HH:mm:SS">
              </el-date-picker>

            </div>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <!--金额amount-->
            <el-input placeholder="input the valve amount" v-model="searchVo.amount"></el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <!--支付方式label-->
            <el-select v-model="searchVo.label" placeholder="pay methods">
              <el-option
                v-for="item in payMethodList"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <!--备注remark-->
            <el-input placeholder="fuzzy query remark" v-model="searchVo.remark"></el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </div>
    <div style="margin: 10px">
      <!--category类别-->
      <el-select v-model="searchVo.category" placeholder="category" style="margin-right: 10px"
                 value-key="value"
                 @change="changeCategory"
      @focus="getDictsByPid">
        <el-option
          v-for="item in categoryList"
          :label="item.name"
          :value="item"
        >
        </el-option>
      </el-select>

      <el-select v-model="searchVo.subcategory" placeholder="subcategory">
        <el-option
          v-for="item in subcategoryList"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
      <el-button type="primary" @click="search" style="margin-left: 10px">search</el-button>
      <el-button type="danger" @click="clearData" style="margin-left: 10px">clear</el-button>
      <el-button type="primary"  @click="handleAdd" style="margin-left: 10px">add</el-button>
    </div>

    <!-- 导入表格控件,用来展示字典数据 -->
    <div >
    <el-table :data="list" style="width: 100%" row-key="id" border lazy  >
      <el-table-column label="No" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="type" width="60" align="center"></el-table-column>
      <el-table-column prop="amount" label="amount" width="80" align="center"></el-table-column>
      <el-table-column prop="category" label="category" align="center" width="100">
      </el-table-column>
      <el-table-column prop="subcategory" label="subcategory" align="center" width="120"></el-table-column>
      <!--<el-table-column prop="book" label="ledger" width="180"></el-table-column>-->
      <el-table-column prop="remark" label="remark" align="center"></el-table-column>
      <el-table-column prop="label" label="pay method" width="100" align="center"></el-table-column>
      <el-table-column prop="createTime" label="Date" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handleAdd" style="margin-left: 10px">add</el-button>
        <el-button type="warning" size="small" @click="handleEdit(scope.row)" style="margin-left: 10px">edit</el-button>
        <el-button type="danger" size="small" @click="handleDelete(scope.row.id)" style="margin-left: 10px">delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!--分页控件-->
    <div style="text-align: center;margin: 10px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange"
        :page-size="pageSize">
      </el-pagination>
    </div>
    <!-- 导入新增和修改的对话框 -->
    <el-dialog :title="title" :visible.sync="dialogTableVisible">
      <el-form label-position="left" label-width="100px">
        <el-form-item property="type" label="type" width="150">
          <!--<el-input v-model="book.type" autocomplete="off"></el-input>-->
          <el-select v-model="book.type" placeholder="类别" style="margin-right: 10px">
            <el-option label="支出" value="支出"></el-option>
            <el-option label="收入" value="收入"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item property="amount" label="amount" >
          <el-input v-model="book.amount" autocomplete="off" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item property="category" label="category" width="150">
          <!--<el-input v-model="book.category" autocomplete="off"></el-input>-->
          <el-select v-model="book.category" placeholder="支出大类" style="margin-right: 10px" value-key="value"
                     @change="updateOrSaveChangeCategory"
                     @focus="getDictsByPid">
            <el-option
              v-for="item in categoryList"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>

          <el-select v-model="book.subcategory" placeholder="支出子类" >
            <el-option
              v-for="item in subcategoryList"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item property="subcategory" label="subcategory" width="150">
          <el-input v-model="book.subcategory" autocomplete="off"></el-input>
        </el-form-item>-->

        <el-form-item property="remark" label="remark" width="150">
          <el-input v-model="book.remark" autocomplete="off" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item property="label" label="label" width="150">
          <!--<el-input v-model="book.label" autocomplete="off"></el-input>-->
          <el-select v-model="book.label" placeholder="pay methods" style="margin-right: 10px">
            <el-option label="wechat" value="微信"></el-option>
            <el-option label="debit card" value="银行卡"></el-option>
            <el-option label="credit card" value="信用卡"></el-option>
            <el-option label="Alipay" value="支付宝"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateOrSave">取 消</el-button>
        <el-button type="primary" :disabled="disabledSubmitButton" @click="saveOrUpdate">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 导入上传文件的对话框 -->
    <el-dialog title="import Excel data" :visible.sync="dialogFormVisible">
      <el-upload class="upload-demo" drag :action="uploadPath" :on-preview="handlePreview" :on-success="uploadSuccess"
                 :on-error="uploadError" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          jpg/png files with a size less than 500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/system/accountBook";
import dictApi from '@/api/system/dict'

export default {
  data() {
    return {
      title: '',
      dict: {},
      //控制修改和新增窗口的开启和关闭
      dialogTableVisible: false,
      dicts: [],
      //控制上传的窗口的开启和关闭
      dialogFormVisible: false,
      //控制上传的文件传输的服务器的地址
      uploadPath: process.env.VUE_APP_BASE_API + "/admin/book/import/",
      dateList: [], //这是一个存有起始和结束日期的数组
      searchVo: {
        category: '',
        subcategory: '',
      },
      pageNum: 1,
      pageSize: 30,
      list: [],
      total: 100,
      categoryList: [],
      subcategoryList: [],
      payMethodList: [],
      book: {
        category: '',
        subcategory: 'ccccc',
      },
      disabledSubmitButton: false,
    };
  },
  watch:{
    'book.label'(newValue){
      console.log(newValue)
    }
  },
  created() {
    this.fetchData();
    this.getDictsByPid();
    this.getPayMethods();
  },
  methods: {
    cancelUpdateOrSave(){
      this.dialogTableVisible = false
      this.book = {}
      this.subcategoryList = []
      this.categoryList = []
    },
    updateOrSaveChangeCategory(category){
      //当消费大类发生变更的时候,要将子项清空
      this.book.subcategory = null
      this.book.category = category.name
      //根据传过来的pid查询对应的消费子类
      dictApi.getByPid(category.id).then(res=>{
        this.subcategoryList = res.data.items
      })
    },
    //直接将select里面当前的category传过来
    changeCategory(category){
      //当消费大类发生变更的时候,要将子项清空
      this.searchVo.subcategory = null
      this.searchVo.category = category.name
      //根据传过来的pid查询对应的消费子类
      dictApi.getByPid(category.id).then(res=>{
        this.subcategoryList = res.data.items
      })
    },
    //获取支付方式集合
    getPayMethods(){
      //这个id是数据库里面查出来的,不要问我为什么
      dictApi.getByPid(170000).then(res=>{
        this.payMethodList = res.data.items
      })
    },
    //更新分页的页码
    currentChange(val) {
      this.pageNum = val
      this.fetchData()
    },
    //执行带条件的查询
    search() {
      //完成search对象的起始和结束日期的赋值
      this.searchVo.startTime = this.dateList[0]
      this.searchVo.endTime = this.dateList[1]
      this.fetchData()
    },
    //清除查询条件
    clearData() {
      this.searchVo = {}
      this.fetchData()
    },
    //查询分页数据
    fetchData() {
      api.getPageList(this.pageNum, this.pageSize, this.searchVo).then(res => {
        this.list = res.data.items.records
        this.total = Number(res.data.items.total)
      })
    },
    //根据pid获取数据字典
    getDictsByPid(){
      dictApi.getByPid(1).then(res=>{
        this.categoryList = res.data.items
        //将查询到的数据字典的最后一个删除(也就是支付方式),这个支付方式不算是消费的类别,但是也加到了数据字典里面
        //不希望在消费类别的选项里面看到这个支付方式
        this.categoryList.pop()
      })
    },
    //save or update
    saveOrUpdate(){
      //禁用提交按钮,避免重复提交
      this.disabledSubmitButton = true
      //关闭对话框
      this.dialogTableVisible = false

      //清空这两个集合,否则搜索里面有内容
      this.subcategoryList = []
      this.categoryList = []

      //判断一下到底是新增还是修改
      if(this.book.id){
        //进来这里面说明book存在,所以是修改
        api.updateById(this.book).then(res=>{
          this.$message.success(res.message || '修改成功')
          this.fetchData()
          this.disabledSubmitButton = false
        })
      }else{
        //进来这里面,说明book不存在,所以是新增
        api.save(this.book).then(res=>{
          this.$message.success(res.message || '新增成功')
          this.fetchData()
          this.disabledSubmitButton = false
        })
      }
    },
    //新增
    handleAdd(){
      this.dialogTableVisible = true
      this.title = 'New'
      //不初始化book的这两个属性的话,子类的下拉选择框不起作用
      this.book = {
        category: '',
        subcategory: ''
      }
    },
    //修改
    handleEdit(book){
      console.log(book)
      this.dialogTableVisible = true
      this.title = 'update'
      this.book = book
    },
    //删除的方法
    handleDelete(id) {
      this.$confirm('该操作将永久删除数据,您确定吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.removeById(id).then(res => {
          this.$message.success(`删除${res.message}` || '成功')
          this.fetchData()
          // window.location.reload() 这是之前的dict里面有子tree的时候,fetchData不生效,现在这个普通的表格没有这个问题
        })
      }).catch(() => {
        this.$message.info('取消成功')
      })
    },
    //文件上传成功后应该执行的方法
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        //说明上传成功
        this.$message.success(response.message || "上传成功");
      } else {
        //说明上传失败,这个地方服务器响应的报文的状态码仍是200
        this.$message.error("上传失败");
      }
      this.dialogFormVisible = false;
    },
    //这个地方的失败是,服务器响应报文的状态码不是200的时候回调的方法
    uploadError(err, file, fileList) {
      this.$message.error("上传失败");
      this.dialogFormVisible = false;
    },
    //真正的上传的按钮执行的方法
    handlePreview() {
    },
    //单击外面的上传按钮后执行的动作,让上传框弹出来
    handleUpload() {
      this.dialogFormVisible = true;
    },
    handleDownload() {
      //点击下载按钮后执行的动作
      window.location = process.env.VUE_APP_BASE_API + "/admin/book/export";
    },
  }
};
</script>
