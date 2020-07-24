<template>
    <div>

        <el-card class="filter-container" shadow="never">
            <div class="handle-box">
                <span>用户名: </span><el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>

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
                                   @click="handleSelectRole(scope.$index, scope.row)">分配角色
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
                     ref="adminForm"
                     label-width="150px" size="small">
                    <el-form-item label="帐号：">
                        <el-input v-model="admin.username" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称：">
                        <el-input v-model="admin.nickName" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：">
                        <el-input v-model="admin.email" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：">
                        <el-input v-model="admin.password"  type="password"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <el-input v-model="admin.phone"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="admin.note"
                                  type="textarea"
                                  :rows="5"
                                  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：">
                        <el-radio-group v-model="admin.sex">
                            <el-radio :label=1>男</el-radio>
                            <el-radio :label=0>女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否激活：">
                        <el-radio-group v-model="admin.status">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
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
    </div>
</template>

<script>
    import { fetchUserData } from '@/api/index';
    import { formatDate } from '@/utils/date';
    import { fetchAllRoleList } from '@/api/role';
    import { createUser, deleteUser, getRoleByAdmin, updateUser ,allocRole} from '@/api/user';

    const defaultListQuery = {
    username: null,
    page: 1,
    size: 10
}

const defaultAdmin = {
    id: null,
    username: null,
    password: null,
    nickName: null,
    email: null,
    note: null,
    status: 1,
    sex: null
};

export default {
    name: 'basetable',
    data() {
        return {
            query: Object.assign({},defaultListQuery),
            tableData: [],
            multipleSelection: [],
            dialogVisible: false,
            listLoading:false,
            isEdit: false,
            total: 0,
            form: {},
            allRoleList:[],
            allocDialogVisible: false,
            allocRoleIds:[],
            allocAdminId:null,
            admin: Object.assign({}, defaultAdmin),
            idx: -1,
            id: -1
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
            fetchUserData(this.query).then(res => {
                this.listLoading=false;
                this.tableData = res.data.list;
                this.total = res.data.total || 50;
            });
        },
        handleSelectRole(index,row){
            console.log(index)
            console.log(row)
            this.allocAdminId = row.id;
            this.allocDialogVisible = true;
            this.getRoleListByAdmin(row.id);
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
        handleDialogConfirm() {
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
            getRoleByAdmin(params).then(res=>{
                let allocRoleList = res.data;
                this.allocRoleIds = [];
                if(allocRoleList != null && allocRoleList.length > 0){
                    for(let i =0; i<allocRoleList.length;i++){
                        this.allocRoleIds.push(allocRoleList[i].id)
                    }
                }
            })
        },

        //获取全部角色
        fetchAllRoleList(){
            fetchAllRoleList().then(res=>{
                this.allRoleList = res.data;
            })
        }


    },
    created() {
        this.getData();
        this.fetchAllRoleList();
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
