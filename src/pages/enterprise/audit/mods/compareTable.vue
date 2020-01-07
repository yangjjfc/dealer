<template>
    <el-table :data="list" stripe style="width: 100%" border size="small" class="my-table">
        <el-table-column prop="label" label="属性名称" width="120"></el-table-column>
        <el-table-column prop="current" label="当前版本">
            <template slot-scope="scope">
                <div :class="scope.row.isDiff ? 'text-danger' : '' " v-html="scope.row.current"></div>
            </template>
        </el-table-column>
        <el-table-column prop="old" :label="comLabel">
            <template slot-scope="scope">
                <div class="" v-html="scope.row.old"></div>
            </template>
        </el-table-column>
        <el-table-column label="对比结果" width="100" align="center">
            <template slot-scope="scope">
                <div class="text-danger" v-if="scope.row.isDiff">
                    <b class="el-icon-close"></b>
                </div>
                <div class="text-success" v-else>
                    <b class="el-icon-check"></b>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'compareTable',
    props: {
        name: {
            type: String
        },
        list: {
            type: Array,
            required: true
        }
    },
    computed: {
        comLabel () {
            if (this.name) {
                return this.name;
            } else {
                return '对比版本';
            }
        }
    }
};
</script>

<style scoped>

</style>
