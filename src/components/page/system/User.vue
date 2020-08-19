<template>
    <div>

        <el-card class="filter-container" shadow="never">
            <div>
                <el-button
                        style="float:right"
                        type="primary"
                        icon="el-icon-search"
                        @click="handleSearch()"
                        size="small">
                    搜索
                </el-button>
                <el-button
                        style="float:right;margin-right: 15px"
                        @click="handleResetSearch()"
                        size="small">
                    重置
                </el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" :model="query" size="small" label-width="140px">
                    <el-form-item label="帐号名称：">
                        <el-input v-model="query.username" class="input-width" placeholder="帐号名称"></el-input>
                    </el-form-item>


                    <el-form-item label="创建时间：" >
                        <el-date-picker
                                style="float: right;z-index: 1"
                                size="small"
                                v-model="queryDate"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="handleDateChange"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>



        <el-card class="operate-container" shadow="never">
            <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
            >批量删除</el-button>
            <el-button
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    class="handle-del mr10"
                    @click="handleAdd"
            >添加</el-button>
        </el-card>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username"  label="用户名" align="center"></el-table-column>
                <el-table-column prop="nickName"  label="昵称" align="center"></el-table-column>
                <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.headUrl"
                            :preview-src-list="[scope.row.headUrl]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status | formatStatus}}
                    </template>

                </el-table-column>

                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column label="手机号" prop="phone" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   type="text"
                                   icon="el-icon-edit"
                                   @click="handleSelectRole(scope.$index, scope.row)">分配角色
                        </el-button>
                        <el-button size="mini"
                                   type="text"
                                   icon="el-icon-edit"
                                   @click="handleSelectAccount(scope.$index, scope.row)">分配帐套
                        </el-button>
                        <el-button size="mini"
                                   type="text"
                                   icon="el-icon-edit"
                                   @click="handleUpdate(scope.$index, scope.row)">
                            编辑
                        </el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>

                    </template>
                </el-table-column>
            </el-table>


        <div class="pagination">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                    layout="total, sizes,prev, pager, next,jumper"
                    :current-page="query.page"
                    :page-size="query.size"
                    :page-sizes="[5,10,15]"
                    :total="total">
            </el-pagination>
        </div>

        <el-dialog
                :title="isEdit?'编辑用户':'添加用户'"
                :visible.sync="dialogVisible"
                width="40%">
            <el-form :model="admin"
                     :rules="rules"
                     ref="admin"
                     label-width="150px" size="small">
                    <el-form-item label="帐号：" prop="username">
                        <el-input v-model="admin.username" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称：" prop="nickName">
                        <el-input v-model="admin.nickName" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="admin.email" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="admin.password"  type="password"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="phone">
                        <el-input v-model="admin.phone"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：" prop="sex">
                        <el-radio-group v-model="admin.sex">
                            <el-radio :label=1>男</el-radio>
                            <el-radio :label=0>女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否激活：" prop="status">
                        <el-radio-group v-model="admin.status">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="admin.remark"
                              type="textarea"
                              :rows="5"
                              style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('admin')" size="small">确 定</el-button>
      </span>
        </el-dialog>

        <el-dialog
                title="分配角色"
                :visible.sync="allocDialogVisible"
                width="30%">
            <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
                <el-option
                        v-for="item in allRoleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
        <el-button @click="allocDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAllocDialogConfirm()" size="small">确 定</el-button>
      </span>
        </el-dialog>



        <el-dialog
                title="分配帐套"
                :visible.sync="allocAccountDialogVisible"
                width="30%">
            <el-select v-model="accountCodes" multiple placeholder="请选择" size="small" style="width: 80%">
                <el-option
                        v-for="item in allAccountList"
                        :key="item.accountCode"
                        :label="item.accountName"
                        :value="item.accountCode">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
        <el-button @click="allocAccountDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAllocAccountDialogConfirm()" size="small">确 定</el-button>
      </span>
        </el-dialog>



    </div>
</template>

