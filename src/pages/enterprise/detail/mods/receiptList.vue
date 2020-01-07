<template>
    <div>
        <div class="searchBox clearfix">
            <el-form size="small" inline class="right">
                <el-form-item>
                    <el-button type="primary" size="small" @click="getList">刷新</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" border>
            <el-table-column type="index" label="序号" width="50" align="cneter"></el-table-column>
            <el-table-column prop="receiveUser" label="签收人"></el-table-column>
            <el-table-column prop="receivePhone" label="联系电话"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="receiveAddr" label="签收地址"></el-table-column>
            <el-table-column prop="addressType" label="地址类型"></el-table-column>
            <el-table-column prop="job" label="是否默认地址">
                <template slot-scope="scope">
                    {{scope.row.isMaster == '1' ? '是' : '否'}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
const URL = {
    list: 'yhlo.brp.enterpriseShippingAddress.getByNo'
};
export default {
    name: 'invoiceList',
    data () {
        return {
            list: []
        };
    },
    props: {
        enterpriseNo: {
            type: String,
            required: true
        }
    },
    methods: {
        getList () {
            this.Http(URL.list, {
                params: {
                    enterpriseNo: this.enterpriseNo
                }
            }).then(res => {
                let data = res.data;
                this.list = data;
            });
        }
    },
    created () {
        this.getList();
    }
};
</script>

<style scoped>

</style>
