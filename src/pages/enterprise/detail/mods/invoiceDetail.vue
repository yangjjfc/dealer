<template>
    <yl-dialog title="发票信息" :show.sync="shows" width="500px" hide-submit-button classx="mydialog">
        <el-form ref="dialogForm" :model="formData" label-width="120px" size="small" label-suffix="：">
            <el-form-item label="开票类型" prop="type">
                <p >
                    {{formData.type == 1 ? '增值税专用发票' : '增值税普通发票'}}
                </p>
            </el-form-item>
            <el-form-item label="企业名称" prop="invoiceTitle">
                <p>
                    {{formData.invoiceTitle}}
                </p>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="taxNo">
                <p>
                    {{formData.taxNo}}
                </p>
            </el-form-item>
            <el-form-item label="注册地址" prop="address" ref="address">
                <p>
                    {{formData.address}}
                </p>
            </el-form-item>
            <el-form-item label="开户银行" prop="bankDeposit" ref="bankDeposit">
                <p>
                    {{formData.bankDeposit}}
                </p>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankAccount" ref="bankAccount">
                <p>
                    {{formData.bankAccount}}
                </p>
            </el-form-item>
            <el-form-item label="注册电话" prop="phone" ref="phone">
                <p>
                    {{formData.phone}}
                </p>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <p>
                    {{formData.email}}
                </p>
            </el-form-item>
            <el-form-item label="默认发票" prop="isMaster">
                <p>
                    {{formData.isMaster == 1 ? '是' : '否'}}
                </p>
            </el-form-item>
        </el-form>
    </yl-dialog>
</template>
<script>
const URL = {
    detail: 'yhlo.brp.enterpriseInvoiceManager.get'
};
export default {
    data () {
        return {
            formData: {
                type: '',
                invoiceTitle: '',
                taxNo: '',
                address: '',
                bankDeposit: '',
                bankAccount: '',
                phone: '',
                email: '',
                isMaster: ''
            }
        };
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        id: {
            type: String,
            required: true
        }
    },
    methods: {
        async getDetail () {
            this.Http(URL.detail, {
                id: this.id
            }).then((res) => {
                let data = res.data;
                this.formData = data;
            });
        }

    },
    created () {
        this.getDetail();
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        }
    }
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