<script>
    import { fetchUserData ,listAccountData} from '@/api/index';
    import { formatDate,getFirstTimestamp, getLastTimestamp } from '@/utils/date';
    import {isvalidPass,isvalidPhone,isvalidEmail} from '@/utils/validate';
    import { fetchAllRoleList } from '@/api/system/role';
    import { createUser, deleteUser, listRoleByUserId, updateUser ,allocRole ,allocAccount,listAccountByUserId} from '@/api/system/user';

    const defaultListQuery = {
    username: null,
        endTime:'',
        startTime: '',
    page: 1,
    size: 10
}

const defaultAdmin = {
    id: null,
    username: null,
    password: null,
    nickName: null,
    email: null,
    remark: null,
    status: null,
    phone: null,
    sex: null
};

export default {
    name: 'basetable',
    data() {
        const validatePass = (rule, value, callback) => {
            if (!isvalidPass(value)) {
                callback(new Error('请输入6~18位字符和数字密码!'))
            } else {
                callback()
            }
        };
        const validatePhone= (rule, value, callback) => {
            if (!isvalidPhone(value)) {
                callback(new Error('请输入正确的手机号!'))
            } else {
                callback()
            }
        };
        const validateEmail= (rule, value, callback) => {
            if (!isvalidEmail(value)) {
                callback(new Error('请输入正确的邮箱!'))
            } else {
                callback()
            }
        };
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        let start = new Date();
                        start.setFullYear(start.getFullYear());
                        start.setMonth(start.getMonth());
                        start.setDate(start.getDay());
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一月',
                    onClick(picker) {
                        const end = new Date();
                        let start = new Date();
                        start.setFullYear(start.getFullYear());
                        start.setMonth(start.getMonth());
                        start.setDate(start.getDay());
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            queryDate:'',
            query: Object.assign({},defaultListQuery),
            tableData: [],
            multipleSelection: [],
            dialogVisible: false,
            listLoading:false,
            isEdit: false,
            total: 0,
            form: {},
            allRoleList:[],
            allAccountList:[],
            allocDialogVisible: false,
            allocAccountDialogVisible: false,
            allocRoleIds:[],
            accountCodes:[],
            allocAdminId:null,
            admin: Object.assign({}, defaultAdmin),
            idx: -1,
            id: -1,
            rules: {

                username: [
                    { required: true, message: '请输入帐号名称', trigger: 'blur' },
                    { min: 4, max: 18, message: '请输入4~18位字符用户名!', trigger: 'blur' }
                ],
                password: [
                    { required: true, trigger: 'blur', validator: validatePass }
                ],
                nickName: [
                    { required: true, message: '请输入昵称', trigger: 'blur' }
                ],
                email: [
                    { required: true, trigger: 'blur', validator: validateEmail }
                ],
                phone: [
                    { required: true, trigger: 'blur' , validator: validatePhone }
                ],
                sex: [
                    {  required: true, message: '请选择性别', trigger: 'change' }
                ],
                status: [
                    {  required: true, message: '请选择是否激活', trigger: 'change' }
                ]
            }
        };
    },

    filters: {
        formatTime(time) {
            if (time == null || time === '') {
                return 'N/A';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        },
        formatStatus(value) {
            if (value === 1) {
                return '已激活';
            } else if (value === 2) {
                return '已锁定';
            } else if (value === 3) {
                return '已注销';
            } else if (value === 4) {
                return '账号异常';
            } else {
                return '未激活';
            }
        },
    },
    methods: {
        handleDateChange(){
            this.getData();
        },
        initOrderCountDate(){
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.queryDate=[start,end];
            console.log(this.queryDate)
        },
        handleResetSearch() {
            this.query = Object.assign({}, defaultListQuery);
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.admin = Object.assign({},row);
        },

        handleAdd(index, row) {
            this.dialogVisible = true;
            this.isEdit = false;
            this.admin = Object.assign({},defaultAdmin);
        },

        // 获取 easy-mock 的模拟数据
        getData() {
            this.listLoading=true;
            this.query.startTime = getFirstTimestamp(this.queryDate[0]);
            this.query.endTime = getLastTimestamp(this.queryDate[1]);
            fetchUserData(this.query).then(res => {
                this.listLoading=false;
                this.tableData = res.data.list;
                this.total = res.data.total || 50;
            });
        },
        //分配角色
        handleSelectRole(index,row){
            this.allocAdminId = row.id;
            this.allocDialogVisible = true;
            this.getRoleListByAdmin(row.id);
        },
        //分配帐套
        handleSelectAccount(index,row){
            this.allocAdminId = row.id;
            this.allocAccountDialogVisible = true;
            this.getAccountListByAdmin(row.id);
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let ids=[];
                    let params = new URLSearchParams();
                    ids.push(row.id)
                    params.append("ids",ids);
                    deleteUser(params).then(res =>{
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })


                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //分配角色
        handleAllocDialogConfirm(){
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append("userId", this.allocAdminId);
                params.append("roleIds", this.allocRoleIds);
                allocRole(params).then(response => {
                    this.$message({
                        message: '分配成功！',
                        type: 'success'
                    });
                    this.allocDialogVisible = false;
                })
            })
        },

        //分配帐套
        handleAllocAccountDialogConfirm(){
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append("userId", this.allocAdminId);
                params.append("accountCodes", this.accountCodes);
                allocAccount(params).then(response => {
                    this.$message({
                        message: '分配成功！',
                        type: 'success'
                    });
                    this.allocAccountDialogVisible = false;
                })
            })
        },
        //批量删除
        delAllSelection() {
            console.log(this.multipleSelection)
            if(this.multipleSelection==null || this.multipleSelection.length < 1){
                this.$message({
                    message: '请选择数据',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }


            //批量删除
            this.$confirm('是否要进行删除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                let ids=[];
                for(let i=0;i<this.multipleSelection.length;i++){
                    ids.push(this.multipleSelection[i].id);
                }
                params.append("ids",ids);
                console.log(params)
                deleteUser(params).then(response=>{
                    this.getData();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            })
        },
        //页面编辑
        handleDialogConfirm(admin) {

            this.$refs[admin].validate((valid) => {
                if (valid) {
                        this.$confirm('是否要确认?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            if (this.isEdit) {
                                updateUser(this.admin).then(response => {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.dialogVisible =false;
                                    this.getData();
                                })
                            } else {
                                createUser(this.admin).then(response => {
                                    this.$message({
                                        message: '添加成功！',
                                        type: 'success'
                                    });
                                    this.dialogVisible =false;
                                    this.getData();
                                })
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });



        },

        // 分页导航
        handlePageChange(val) {
            this.query.page = val;
            this.getData();
        },
        // 分页导航
        handleSizeChange(val) {
            this.query.page = 1;
            this.query.size = val;
            this.getData();
        },

        //根据用户ID获取所拥有的角色
        getRoleListByAdmin(userId){
            console.log(userId)
            let params = new URLSearchParams()
            params.append("userId",userId)
            listRoleByUserId(params).then(res=>{
                let allocRoleList = res.data;
                this.allocRoleIds = [];
                if(allocRoleList != null && allocRoleList.length > 0){
                    for(let i =0; i<allocRoleList.length;i++){
                        this.allocRoleIds.push(allocRoleList[i].id)
                    }
                }
            })
        },
        //根据用户ID获取所拥有的帐套
        getAccountListByAdmin(userId){
            let params = new URLSearchParams()
            params.append("userId",userId)
            listAccountByUserId(params).then(res=>{
                let accountList = res.data;
                this.accountCodes = [];
                if(accountList != null && accountList.length > 0){
                    for(let i =0; i<accountList.length;i++){
                        this.accountCodes.push(accountList[i].accountCode)
                    }
                }
            })
        },

        //获取全部角色
        getAllRoleList(){
            fetchAllRoleList().then(res=>{
                this.allRoleList = res.data;
            })
        },
        //获取全部帐套
        getAllAccountList(){
            listAccountData().then(res=>{
                this.allAccountList = res.data;
            })
        }


    },
    created() {
        this.initOrderCountDate();
        this.getData();
        this.getAllRoleList();
        this.getAllAccountList();
    }

};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
