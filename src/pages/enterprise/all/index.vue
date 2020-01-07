<!-- 企业管理 -> 企业审核 -->
<template>
    <section class="">
        <!-- search box -->
        <div class=" clearfix">
            <el-form :inline="true" :model="search" size="small">

                <el-form-item label="">
                    <el-select v-model="search.agentLevel" placeholder="经销商等级" @change="getList(1)" >
                        <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="searchBox">
                    <el-input placeholder="经销商编号/账号/经销商名称/联系人/手机号码" class="w300" size="small" v-model.trim="search.keywords" @keyup.enter.native="getList()"></el-input>
                    <el-button type="primary" class="mgr10" icon="el-icon-search" size="small" @click="getList(1)">查询</el-button>
                    <el-button type="default" size="small" @click="resetSearch()">重置</el-button>
                </el-form-item>
                <el-form-item class="right">
                    <el-button type="primary" size="small" class="right" @click="imports.show = true" v-auth:BUTTON_DEALERINFO_IMPORT>导入</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- table -->
        <yl-table :data="list" :config="config" class="my-table mgb10">
            <el-table-column prop="enterpriseName" :label="props.label" min-width="140" slot-scope="props" :fixed="props.col.fixed" slot="enterpriseName">
                <template slot-scope="scope">
                    <span class="mgl10">{{ scope.row.enterpriseName }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="props.label" width="100" slot-scope="props" :fixed="props.col.fixed" slot="auditStatus">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 'imported' " type="info" size="mini">未开户</el-tag>
                    <span v-else>{{scope.row.auditStatus | typeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="operate" :label="props.label" width="120" slot-scope="props" :fixed="props.col.fixed" slot="operate">
                <template slot-scope="scope">
                    <el-button type="text" @click="delEnterprise(scope.row)" v-auth:BUTTON_DEALERINFO_DELETE v-if="scope.row.status == 'imported' ">删除</el-button>
                    <el-button type="text" @click="gotoDetail(scope.row)" v-auth:BUTTON_DEALERINFO_DETAIL v-else>详情</el-button>
                    <el-button type="text" @click="showHistory(scope.row)" v-auth:BUTTON_DEALERINFO_DETAIL v-if="scope.row.auditStatus == 'audit_success' ">历史</el-button>
                </template>
            </el-table-column>
        </yl-table>
        <!-- page -->
        <yl-pagination :total="page.total" class="right" :pageSize.sync="page.pageSize" :currentPage.sync="page.pageIndex" @change="getList"></yl-pagination>
        <!-- dialog -->
        <div v-if="dialogForm.show">
            <DialogForm :show.sync="dialogForm.show" :dialogData="dialogForm.dialogData" :type="dialogForm.type" :tabType="dialogForm.tabType" @change="getList"></DialogForm>
        </div>
        <!-- 创建企业 -->
        <div v-if="registrationData.show">
            <Registration :show.sync="registrationData.show" :dialogData="registrationData.dialogData" :type="registrationData.type" @change="getList"></Registration>
        </div>

        <!-- 导入 -->
        <!-- <import-excel v-if="imports.show" :show.sync="imports.show" :url="imports.url" :params="imports.params"
                      title="经销商档案导入" @success="execResult"></import-excel> -->
        <!--变更历史-->
        <ChangeAudit v-if="auditObj.show" :show.sync="auditObj.show" :data="auditObj.data" type="view"></ChangeAudit>
    </section>
</template>
<script>
import DialogForm from '../mods/dialog';
import Registration from '../mods/registration';
import commonMix from '@/utils/mixins/commonMix.js';
// import importExcel from '@/components/import-excel/src/main';
import ChangeAudit from '../audit/mods/changeAudit';
import { Tools } from 'ycloud-ui';
const URL = {
    list: 'yhlo.brp.enterprisePlatform.findPageList',
    importExcelData: 'yhlo.brp.enterprisePlatform.importEnt',
    getImportFile: 'yhlo.smc.fileTemplate.getFileUrl',
    del: 'yhlo.brp.enterprisePlatform.deleteEnterprise'
};
let auditStatusData = [{
    value: 'audit_wait',
    label: '草稿'
}, {
    value: 'auditing',
    label: '待审核'
}, {
    value: 'audit_fail',
    label: '审核失败'
}, {
    value: 'audit_success',
    label: '审核成功'
}];
export default {
    name: 'enterpriseAudit',
    mixins: [commonMix],
    data () {
        return {
            activeTab: 'all',
            activeURL: '',
            showAuditStatus: true,
            imports: {
                show: false,
                params: {
                    importsParams: (file) => ({
                        params: file
                    }),
                    downParams: {
                        token: 'enterprise_import_template'
                    }
                },
                url: {
                    imports: URL.importExcelData,
                    downFile: URL.getImportFile // 下载模板文件
                }
            }, // 导入
            levels: [
                {
                    label: '经销商等级',
                    value: '-1'
                }, {
                    label: '经销商',
                    value: '1'
                }, {
                    label: '代理商',
                    value: '2'
                }, {
                    label: '策略经销商',
                    value: '3'
                }
            ],
            search: {
                agentLevel: '-1',
                keywords: ''
            },
            registrationData: {
                show: false,
                dialogData: {},
                type: 'add'
            },
            dialogForm: {
                show: false,
                dialogData: {},
                type: 'view',
                tabType: false
            },
            value: '',
            list: [],
            auditObj: {
                show: false,
                data: null
            },
            config: {
                name: 'enterpriseAll',
                uselocal: true,
                col: [{
                    type: 'index',
                    index: () => (this.page.pageIndex - 1) * this.page.pageSize + 1,
                    label: '序号',
                    width: 50,
                    show: true,
                    align: 'center',
                    unSave: true,
                    fixed: true
                },
                { label: '经销商编号', prop: 'enterpriseNo' },
                { label: '经销商名称', slot: 'enterpriseName' },
                { label: '审核状态', slot: 'auditStatus' },
                { label: '经销商等级', prop: 'levelName', width: 120, align: 'center' },
                { label: '地区', prop: 'regionName' },
                { label: '联系人', prop: 'linkPerson' },
                { label: '手机号码', prop: 'linkPhone' },
                {
                    type: 'operate',
                    slot: 'operate',
                    label: '操作',
                    width: 60,
                    fixed: 'right'
                }
                ]
            }
        };
    },
    filters: {
        typeFilter (str) {
            let result = auditStatusData.filter(item => item.value === str);
            if (result.length) {
                return result[0].label;
            } else {
                return '';
            }
        }
    },
    methods: {
        showHistory (item) {
            this.auditObj = {
                show: true,
                data: item
            };
        },
        // 删除经销商
        delEnterprise (item) {
            this.$confirm('确认删除该经销商吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.Http(URL.del, {
                    enterpriseDto: {
                        enterpriseNo: item.enterpriseNo
                    }
                }).then(result => {
                    this.$message.success('删除成功');
                    this.getList();
                });
            });
        },
        // 重置密码
        resetPassword (row) {
            this.$confirm('确定要重置帐号【' + row.userAccountVo.loginAccount + '】的密码吗？', '重置密码确认', {
                type: 'warning'
            }).then(() => {
                this.Http(URL.resetPwd, {
                    loginAccount: row.userAccountVo.loginAccount
                }).then(result => {
                    this.$message({
                        type: 'success',
                        message: '重置密码成功'
                    });
                    // this.getList();
                }).catch(cal => {});
            });
        },
        // 重置
        resetSearch () {
            this.search = {
                agentLevel: '-1',
                keywords: ''
            };
            this.getList(1);
        },
        execResult (res) {
            this.getList(1);
        },
        // 打开弹框
        gotoDetail (rowData) {
            this.$router.push({
                name: 'enterpriseDetail',
                query: {
                    enterpriseNo: rowData.enterpriseNo,
                    sourceName: this.$route.name,
                    isAduited: '1'
                }
            });
        },

        // 创建编辑弹框企业
        handleRegistration (type, rowData) {
            if (type === 'add') {
                this.registrationData.type = 'add';
                this.registrationData.dialogData = {};
            } else {
                this.registrationData.type = 'edit';
                this.registrationData.dialogData = rowData;
            }
            this.registrationData.show = true;
        },

        // 查询列表数据
        getList (pageIndex = this.page.pageIndex, pageSize = this.page.pageSize) {
            this.Http(URL.list, {
                pageParams: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                },
                params: this.search
            }).then((res) => {
                this.page.total = res.data.total;
                this.page.pageIndex = res.data.pageIndex;
                this.page.pageSize = res.data.pageSize;
                this.list = res.data.rows.map((item, index) => {
                    item.index = (this.page.pageIndex - 1) * this.page.pageSize + index + 1;
                    item.levelName = Tools.getSelectValue(item.agentLevel, this.levels);
                    return item;
                });
            });
        }
    },
    mounted () {
        this.getList();
    },
    components: {
        DialogForm,
        Registration,
        // importExcel,
        ChangeAudit
    }
};

</script>
<style lang="scss" scoped>
</style>
