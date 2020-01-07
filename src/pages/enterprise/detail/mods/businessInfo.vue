<template>
    <el-row>
        <el-col :span="20">
            <el-form size="small" label-width="120px" label-suffix="：" @submit.native.prevent>
                <el-form-item label="业务员">
                    <span v-if="isView">{{form.salesman}}</span>
                    <el-select v-model="form.salesman" filterable placeholder="请选择" size="small" :disabled="isView" v-else>
                        <el-option v-for="item in salesman_opt" :key="item.employeeNumber" :label="item.userName" :value="item.userName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结算方式" prop="payType">
                    <span v-if="isView">{{getSelectValue(form.payType,payment_code_opt) || '-'}}</span>
                    <el-select v-model="form.payType" placeholder="请选择" size="small" :disabled="isView" v-else>
                        <el-option v-for="item in payment_code_opt" :key="item.number" :label="item.dictVal" :value="item.number">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户性质" prop="payType">
                    <span v-if="isView">{{getSelectValue(form.customerType,customer_type_opt) || '-'}}</span>
                    <el-select v-model="form.customerType" placeholder="请选择" size="small" :disabled="isView" v-else>
                        <el-option v-for="item in customer_type_opt" :key="item.number" :label="item.dictVal" :value="item.number">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户等级" prop="payType">
                    <span v-if="isView">{{getSelectValue(form.customerLevel,customer_level_opt) || '-'}}</span>
                    <el-select v-model="form.customerLevel" placeholder="请选择" size="small" :disabled="isView" v-else>
                        <el-option v-for="item in customer_level_opt" :key="item.number" :label="item.dictVal" :value="item.number">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="isView = false" v-if="isView">修改</el-button>
                    <el-button type="primary" @click="save" v-else>保存</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
// import { Dictionarie } from '@/utils/custom/tools.js';
const URL = {
    save: 'yhlo.brp.enterpriseInstall.update',
    get: 'yhlo.brp.enterpriseInstall.get',
    getCurrentUsers: 'yhlo.brp.user.getCurrentUsers' // 业务员
};

export default {
    name: 'businessInfo',
    data () {
        return {
            isView: true,
            form: {
                salesman: '',
                customerType: '',
                customerLevel: '',
                payType: ''
            },
            salesman_opt: [], // 业务员
            payment_code_opt: [],
            customer_type_opt: [],
            customer_level_opt: []
        };
    },
    props: {
        enterpriseNo: {
            type: String
        }
    },
    methods: {
        // 获取业务员
        getsalesman () {
            this.Http(URL.getCurrentUsers).then(res => {
                this.salesman_opt = res.data;
            });
        },
        getSelectValue (id, source = []) {
            let result = '';
            source.forEach(item => {
                let value = item.number;
                if (id === value) {
                    result = item.dictVal;
                }
            });
            return result;
        },
        // 获取数据字典
        getDict () {
            // 现金类科目 ,收款银行 ,支付方式 ,收款银行
            // let dictKeys = ['payment_code', 'receipts_type', 'customer_type', 'customer_level'];
        },
        getDetail () {
            this.Http(URL.get, {
                enterpriseNo: this.enterpriseNo
            }).then(res => {
                if (res.data) {
                    this.form = res.data || {};
                    this.isView = true;
                }
            });
        },
        save () {
            this.Http(URL.save, {
                params: {
                    ...this.form,
                    enterpriseNo: this.enterpriseNo
                }
            }).then(res => {
                this.isView = true;
                this.$message.success('操作成功');
            });
        }
    },
    created () {
        this.getDetail();
        this.getsalesman();
        this.getDict();
    }
};
</script>

<style scoped>

</style>
