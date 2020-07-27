<template>
    <div>

        <el-card class="filter-container" shadow="never">
            <div class="handle-box">
                <span>帐套编码: </span><el-input v-model="query.accountCode" placeholder="帐套编码" class="handle-input mr10"></el-input>

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
                <el-table-column  label="ID" prop="id" width="55" align="center"></el-table-column>
                <el-table-column  label="帐套编码" prop="accountCode"  align="center"></el-table-column>
                <el-table-column  label="帐套名称" prop="accountName"  align="center"></el-table-column>
                <el-table-column label="公司名称" prop="companyName" align="center"></el-table-column>
                <el-table-column label="纳税识别号" prop="taxNumber" align="center"></el-table-column>
                <el-table-column label="地址" prop="address" align="center"></el-table-column>
                <el-table-column label="电话" prop="phone" align="center"></el-table-column>
                <el-table-column label="开户银行" prop="bankAccount" align="center"></el-table-column>
                <el-table-column label="银行卡号" prop="bankCardNumber" align="center"></el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">

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
                :title="isEdit?'编辑帐套':'添加帐套'"
                :visible.sync="dialogVisible"
                width="40%">
            <el-form :model="account"
                     ref="accountForm"
                     label-width="150px" size="small">
                    <el-form-item label="帐套编码：">
                        <el-input v-model="account.accountCode" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="帐套名称：">
                        <el-input v-model="account.accountName" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="公司名称：">
                        <el-input v-model="account.companyName" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="纳税识别号：">
                        <el-input v-model="account.taxNumber"   style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="地址：">
                        <el-input v-model="account.address"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="电话：">
                        <el-input v-model="account.phone"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行：">
                        <el-input v-model="account.bankAccount"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="银行卡号：">
                        <el-input v-model="account.bankCardNumber"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="account.remark"
                                  type="textarea"
                                  :rows="5"
                                  style="width: 250px"></el-input>
                    </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchAccountData } from '@/api/index';
    import { formatDate } from '@/utils/date';
    import { fetchAllRoleList } from '@/api/role';
    import { createAccount, deleteAccount,  updateAccount} from '@/api/account';

    const defaultListQuery = {
    accountCode: null,
    page: 1,
    size: 10
}

const defaultAccount = {
    id: null,
    accountCode: null,
    accountName: null,
    companyName: null,
    taxNumber: null,
    address: null,
    phone: null,
    bankCardNumber: null,
    remark: null,
    bankAccount: null
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
            account: Object.assign({}, defaultAccount),
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
    },
    methods: {
        handleResetSearch() {
            this.query = Object.assign({}, defaultListQuery);
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.account = Object.assign({},row);
        },

        handleAdd(index, row) {
            this.dialogVisible = true;
            this.isEdit = false;
            this.account = Object.assign({},defaultAccount);
        },

        // 获取 easy-mock 的模拟数据
        getData() {
            this.listLoading=true;
            fetchAccountData(this.query).then(res => {
                this.listLoading=false;
                this.tableData = res.data.list;
                this.total = res.data.total || 50;
            });
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
                    deleteAccount(params).then(res =>{
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
                deleteAccount(params).then(response=>{
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
                    updateAccount(this.account).then(response => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible =false;
                        this.getData();
                    })
                } else {
                    createAccount(this.account).then(response => {
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
