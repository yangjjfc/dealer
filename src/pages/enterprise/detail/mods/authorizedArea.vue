<!--授权区域-->
<template>
    <el-row>
        <el-col :offset="2" :span="20">
            <div class="enterprise-bill">
                <div class="mgb10">
                    <el-tree class="myTree" ref="scopeTree" :style="{height: tableHeight + 'px'}" :data="isEdit ? allTree : salesAreaVos"
                             :show-checkbox="isEdit" default-expand-all node-key="no" :expand-on-click-node="false" :default-checked-keys="areaCheckeds" :props="defaultProps" v-loading="isLoading">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <template v-if="!isEdit && !data.children">
                        <el-tag v-if="data.no === masterArea" type="danger" size="mini">默认区域</el-tag>
                        <el-button v-else type="text" size="mini" @click="() => updateMaster(data)">设为默认</el-button>
                    </template>
                </span>
                    </el-tree>
                </div>
                <div class="searchBox text-center">
                    <el-form size="small" >
                        <el-form-item>
                            <el-button type="primary" size="small" v-if="!isEdit" @click="edit">修改授权</el-button>
                            <template v-else>
                                <el-button type="primary" size="small" class="mgr10" @click="save">保存</el-button>
                                <el-button size="small" @click="isEdit = false">取消修改</el-button>
                            </template>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import commonMix from '@/utils/mixins/commonMix.js';
const URL = {
    detail: 'yhlo.brp.enterpriseLicense.find', // 厂商查询员工
    editTree: 'yhlo.brp.enterpriseLicense.findAreasTree', // 修改授权时那棵树
    updateMaster: 'yhlo.brp.enterpriseLicense.updateMaster', // 修改默认
    saveArea: 'yhlo.brp.enterpriseLicense.saveArea' // 保存授权区域
};
export default {
    mixins: [commonMix],
    data () {
        return {
            salesAreaVos: [],
            isEdit: false,
            masterArea: '',
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            areaCheckeds: [],
            allTree: []
        };
    },
    components: {
        // InvoiceDetail
    },
    props: {
        enterpriseNo: {
            type: String,
            required: true
        }
    },
    methods: {
        // 设置摩恩授权区域
        updateMaster (data) {
            this.$confirm('确认要修改默认授权区域吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.isLoading = true;
                    this.Http(URL.updateMaster, {
                        enterpriseNo: this.enterpriseNo,
                        areaNo: data.no
                    }).then(() => {
                        this.isLoading = false;
                        this.$message.success('操作成功');
                        this.getDetail();
                    });
                })
                .catch(() => {});
        },
        // 修改授权区域
        edit () {
            this.isEdit = true;
            this.isLoading = true;
            this.Http(URL.editTree, {
                dto: {
                    enterpriseNo: this.enterpriseNo,
                    status: 'audit_success'
                }
            }).then(res => {
                this.isLoading = false;
                this.allTree = res.data;
                this.getCheckeds(this.allTree, (this.areaCheckeds = []));
            });
        },
        // 保存授权区域修改
        save () {
            let salesAreaVos = this.$refs.scopeTree.getCheckedKeys(true);
            this.isLoading = true;
            this.Http(URL.saveArea, {
                dto: {
                    enterpriseNo: this.enterpriseNo,
                    salesAreaVos
                }
            }).then(res => {
                this.$message.success('操作成功');
                this.getDetail();
            }).finally(res => {
                this.isEdit = false;
                this.isLoading = false;
            });
        },
        // 获取已选中的key
        getCheckeds (list, result) {
            list.forEach(item => {
                item.checked && result.push(item.no);
                item.children && this.getCheckeds(item.children, result);
            });
        },
        // 获取授权区域详情
        getDetail () {
            this.isLoading = true;
            this.Http(URL.detail, {
                enterpriseNo: this.enterpriseNo
            }).then(res => {
                this.isLoading = false;
                this.masterArea = res.data.masterArea || '';
                this.salesAreaVos = res.data.salesAreaVos || [];
            });
        }
    },
    created () {
        this.getDetail();
    }
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
    .myTree{
        margin-bottom: 12px; overflow: auto;
    }
</style>
