<!--发票信息-->
<template>
    <div class="">
        <div class="enterprise-bill">
            <div class="searchBox clearfix">
                <el-form size="small" inline class="right">
                    <el-form-item>
                        <el-button type="primary" size="small" @click="getList">刷新</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <yl-table :data="list" :config="config">
                <el-table-column prop="isMaster" :label="props.label" slot-scope="props" :fixed="props.col.fixed" slot="isMaster" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isMaster === 1">是</span>
                        <span v-else class="text-danger">否</span>
                    </template>
                </el-table-column>
            </yl-table>
        </div>
        <div v-if="dialogForm.show">
            <InvoiceDetail :show.sync="dialogForm.show" :id="dialogForm.id"></InvoiceDetail>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import InvoiceDetail from './invoiceDetail';
import { emitter } from 'ycloud-ui';

const URL = {
    list: 'yhlo.brp.enterpriseInvoiceManager.getByNo'
};
export default {
    mixins: [emitter],
    data () {
        return {
            dialogForm: {
                show: false,
                id: ''
            },
            isTotal: false,
            config: {
                name: 'enterpriseBillList',
                uselocal: true,
                col: [{
                    type: 'index',
                    prop: 'indexX',
                    label: '序号',
                    width: 50,
                    show: true,
                    align: 'center',
                    unSave: true
                },
                {
                    label: '开票类型',
                    prop: 'typeX',
                    width: 120
                },
                { label: '企业名称', prop: 'enterpriseName' },
                { label: '纳税人识别号', prop: 'taxNo' },
                { label: '注册地址', prop: 'address' },
                {
                    label: '注册电话',
                    prop: 'phone',
                    width: 100
                },
                { label: '电子邮箱', prop: 'email' },
                {
                    label: '默认发票',
                    slot: 'isMaster'
                },
                {
                    type: 'operate',
                    label: '操作',
                    width: 90,
                    btns: [{
                        name: '查看',
                        event: this.openDialog
                    }
                    ],
                    unSave: true
                }
                ]
            },
            list: []
        };
    },
    components: {
        InvoiceDetail
    },
    props: {
        enterpriseNo: {
            type: String,
            required: true
        }
    },
    methods: {
        // 列表数据
        getList () {
            let params = {
                enterpriseNo: this.enterpriseNo
            };
            this.Http(URL.list, {
                params
            }).then(res => {
                if (res.data) {
                    this.list = res.data.map((item, index) => {
                        item.typeX = item.type === 1 ? '增值税专用发票' : '增值税普通发票';
                        return item;
                    });
                    this.isTotal = res.data.length > 0;
                }
            });
        },
        openDialog (row) {
            this.dialogForm.id = row.id;
            this.dialogForm.show = true;
        }
    },
    mounted () {
        this.getList();
    },
    computed: {
        ...mapGetters(['userInfo', 'routers'])
    }
};

</script>
<style lang="scss">
</style>
